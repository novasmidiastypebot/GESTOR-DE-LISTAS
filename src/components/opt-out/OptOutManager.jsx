import React from 'react';
import { motion } from 'framer-motion';
import { useOptOut } from '@/hooks/useOptOut';
import OptOutForm from '@/components/opt-out/OptOutForm';
import OptOutList from '@/components/opt-out/OptOutList';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const OptOutManager = () => {
  const {
    optOutList,
    totalOptOutCount,
    newItem,
    setNewItem,
    bulkItems,
    setBulkItems,
    file,
    isProcessing,
    progress,
    processedCount,
    totalCount,
    handleAddItem,
    handleBulkAdd,
    handleRemoveItem,
    handleFileUpload,
    processOptOutFile,
    exportOptOuts,
  } = useOptOut();

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-white">🚫 Gerenciador de Opt-out</h1>
            <Button
                onClick={exportOptOuts}
                variant="outline"
                className="bg-transparent border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                disabled={totalOptOutCount === 0}
            >
                <Download className="w-4 h-4 mr-2" />
                Exportar Tudo
            </Button>
        </div>
        <p className="text-white/70 max-w-2xl mx-auto">
          Gerencie a lista de e-mails e domínios que não devem ser contatados. Itens nesta lista serão ignorados durante a importação.
        </p>
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <OptOutForm
          newItem={newItem}
          setNewItem={setNewItem}
          bulkItems={bulkItems}
          setBulkItems={setBulkItems}
          onAddItem={handleAddItem}
          onBulkAdd={handleBulkAdd}
          onFileUpload={handleFileUpload}
          onProcessFile={processOptOutFile}
          file={file}
          isProcessing={isProcessing}
          progress={progress}
          processedCount={processedCount}
          totalCount={totalCount}
        />
        <OptOutList
          optOutList={optOutList}
          totalCount={totalOptOutCount}
          onRemoveItem={handleRemoveItem}
        />
      </motion.div>
    </div>
  );
};

export default OptOutManager;