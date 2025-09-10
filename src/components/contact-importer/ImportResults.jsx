import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, UserPlus, UserCheck, Ban, Repeat } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white/5 p-4 rounded-lg text-center">
        <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-white/70">{label}</p>
    </div>
);

const ImportResults = ({ results, onReset }) => {
  const totalProcessedInList = (results.inserted || 0) + (results.updated || 0) + (results.invalid || 0) + (results.optOut || 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-8 text-center"
    >
      <div className="flex justify-center items-center mb-4">
        <CheckCircle className="w-16 h-16 text-green-400" />
      </div>
      <h3 className="text-2xl font-semibold text-white mb-2">Importação Concluída!</h3>
      <p className="text-white/70 mb-6">Veja o resumo da sua importação.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total na Lista" value={results.total || totalProcessedInList} color="text-blue-400" />
        <StatCard icon={UserPlus} label="Contatos Inseridos" value={results.inserted || 0} color="text-green-400" />
        <StatCard icon={UserCheck} label="Contatos Atualizados" value={results.updated || 0} color="text-yellow-400" />
        <StatCard icon={Ban} label="Inválidos/Opt-out" value={(results.invalid || 0) + (results.optOut || 0)} color="text-red-400" />
      </div>

      <Button onClick={onReset} className="btn-gradient text-white">
        <Repeat className="w-4 h-4 mr-2" />
        Nova Importação
      </Button>
    </motion.div>
  );
};

export default ImportResults;