import React from 'react';
import NameExtractorHeader from './NameExtractorHeader';
import FileUpload from './FileUpload';
import ExtractionResults from './ExtractionResults';
import { useNameExtractor } from '@/hooks/useNameExtractor';
import ImportReportModal from './ImportReportModal';
import AlgorithmInfo from './AlgorithmInfo';
import FormatGuide from './FormatGuide';

const NameExtractor = ({ onSendToEnricher }) => {
    const {
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
    } = useNameExtractor({ onSendToEnricher });

    return (
        <div className="space-y-8">
            <NameExtractorHeader />

            {!extractionResult ? (
                <>
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <FileUpload
                            file={file}
                            onFileChange={handleFileChange}
                            defaultData={defaultData}
                            onDefaultDataChange={setDefaultData}
                            onProcess={handleProcessFile}
                            isProcessing={isProcessing}
                            onReset={reset}
                            progress={progress}
                        />
                        <FormatGuide />
                    </div>
                    <AlgorithmInfo />
                </>
            ) : (
                <ExtractionResults
                    stats={extractionResult.stats}
                    extractedData={extractionResult.data}
                    onImport={handleImportContacts}
                    onDownload={handleDownloadExtracted}
                    onEnrich={handleSendToEnrich}
                    onReset={reset}
                    isImporting={isProcessing}
                    importProgress={progress.total > 0 ? (progress.processed / progress.total * 100) : 0}
                />
            )}

            {importReport && (
                <ImportReportModal
                    report={importReport}
                    onClose={() => setImportReport(null)}
                />
            )}
        </div>
    );
};

export default NameExtractor;