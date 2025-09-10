import React from 'react';
import { motion } from 'framer-motion';

const ImportFormatGuide = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-effect rounded-xl p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-4">
        📋 Como Funciona
      </h3>
      
      <p className="text-white/70 mb-4">
          A primeira linha do seu arquivo (ou texto colado) será usada como cabeçalho para o mapeamento das colunas.
      </p>

      <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <div className="text-white/70 mb-2">Exemplo (separado por ponto e vírgula):</div>
        <div className="text-green-400">email;nome;telefone;cidade</div>
        <div className="text-cyan-400">contato@empresa.com;Nome Contato;11999999999;São Paulo</div>
        <div className="text-cyan-400">info@negocio.com;Outro Nome;21988888888;Lisboa</div>
      </div>
      
      <div className="mt-4 text-white/70 text-sm space-y-2">
        <p>✔️ O campo <strong>E-mail</strong> é obrigatório para o mapeamento.</p>
        <p>✔️ O sistema irá inserir novos contatos e atualizar os existentes com base no e-mail (lógica "upsert").</p>
        <p>✔️ Colunas não mapeadas serão ignoradas.</p>
      </div>
    </motion.div>
  );
};

export default ImportFormatGuide;