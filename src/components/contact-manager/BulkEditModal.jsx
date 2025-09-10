import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const BulkEditModal = ({ selectedCount, bulkData, setBulkData, onSave, onCancel, professions, branches }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-effect rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white mb-4">
          Edição em Massa ({selectedCount} contatos)
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-white/80 text-sm">Ramo</label>
            <select
              value={bulkData.branch}
              onChange={(e) => setBulkData(prev => ({ ...prev, branch: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow"
            >
              <option value="" className="bg-slate-800">Não alterar</option>
              {branches.map(branch => (
                <option key={branch} value={branch} className="bg-slate-800">{branch}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-white/80 text-sm">Profissão</label>
            <select
              value={bulkData.profession}
              onChange={(e) => setBulkData(prev => ({ ...prev, profession: e.target.value }))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow"
            >
              <option value="" className="bg-slate-800">Não alterar</option>
              {professions.map(profession => (
                <option key={profession} value={profession} className="bg-slate-800">{profession}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button onClick={onSave} className="btn-gradient text-white flex-1">
            Aplicar Alterações
          </Button>
          <Button onClick={onCancel} variant="outline" className="bg-transparent border-white/20 text-white/80 hover:bg-white/10 hover:text-white flex-1">
            Cancelar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BulkEditModal;