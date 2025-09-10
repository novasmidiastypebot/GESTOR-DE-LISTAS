import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

export const useListMerger = () => {
    const { user } = useAuth();
    const [inputFiles, setInputFiles] = useState([]);
    const [optOutFile, setOptOutFile] = useState(null);
    const [options, setOptions] = useState({
        applyDbOptOut: true,
        removeDuplicates: true,
        removeMuseum: true,
        removeSystem: true,
    });
    const [outputSize, setOutputSize] = useState(50000);
    const [isProcessing, setIsProcessing] = useState(false);
    const [report, setReport] = useState(null);
    const [downloadLinks, setDownloadLinks] = useState([]);

    useEffect(() => {
        if (!user) return;

        const channel = supabase.channel(`merger_notifications:${user.id}`);

        channel
            .on('broadcast', { event: 'merger_completion' }, ({ payload }) => {
                setIsProcessing(false);
                if (payload.success) {
                    setReport(payload.report);
                    setDownloadLinks(payload.downloadLinks);
                    toast({
                        title: "Processamento de Mesclagem Concluído!",
                        description: `Relatório e arquivos prontos. Total de ${payload.downloadLinks.length} arquivos gerados.`,
                        variant: "success",
                    });
                } else {
                    toast({
                        title: "Erro no Processamento da Mesclagem",
                        description: payload.error || "Ocorreu um erro desconhecido.",
                        variant: "destructive",
                    });
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Subscribed to merger notifications channel');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, toast]);


    const handleInputFilesChange = (e) => {
        const files = Array.from(e.target.files);
        setInputFiles(prev => [...prev, ...files]);
    };

    const handleOptOutFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setOptOutFile(file);
        }
    };

    const handleRemoveFile = (index, type) => {
        if (type === 'input') {
            setInputFiles(prev => prev.filter((_, i) => i !== index));
        } else if (type === 'optout') {
            setOptOutFile(null);
        }
    };

    const handleOptionChange = (option, value) => {
        setOptions(prev => ({ ...prev, [option]: value }));
    };

    const handleOutputSizeChange = (e) => {
        setOutputSize(Number(e.target.value));
    };

    const processLists = async () => {
        if (inputFiles.length === 0) {
            toast({ title: "Nenhum arquivo de entrada", description: "Por favor, selecione pelo menos um arquivo para processar.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);
        setReport(null);
        setDownloadLinks([]);
        toast({ title: "Iniciando processamento...", description: "Suas listas estão sendo enviadas para o servidor. Você será notificado quando terminar." });

        try {
            const formData = new FormData();
            inputFiles.forEach(file => {
                formData.append('inputFiles', file);
            });
            if (optOutFile) {
                formData.append('optOutFile', optOutFile);
            }
            formData.append('options', JSON.stringify(options));
            formData.append('outputSize', outputSize);

            const { data, error } = await supabase.functions.invoke('list-merger', {
                body: formData,
            });

            if (error) throw error;

            if (data.message !== "Processing started") {
                 throw new Error("Failed to start background processing.");
            }

        } catch (error) {
            console.error("List merger error:", error);
            toast({ title: "Erro ao iniciar o processamento", description: error.message, variant: "destructive" });
            setIsProcessing(false);
        }
    };

    return {
        inputFiles,
        optOutFile,
        options,
        outputSize,
        isProcessing,
        report,
        downloadLinks,
        handleInputFilesChange,
        handleOptOutFileChange,
        handleRemoveFile,
        handleOptionChange,
        handleOutputSizeChange,
        processLists,
    };
};