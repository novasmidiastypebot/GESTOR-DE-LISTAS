import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload, Download, Search, FileText, CheckCircle, Building, Briefcase, MapPin, RotateCw, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { professions, branches } from '@/lib/appConstants';
import { toast } from '@/components/ui/use-toast';

const FileUpload = ({ file, onFileChange, defaultData, onDefaultDataChange, onProcess, isProcessing, onReset, progress }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onDefaultDataChange(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (event) => {
    onFileChange(event);
  };

  const onDownloadSample = () => {
    const sampleContent = "email@example.com;Brasil;SP;São Paulo;Desenvolvedor;Tecnologia\n" +
                          "contato@empresa.com.br\n" +
                          "joao.silva@gmail.com;;;;\n" +
                          "ana.souza@hotmail.com;Portugal\n";
    const blob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "exemplo_extracao.txt");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    toast({ title: "Download do Exemplo Iniciado!" });
  };

  const progressPercentage = progress.total > 0 ? (progress.processed / progress.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-effect rounded-xl p-8 space-y-6"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Selecionar Arquivo de Dados
        </h3>
        <p className="text-white/70">
          Carregue um arquivo TXT ou CSV para extração.
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="file"
          accept=".txt,.csv"
          onChange={handleFileUpload}
          className="hidden"
          id="email-file-upload"
          disabled={isProcessing}
        />
        <div className="flex justify-center gap-4">
          <label
            htmlFor="email-file-upload"
            className={`inline-flex items-center px-6 py-3 btn-gradient text-white rounded-lg cursor-pointer hover:scale-105 transition-transform ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Escolher Arquivo
          </label>
          <Button
            onClick={onDownloadSample}
            className="bg-white/10 hover:bg-white/20 text-white"
            disabled={isProcessing}
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar Exemplo
          </Button>
        </div>
      </div>

      {file && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-green-500/20 rounded-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">{file.name}</span>
            <span className="text-green-400 text-sm">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
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
              value={defaultData.country}
              onChange={handleInputChange}
              placeholder="País Padrão"
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
              disabled={isProcessing}
            />
          </div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              name="profession"
              value={defaultData.profession}
              onChange={handleInputChange}
              placeholder="Profissão Padrão"
              list="professions-list"
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
              disabled={isProcessing}
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
              value={defaultData.branch}
              onChange={handleInputChange}
              placeholder="Ramo Padrão"
              list="branches-list"
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
              disabled={isProcessing}
            />
             <datalist id="branches-list">
              {branches.map(b => <option key={b} value={b} />)}
            </datalist>
          </div>
        </div>
      </div>

      {file && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <Button onClick={onProcess} disabled={isProcessing || !file} className="btn-gradient-green w-full sm:w-auto">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Iniciar Processamento
              </>
            )}
          </Button>
          {isProcessing && (
            <div className="w-full max-w-sm text-center">
              <Progress value={progressPercentage} className="w-full" />
              <p className="text-sm text-white/70 mt-2">
                {progress.processed} / {progress.total} linhas processadas
              </p>
            </div>
          )}
          <Button onClick={onReset} variant="ghost" className="text-white/70 hover:text-white" disabled={isProcessing}>
            <RotateCw className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default FileUpload;