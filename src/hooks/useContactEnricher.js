import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useContactEnricher = () => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState({ headers: [], rows: [] });
    const [columnMapping, setColumnMapping] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [enrichResults, setEnrichResults] = useState(null);
    const [progress, setProgress] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const dbColumns = [
        { key: 'email', label: 'E-mail', required: true },
        { key: 'name', label: 'Nome' },
        { key: 'phone', label: 'Telefone' },
        { key: 'country', label: 'País' },
        { key: 'state', label: 'Estado' },
        { key: 'city', label: 'Cidade' },
        { key: 'website', label: 'Website' },
        { key: 'profession', label: 'Profissão' },
        { key: 'branch', label: 'Ramo' },
    ];
    
    const parseFileContent = useCallback((content) => {
        const lines = content.split(/[\n\r]+/).map(line => line.trim()).filter(Boolean);
        if (lines.length === 0) {
            toast({ title: "Conteúdo vazio", description: "Nenhuma linha de dados encontrada.", variant: "destructive" });
            return null;
        }
        
        const headers = lines[0].split(';').map(h => h.trim());
        const rows = lines.slice(1).map(line => {
            const values = line.split(';');
            const rowObject = {};
            headers.forEach((header, index) => {
                rowObject[header] = values[index]?.trim() || '';
            });
            return rowObject;
        });

        const newColumnMapping = {};
        headers.forEach((header) => {
            const normalizedHeader = header.toLowerCase();
            const match = dbColumns.find(dbCol => normalizedHeader.includes(dbCol.key));
            if (match) {
                newColumnMapping[header] = match.key;
            }
        });
        
        return { headers, rows, newColumnMapping };
    }, [dbColumns]);

    const resetProcess = useCallback(() => {
        setCurrentStep(1);
        setFile(null);
        setFileData({ headers: [], rows: [] });
        setColumnMapping({});
        setIsProcessing(false);
        setEnrichResults(null);
        setProgress(0);
        setProcessedCount(0);
        setTotalCount(0);
    }, []);

    const loadInitialData = useCallback((data) => {
        const headers = Object.keys(data[0]);
        const rows = data.map(row => {
            const rowObject = {};
            headers.forEach(header => {
                rowObject[header] = row[header];
            });
            return rowObject;
        });

        const { newColumnMapping } = parseFileContent(headers.join(';') + '\n');
        
        setFileData({ headers, rows });
        setColumnMapping(newColumnMapping);
        setTotalCount(rows.length);
        setCurrentStep(2);
    }, [parseFileContent]);

    const handleFileUpload = async (event) => {
        const uploadedFile = event.target.files[0];
        if (!uploadedFile) return;

        const validExtensions = ['.txt', '.csv'];
        const hasValidExtension = validExtensions.some(ext => uploadedFile.name.toLowerCase().endsWith(ext));
        if (!hasValidExtension) {
            toast({ title: "Formato inválido ❌", description: "Por favor, selecione um arquivo TXT ou CSV.", variant: "destructive" });
            return;
        }

        setFile(uploadedFile);
        const text = await uploadedFile.text();
        const parsed = parseFileContent(text);

        if(parsed) {
            setFileData({ headers: parsed.headers, rows: parsed.rows });
            setColumnMapping(parsed.newColumnMapping);
            setTotalCount(parsed.rows.length);
            setCurrentStep(2);
            toast({ title: "Arquivo carregado! 📁", description: "Mapeie as colunas para continuar." });
        }
    };

    const handleColumnMapping = (header, dbField) => {
        setColumnMapping(prev => ({ ...prev, [header]: dbField }));
    };

    const processEnrichment = async () => {
        if (!Object.values(columnMapping).includes('email')) {
            toast({ title: "Mapeamento incompleto", description: "O campo E-mail é obrigatório.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);
        setCurrentStep(3);

        const contactsToUpsert = fileData.rows.map(row => {
            const contact = {};
            Object.entries(columnMapping).forEach(([header, dbField]) => {
                if (dbField) {
                    contact[dbField] = row[header] || null;
                }
            });
            return contact;
        }).filter(c => c.email && c.email.includes('@')).map(c => ({...c, import_date: new Date().toISOString(), created_at: new Date().toISOString()}));

        const contactsCount = contactsToUpsert.length;
        setTotalCount(contactsCount);
        setProcessedCount(0);
        setProgress(0);

        try {
            const { error } = await supabase.functions.invoke('handle-data-flow', {
                body: {
                    action: 'process_upsert',
                    payload: { contacts: contactsToUpsert }
                }
            });

            if (error) throw error;

            setEnrichResults({
                total: fileData.rows.length,
                processed: contactsCount,
                errors: fileData.rows.length - contactsCount,
            });
            setCurrentStep(4);
            toast({ title: "Processamento Iniciado! 🚀", description: `Sua lista com ${contactsCount} contatos está sendo processada em segundo plano.` });

        } catch (error) {
            toast({ title: "Erro ao iniciar enriquecimento", description: error.message, variant: "destructive" });
            setCurrentStep(2);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        currentStep,
        file,
        fileData,
        columnMapping,
        isProcessing,
        enrichResults,
        progress,
        processedCount,
        totalCount,
        dbColumns,
        handleFileUpload,
        handleColumnMapping,
        processEnrichment,
        resetProcess,
        setCurrentStep,
        loadInitialData,
    };
};