import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, Download, Building, Briefcase, MapPin } from 'lucide-react';
import { professions, branches } from '@/lib/appConstants';

const ImportFileUpload = ({ file, onFileUpload, onDownloadSample, isPasteMode, importData, setImportData }) => {
  const [pastedText, setPastedText] = useState('');

  const handlePasteAndUpload = () => {
    onFileUpload(pastedText, true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setImportData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-effect rounded-xl p-8 space-y-6"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          {isPasteMode ? <FileText className="w-10 h-10 text-white" /> : <Upload className="w-10 h-10 text-white" />}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {isPasteMode ? 'Cole sua Lista de E-mails' : 'Selecionar Arquivo'}
        </h3>
        <p className="text-white/70">
          {isPasteMode ? 'Um e-mail por linha.' : 'Formatos aceitos: CSV, TXT.'}
        </p>
      </div>

      {isPasteMode ? (
        <div className="space-y-4">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="email1@exemplo.com&#10;email2@exemplo.com&#10;email3@exemplo.com"
            rows="5"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
          />
          <Button onClick={handlePasteAndUpload} className="btn-gradient text-white w-full" disabled={!pastedText}>
            <CheckCircle className="w-5 h-5 mr-2" />
            Carregar Lista
          </Button>
        </div>
      ) : (
        <div className="text-center space-x-4">
          <input
            type="file"
            accept=".csv,.txt"
            onChange={onFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 btn-gradient text-white rounded-lg cursor-pointer hover:scale-105 transition-transform"
          >
            <FileText className="w-5 h-5 mr-2" />
            Escolher Arquivo
          </label>
          <Button
            onClick={onDownloadSample}
            variant="outline"
            className="bg-transparent border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar Exemplo
          </Button>
        </div>
      )}

      {file && !isPasteMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-green-500/20 rounded-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">{file.name}</span>
            <span className="text-green-400 text-sm">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        </motion.div>
      )}

      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Valores Padrão (Opcional)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              name="country"
              value={importData.country}
              onChange={handleInputChange}
              placeholder="País Padrão"
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
            />
          </div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              name="profession"
              value={importData.profession}
              onChange={handleInputChange}
              placeholder="Profissão Padrão"
              list="professions-list"
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
            />
            <datalist id="professions-list">
              {professions.map(p => <option key={p} value={p} />)}
            </datalist>
          </div>
          <div className="sm:col-span-2 relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              name="branch"
              value={importData.branch}
              onChange={handleInputChange}
              placeholder="Ramo Padrão"
              list="branches-list"
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
            />
             <datalist id="branches-list">
              {branches.map(b => <option key={b} value={b} />)}
            </datalist>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImportFileUpload;