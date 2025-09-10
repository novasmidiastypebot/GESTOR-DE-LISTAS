import React from 'react';
import { motion } from 'framer-motion';

const AlgorithmInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-effect rounded-xl p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-4">
        🧠 Como Funciona a Extração
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2 flex items-center">
            📧 Domínios Genéricos
          </h4>
          <p className="text-white/70 text-sm mb-2">
            Para e-mails em domínios como Gmail, Yahoo, Hotmail:
          </p>
          <ul className="text-white/60 text-sm space-y-1 list-disc list-inside">
            <li>Extrai do nome de usuário</li>
            <li>Remove números e símbolos</li>
            <li>Identifica nomes comuns</li>
            <li>Ex: joao.silva@gmail.com → João</li>
          </ul>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2 flex items-center">
            🏢 Domínios Corporativos
          </h4>
          <p className="text-white/70 text-sm mb-2">
            Para e-mails em domínios de empresas:
          </p>
          <ul className="text-white/60 text-sm space-y-1 list-disc list-inside">
            <li>Extrai do nome do domínio</li>
            <li>Usa o nome da empresa</li>
            <li>Capitaliza primeira letra</li>
            <li>Ex: contato@empresa.com → Empresa</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AlgorithmInfo;