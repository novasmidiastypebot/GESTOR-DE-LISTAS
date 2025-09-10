import React from 'react';
import { motion } from 'framer-motion';

const FormatGuide = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-effect rounded-xl p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-4">
        📋 Formato do Arquivo de Entrada
      </h3>
      
      <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm space-y-4">
        <div>
          <div className="text-white/70 mb-2">Formato Completo (com ponto e vírgula):</div>
          <div className="text-green-400">email;país;estado;cidade;profissão;ramo</div>
          <div className="text-cyan-400">eliana@...;BR;SP;Campinas;Engenheira;Construção</div>
        </div>
        <div>
          <div className="text-white/70 mb-2">Formato Simples (apenas e-mails):</div>
          <div className="text-green-400">email@exemplo.com</div>
          <div className="text-cyan-400">contato@empresa.com</div>
        </div>
      </div>
      
      <div className="mt-4 text-white/70 text-sm space-y-1">
        <p><strong>Requisitos:</strong> Arquivo TXT ou CSV.</p>
        <p><strong>Flexibilidade:</strong> O sistema detecta automaticamente as colunas presentes.</p>
        <p><strong>Valores Padrão:</strong> Se um campo estiver vazio na lista, o valor padrão que você definir será usado.</p>
        <p><strong>Saída:</strong> Arquivo CSV no formato "Nome","Email","País","Estado","Cidade","Profissão","Ramo".</p>
      </div>
    </motion.div>
  );
};

export default FormatGuide;