import React from 'react';
import { motion } from 'framer-motion';

const NameExtractorHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="text-3xl font-bold text-white mb-4">
        🔍 Extrator de Nomes
      </h1>
      <p className="text-white/70 max-w-3xl mx-auto">
        Carregue um arquivo de contatos, filtre por localidade e extraia nomes de e-mails 
        com algoritmos inteligentes. Gere uma nova lista com os dados enriquecidos.
      </p>
    </motion.div>
  );
};

export default NameExtractorHeader;