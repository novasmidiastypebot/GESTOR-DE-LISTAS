import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import * as nameExtractorService from '@/lib/name-extractor/nameExtractorService';
import { supabase } from '@/lib/supabaseClient';

export const useNameExtractor = ({ onSendToEnricher }) => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [defaultData, setDefaultData] = useState({ country: '', profession: '', branch: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ processed: 0, total: 0 });
    const [extractionResult, setExtractionResult] = useState(null);
    const [importReport, setImportReport] = useState(null);

    const reset = useCallback(() => {
        setFile(null);
        setDefaultData({ country: '', profession: '', branch: '' });
        setIsProcessing(false);
        setProgress({ processed: 0, total: 0 });
        setExtractionResult(null);
        setImportReport(null);
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const validExtensions = ['.txt', '.csv'];
        const hasValidExtension = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

        if (!hasValidExtension) {
            toast({
                title: "Formato de arquivo inválido",
                description: "Por favor, selecione um arquivo .txt ou .csv.",
                variant: "destructive",
            });
            e.target.value = '';
            return;
        }
        setFile(selectedFile);
    };

    const handleProcessFile = async () => {
        if (!file) {
            toast({ title: "Nenhum arquivo selecionado", description: "Por favor, selecione um arquivo para processar.", variant: "destructive" });
            return;
        }
        setIsProcessing(true);
        setProgress({ processed: 0, total: 0 });
        try {
            const { extractedData, stats } = await nameExtractorService.processFile({
                file,
                defaultData,
                onProgress: (p) => setProgress(p),
            });
            setExtractionResult({ data: extractedData, stats });
            toast({ title: "Extração Concluída!", description: `${stats.processedEmails} e-mails únicos foram processados.` });
        } catch (error) {
            toast({ title: "Erro na Extração", description: error.message, variant: "destructive" });
            reset();
        } finally {
            setIsProcessing(false);
        }
    };

    const handleImportContacts = async () => {
        if (!extractionResult?.data || extractionResult.data.length === 0) {
            toast({ title: "Nenhum dado para importar", variant: "destructive" });
            return;
        }
        setIsProcessing(true);
        setProgress({ processed: 0, total: 0 });
        try {
            const { totalInserted, totalUpdated, optedOut, totalProcessed } = await nameExtractorService.importContacts({
                contacts: extractionResult.data,
                userId: user.id,
                onProgress: (p) => setProgress(p),
            });

            const { error: syncError } = await supabase.rpc('sync_user_stats', { p_user_id: user.id });
            if (syncError) {
                console.error('Error syncing user stats:', syncError);
                toast({ title: "Erro ao sincronizar estatísticas", description: syncError.message, variant: "destructive" });
            }

            setImportReport({
                total: totalProcessed,
                inserted: totalInserted,
                updated: totalUpdated,
                optOut: optedOut,
            });

            toast({
                title: "Importação Finalizada!",
                description: `${totalInserted} novos contatos foram adicionados e ${totalUpdated} foram atualizados.`,
            });
        } catch (error) {
            toast({ title: "Erro na Importação", description: error.message, variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleDownloadExtracted = () => {
        if (!extractionResult?.data || extractionResult.data.length === 0) {
            toast({ title: "Nenhum dado para baixar", variant: "destructive" });
            return;
        }

        const headers = ['email', 'name', 'country', 'state', 'city', 'website', 'profession', 'branch'];
        const csvContent = [
            headers.join(';'),
            ...extractionResult.data.map(row => 
                headers.map(header => row[header] || '').join(';')
            )
        ].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'dados_extraidos.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Download Iniciado!", description: "Seu arquivo CSV está sendo baixado." });
    };

    const handleSendToEnrich = () => {
        if (!extractionResult?.data || extractionResult.data.length === 0) {
            toast({ title: "Nenhum dado para enviar", variant: "destructive" });
            return;
        }
        if (onSendToEnricher) {
            onSendToEnricher(extractionResult.data);
            toast({ title: "Enviado para Enriquecimento!", description: "Continue o processo na aba Enriquecer." });
        }
    };


    return {
        file,
        defaultData,
        isProcessing,
        progress,
        extractionResult,
        importReport,
        handleFileChange,
        setDefaultData,
        handleProcessFile,
        handleImportContacts,
        handleDownloadExtracted,
        handleSendToEnrich,
        reset,
        setImportReport,
    };
};