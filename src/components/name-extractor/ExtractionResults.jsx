import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCw, Upload, Users, FileCheck, FileX, Sparkles, AlertTriangle, Loader2, Download, Zap } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="glass-effect p-4 rounded-lg text-center"
  >
    <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm text-white/70">{label}</p>
    {description && <p className="text-xs text-white/50 mt-1">{description}</p>}
  </motion.div>
);

const ExtractionResults = ({ stats, extractedData, onImport, onDownload, onEnrich, onReset, isImporting, importProgress }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white text-center mb-2">Resultados da Extração</h2>
        <p className="text-white/70 text-center">Sua lista foi processada. Aqui está o resumo.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Linhas no Arquivo" value={stats.totalLines} color="text-blue-400" />
        <StatCard icon={FileCheck} label="E-mails Válidos" value={stats.processedEmails} color="text-cyan-400" />
        <StatCard icon={FileX} label="Duplicados no Arquivo" value={stats.duplicatesRemoved} color="text-yellow-400" />
        <StatCard icon={AlertTriangle} label="Inválidos/Suspeitos" value={stats.suspiciousRemoved} color="text-orange-400" />
        <StatCard icon={Sparkles} label="Nomes Extraídos" value={stats.extractedNames} color="text-green-400" />
        <StatCard icon={FileX} label="Falhas na Extração" value={stats.failedExtractions} color="text-red-400" />
      </div>

      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="p-4 bg-white/5">
          <h3 className="text-lg font-semibold text-white">Pré-visualização dos Dados Extraídos</h3>
        </div>
        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/10">
                <th className="p-3 text-left text-white font-semibold">Nome</th>
                <th className="p-3 text-left text-white font-semibold">Email</th>
                <th className="p-3 text-left text-white font-semibold">País</th>
                <th className="p-3 text-left text-white font-semibold">Profissão</th>
                <th className="p-3 text-left text-white font-semibold">Ramo</th>
              </tr>
            </thead>
            <tbody>
              {extractedData.slice(0, 10).map((item, index) => (
                <tr key={index} className="border-t border-white/10">
                  <td className="p-3 text-white">{item.name}</td>
                  <td className="p-3 text-white/80">{item.email}</td>
                  <td className="p-3 text-white/80">{item.country || '-'}</td>
                  <td className="p-3 text-white/80">{item.profession || '-'}</td>
                  <td className="p-3 text-white/80">{item.branch || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {extractedData.length > 10 && (
          <div className="p-3 text-center text-sm text-white/60 bg-white/5">
            Mostrando 10 de {extractedData.length} registros.
          </div>
        )}
      </div>

      <div className="text-center space-y-4">
        <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={onImport}
              disabled={isImporting || extractedData.length === 0}
              className="btn-gradient-green px-6 py-3 text-base"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Importando ({importProgress.toFixed(0)}%)...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Importar {extractedData.length} Contatos
                </>
              )}
            </Button>

            <Button
              onClick={onEnrich}
              disabled={isImporting || extractedData.length === 0}
              className="bg-purple-500/80 hover:bg-purple-500 text-white px-6 py-3 text-base"
            >
              <Zap className="mr-2 h-5 w-5" />
              Enviar para Enriquecer
            </Button>

            <Button
              onClick={onDownload}
              disabled={isImporting || extractedData.length === 0}
              className="bg-blue-500/80 hover:bg-blue-500 text-white px-6 py-3 text-base"
            >
              <Download className="mr-2 h-5 w-5" />
              Baixar Resultado
            </Button>
        </div>
        
        <div>
          <Button onClick={onReset} variant="ghost" className="text-white/70 hover:text-white" disabled={isImporting}>
            <RotateCw className="mr-2 h-4 w-4" />
            Processar Outro Arquivo
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExtractionResults;