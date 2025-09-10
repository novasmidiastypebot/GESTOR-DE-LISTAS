import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Upload, FileText, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const OptOutForm = ({ 
  newItem, setNewItem, bulkItems, setBulkItems, onAddItem, onBulkAdd, 
  onFileUpload, onProcessFile, file, isProcessing, progress, processedCount, totalCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Adicionar Manualmente</h3>
        <form onSubmit={onAddItem} className="flex gap-3 mb-6">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="email@exemplo.com ou exemplo.com"
            className="flex-grow px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
            required
            disabled={isProcessing}
          />
          <Button type="submit" className="btn-gradient text-white" disabled={isProcessing}>
            <Plus className="w-5 h-5" />
          </Button>
        </form>
        
        <h4 className="text-lg font-semibold text-white mb-2">Ou colar uma lista</h4>
        <div className="flex flex-col gap-3">
          <textarea
            value={bulkItems}
            onChange={(e) => setBulkItems(e.target.value)}
            placeholder="Um item por linha, ou separado por vírgula/ponto e vírgula"
            rows="3"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
            disabled={isProcessing}
          />
          <Button onClick={onBulkAdd} className="btn-gradient text-white" disabled={isProcessing}>
            Adicionar Lista
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-xl p-6 flex flex-col"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Importar de Arquivo</h3>
        <p className="text-white/70 mb-4">Use arquivos .TXT ou .CSV com um e-mail ou domínio por linha.</p>
        
        {isProcessing ? (
          <div className="flex-grow flex flex-col items-center justify-center bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Processando Arquivo...</h3>
              <Progress value={progress} className="w-full" />
              <div className="text-center text-white/80 mt-2">
                <p>{Math.round(progress)}%</p>
                <p>{processedCount} / {totalCount} itens processados</p>
              </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center bg-white/5 rounded-lg p-4">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={onFileUpload}
              className="hidden"
              id="optout-file-upload"
            />

            {!file && (
              <label
                htmlFor="optout-file-upload"
                className="inline-flex items-center px-6 py-3 border-2 border-dashed border-white/30 text-white/70 rounded-lg cursor-pointer hover:border-white hover:text-white transition-all"
              >
                <FileText className="w-5 h-5 mr-2" />
                Escolher Arquivo
              </label>
            )}

            {file && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-green-300 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <Button onClick={onProcessFile} className="btn-gradient text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Processar Arquivo
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OptOutForm;