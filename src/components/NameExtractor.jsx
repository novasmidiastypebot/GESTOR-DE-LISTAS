import React from 'react';
import { motion } from 'framer-motion';
import { useNameExtractor } from '@/hooks/useNameExtractor';
import FileUpload from '@/components/name-extractor/FileUpload';
import FilterControls from '@/components/name-extractor/FilterControls';
import ExtractionResults from '@/components/name-extractor/ExtractionResults';
import AlgorithmInfo from '@/components/name-extractor/AlgorithmInfo';
import FormatGuide from '@/components/name-extractor/FormatGuide';
import NameExtractorHeader from '@/components/name-extractor/NameExtractorHeader';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const NameExtractor = () => {
  const {
    file,
    isProcessing,
    extractResults,
    filterOptions,
    filters,
    setFilters,
    filteredData,
    progress,
    processedCount,
    totalCount,
    handleFileUpload,
    processExtraction,
    downloadResults,
    downloadSampleFile,
    resetExtraction,
  } = useNameExtractor();

  return (
    <div className="space-y-6">
      <NameExtractorHeader />

      {!extractResults && !isProcessing ? (
        <>
          <FileUpload 
            file={file} 
            onFileUpload={handleFileUpload} 
            onDownloadSample={downloadSampleFile}
          />

          {file && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Button
                onClick={processExtraction}
                disabled={isProcessing}
                className="btn-gradient text-white px-8 py-3 text-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Processar Arquivo e Extrair Nomes
              </Button>
            </motion.div>
          )}
        </>
      ) : null}

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Processando Extração...</h3>
          <Progress value={progress} className="w-full" />
          <div className="text-center text-white/80 mt-2">
            <p>{Math.round(progress)}%</p>
            <p>{processedCount} / {totalCount} linhas processadas</p>
          </div>
        </motion.div>
      )}

      {extractResults && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <FilterControls
            filters={filters}
            setFilters={setFilters}
            options={filterOptions}
          />
          <ExtractionResults
            results={extractResults}
            filteredData={filteredData}
            onDownload={downloadResults}
            onReset={resetExtraction}
          />
        </motion.div>
      )}

      <AlgorithmInfo />
      <FormatGuide />
    </div>
  );
};

export default NameExtractor;