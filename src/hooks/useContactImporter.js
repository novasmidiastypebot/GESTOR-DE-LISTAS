import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { isValidEmail } from '@/lib/nameExtractor.utils';

const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = new TextDecoder('utf-8', { fatal: true }).decode(event.target.result);
                resolve(text);
            } catch (e) {
                try {
                    const text = new TextDecoder('latin1').decode(event.target.result);
                    resolve(text);
                } catch (err) {
                    reject(new Error('Falha ao decodificar o arquivo. Tente salvar como UTF-8.'));
                }
            }
        };
        reader.onerror = () => {
            reject(new Error("Não foi possível ler o arquivo."));
        };
        reader.readAsArrayBuffer(file);
    });
};


export const useContactImporter = () => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState({ headers: [], rows: [] });
    const [columnMapping, setColumnMapping] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [importResults, setImportResults] = useState(null);
    const [progress, setProgress] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [defaultValues, setDefaultValues] = useState({ country: '', profession: '', branch: '' });

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

    const resetProcess = useCallback(() => {
        setCurrentStep(1);
        setFile(null);
        setFileData({ headers: [], rows: [] });
        setColumnMapping({});
        setIsProcessing(false);
        setImportResults(null);
        setProgress(0);
        setProcessedCount(0);
        setTotalCount(0);
        setDefaultValues({ country: '', profession: '', branch: '' });
    }, []);

    useEffect(() => {
        if (!user) return;

        const channel = supabase.channel(`import_notifications:${user.id}`);

        const handleRealtimeMessage = (message) => {
            if (message.event === 'import_completion') {
                const { success, inserted, updated, error } = message.payload;
                if (success) {
                    toast({
                        title: "Processamento Concluído! 🎉",
                        description: `Sua lista foi processada. Inseridos: ${inserted}, Atualizados: ${updated}.`,
                        variant: "success",
                        duration: 9000,
                    });
                } else {
                    toast({
                        title: "Erro no Processamento 🚨",
                        description: `Houve um problema ao processar sua lista: ${error}`,
                        variant: "destructive",
                        duration: 9000,
                    });
                }
            }
        };

        channel
          .on('broadcast', { event: 'import_completion' }, handleRealtimeMessage)
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to import notifications channel!');
            }
            if (status === 'CHANNEL_ERROR') {
              console.error('Failed to subscribe to import notifications channel.');
            }
          });


        return () => {
            channel.unsubscribe();
        };
    }, [user, toast]);

    const handleFileUpload = useCallback(async (eventOrPastedText, isPaste = false) => {
        let content = '';
        try {
            if (isPaste) {
                content = eventOrPastedText;
            } else {
                const uploadedFile = eventOrPastedText.target.files?.[0];
                if (!uploadedFile) return;

                const validExtensions = ['.txt', '.csv'];
                const hasValidExtension = validExtensions.some(ext => uploadedFile.name.toLowerCase().endsWith(ext));
                if (!hasValidExtension) {
                    toast({ title: "Formato inválido ❌", description: "Por favor, selecione um arquivo TXT ou CSV.", variant: "destructive" });
                    return;
                }
                setFile(uploadedFile);
                content = await readFileAsText(uploadedFile);
            }
        } catch (error) {
            toast({ title: "Erro ao ler arquivo", description: error.message, variant: "destructive" });
            return;
        }

        if (!content.trim()) {
            toast({ title: "Conteúdo vazio", description: "O conteúdo fornecido está vazio.", variant: "destructive" });
            return;
        }

        const lines = content.split(/[\n\r]+/).map(line => line.trim()).filter(Boolean);
        if (lines.length === 0) {
            toast({ title: "Arquivo vazio", description: "Nenhuma linha de dados encontrada.", variant: "destructive" });
            return;
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

        setFileData({ headers, rows });
        
        const newColumnMapping = {};
        headers.forEach((header) => {
            const normalizedHeader = header.toLowerCase();
            const match = dbColumns.find(dbCol => normalizedHeader.includes(dbCol.key));
            if (match) {
                newColumnMapping[header] = match.key;
            }
        });
        setColumnMapping(newColumnMapping);
        
        setCurrentStep(2);
        toast({ title: "Dados carregados! 📁", description: "Mapeie as colunas para continuar." });
    }, [dbColumns, toast]);

    const handleColumnMapping = (header, dbField) => {
        setColumnMapping(prev => ({ ...prev, [header]: dbField }));
    };

    const processImport = async () => {
        if (!Object.values(columnMapping).includes('email')) {
            toast({ title: "Mapeamento incompleto", description: "O campo E-mail é obrigatório.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);
        setCurrentStep(3);

        const { data: optOutData, error: optOutError } = await supabase.from('opt_out_emails').select('email, type').eq('user_id', user.id);
        if (optOutError) {
             toast({ title: "Erro ao buscar opt-outs", description: optOutError.message, variant: "destructive" });
             setIsProcessing(false);
             setCurrentStep(2);
             return;
        }
        const optOutEmails = new Set(optOutData.filter(item => item.type === 'email').map(item => item.email));
        const optOutDomains = new Set(optOutData.filter(item => item.type === 'domain').map(item => item.email));


        const contactsToUpsert = fileData.rows.map(row => {
            const contact = {};
            Object.entries(columnMapping).forEach(([header, dbField]) => {
                if (dbField) {
                    contact[dbField] = row[header] || null;
                }
            });
            return contact;
        }).filter(c => {
            if (!c.email || !isValidEmail(c.email)) return false;
            const domain = c.email.split('@')[1];
            if (optOutEmails.has(c.email.toLowerCase()) || (domain && optOutDomains.has(domain))) return false;
            return true;
        }).map(c => ({...c, import_date: new Date().toISOString(), created_at: new Date().toISOString()}));

        const contactsCount = contactsToUpsert.length;
        const totalOriginal = fileData.rows.length;
        setTotalCount(contactsCount);
        setProcessedCount(0);
        setProgress(0);

        try {
            const { error } = await supabase.functions.invoke('handle-data-flow', {
                body: {
                    action: 'process_upsert',
                    payload: { 
                        contacts: contactsToUpsert,
                        defaultValues: defaultValues 
                    }
                }
            });

            if (error) throw error;

            setImportResults({
                total: totalOriginal,
                processed: contactsCount,
                errors: totalOriginal - contactsCount,
            });
            setCurrentStep(4);
            toast({ title: "Processamento Iniciado! 🚀", description: `Sua lista com ${contactsCount} contatos está sendo processada em segundo plano.` });

        } catch (error) {
            toast({ title: "Erro ao iniciar importação", description: error.message, variant: "destructive" });
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
        importResults,
        progress,
        processedCount,
        totalCount,
        dbColumns,
        defaultValues,
        setDefaultValues,
        handleFileUpload,
        handleColumnMapping,
        processImport,
        resetProcess,
        setCurrentStep,
    };
};