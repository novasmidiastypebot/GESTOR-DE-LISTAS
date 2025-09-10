import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Import, FileText } from 'lucide-react';
import { useContactImporter } from '@/hooks/useContactImporter';
import { professions, branches } from '@/lib/appConstants';
import ImportFileUpload from '@/components/contact-importer/ImportFileUpload';
import ImportFormatGuide from '@/components/contact-importer/ImportFormatGuide';
import ImportProcessing from '@/components/contact-importer/ImportProcessing';
import ImportResults from '@/components/contact-importer/ImportResults';
import ImportOptions from '@/components/contact-importer/ImportOptions';
import { Button } from './ui/button';
import { ListChecks } from 'lucide-react';


const ContactImporter = () => {
    const {
        file,
        contacts,
        importData,
        setImportData,
        validationResults,
        isProcessing,
        importResults,
        handleFileUpload,
        validateContacts,
        importContacts,
        reset,
        progress,
        processedCount,
        totalCount,
        downloadSampleFile,
    } = useContactImporter();

    const renderInitialView = (isPasteMode = false) => (
        <div className="grid md:grid-cols-2 gap-8 items-start">
            <ImportFileUpload 
                onFileUpload={handleFileUpload} 
                file={file} 
                importData={importData}
                setImportData={setImportData}
                isPasteMode={isPasteMode}
                onDownloadSample={downloadSampleFile}
                professions={professions}
                branches={branches}
            />
            <ImportFormatGuide />
        </div>
    );

    const renderValidationButton = () => (
        <div className="mt-8 text-center">
            <motion.button
                onClick={validateContacts}
                className="btn-gradient px-8 py-3 rounded-lg text-white font-semibold flex items-center justify-center mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isProcessing}
            >
                <ListChecks className="w-5 h-5 mr-2" /> Validar e Continuar
            </motion.button>
        </div>
    );

    const renderContent = (isPasteMode = false) => {
        if (isProcessing) {
             return <ImportProcessing 
                title={validationResults ? "Importando Contatos..." : "Validando Contatos..."}
                progress={progress}
                processedCount={processedCount}
                totalCount={totalCount}
             />;
        }
        if (importResults) return <ImportResults results={importResults} onReset={reset} />;
        if (validationResults) return <ImportOptions results={validationResults} onConfirm={importContacts} onCancel={reset} professions={professions} branches={branches} defaultValues={importData} setDefaultValues={setImportData} />;
        
        return (
            <>
                {renderInitialView(isPasteMode)}
                {(file || contacts.length > 0) && renderValidationButton()}
            </>
        );
    };

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <h1 className="text-3xl font-bold text-white mb-4">📥 Importador de Contatos</h1>
                <p className="text-white/70 max-w-2xl mx-auto">Adicione novos contatos em massa a partir de arquivos CSV, TXT ou colando uma lista de e-mails.</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Tabs defaultValue="upload" className="w-full" onValueChange={reset}>
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 text-white/70">
                        <TabsTrigger value="upload" className="data-[state=active]:bg-white/10 data-[state=active]:text-white"><Import className="w-4 h-4 mr-2" />Importar Arquivo</TabsTrigger>
                        <TabsTrigger value="paste" className="data-[state=active]:bg-white/10 data-[state=active]:text-white"><FileText className="w-4 h-4 mr-2" />Colar Lista</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="mt-6">
                        {renderContent(false)}
                    </TabsContent>

                    <TabsContent value="paste" className="mt-6">
                        {renderContent(true)}
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default ContactImporter;