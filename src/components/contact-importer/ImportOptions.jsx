import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, X, Users, ShieldCheck, Trash2, Ban } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white/5 p-4 rounded-lg text-center">
        <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-white/70">{label}</p>
    </div>
);

const ImportOptions = ({ results, onConfirm, onCancel, defaultValues, setDefaultValues, professions, branches }) => {
  const handleDefaultValueChange = (e) => {
    const { name, value } = e.target;
    setDefaultValues(prev => ({...prev, [name]: value}));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-8"
    >
      <h3 className="text-2xl font-semibold text-white mb-2 text-center">Resultados da Validação</h3>
      <p className="text-white/70 text-center mb-6">Sua lista foi analisada. Revise os resultados e defina valores padrão antes de importar.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total na Lista" value={results.total} color="text-blue-400" />
        <StatCard icon={ShieldCheck} label="Válidos para Importar" value={results.toImport.length} color="text-green-400" />
        <StatCard icon={Trash2} label="Duplicados" value={results.duplicates} color="text-yellow-400" />
        <StatCard icon={Ban} label="Inválidos ou Opt-out" value={results.invalid + results.optOut} color="text-red-400" />
      </div>

      <div className="bg-white/5 p-6 rounded-lg mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">Valores Padrão para Importação</h4>
          <p className="text-sm text-white/70 mb-4">Estes valores serão usados se os campos correspondentes estiverem vazios no seu arquivo.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                  <label htmlFor="defaultCountry" className="block text-sm font-medium text-white/80 mb-1">País</label>
                  <input
                      type="text"
                      id="defaultCountry"
                      name="country"
                      value={defaultValues.country}
                      onChange={handleDefaultValueChange}
                      placeholder="Ex: Brasil"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
                  />
              </div>
              <div>
                  <label htmlFor="defaultBranch" className="block text-sm font-medium text-white/80 mb-1">Ramo</label>
                  <select
                      id="defaultBranch"
                      name="branch"
                      value={defaultValues.branch}
                      onChange={handleDefaultValueChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow"
                  >
                      <option value="" className="bg-slate-800">Selecione um Ramo</option>
                      {branches.map(branch => (
                          <option key={branch} value={branch} className="bg-slate-800">{branch}</option>
                      ))}
                  </select>
              </div>
              <div>
                  <label htmlFor="defaultProfession" className="block text-sm font-medium text-white/80 mb-1">Profissão</label>
                  <select
                      id="defaultProfession"
                      name="profession"
                      value={defaultValues.profession}
                      onChange={handleDefaultValueChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow"
                  >
                      <option value="" className="bg-slate-800">Selecione uma Profissão</option>
                      {professions.map(profession => (
                          <option key={profession} value={profession} className="bg-slate-800">{profession}</option>
                      ))}
                  </select>
              </div>
          </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onCancel} variant="outline" className="bg-transparent border-white/20 text-white/80 hover:bg-white/10 hover:text-white">
            <X className="w-5 h-5 mr-2" /> Cancelar
        </Button>
        <Button onClick={onConfirm} className="btn-gradient text-white" disabled={results.toImport.length === 0}>
            <Check className="w-5 h-5 mr-2" /> Importar {results.toImport.length} Contatos
        </Button>
      </div>
    </motion.div>
  );
};

export default ImportOptions;