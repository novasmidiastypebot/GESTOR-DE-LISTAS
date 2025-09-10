import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload, ArrowRight, CheckCircle, Settings, Database, Loader2, RefreshCw, UserPlus, UserCheck, AlertTriangle, FileText, Building, Briefcase, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useContactImporter } from '@/hooks/useContactImporter';
import { toast } from '@/components/ui/use-toast';
import { professions, branches } from '@/lib/appConstants';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white/5 p-4 rounded-lg text-center">
        <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-white/70">{label}</p>
    </div>
);

const ContactImporter = () => {
    const {
        currentStep,
        file,
        fileData,
        columnMapping,
        isProcessing,
        importResults,
        dbColumns,
        handleFileUpload,
        handleColumnMapping,
        processImport,
        resetProcess,
        setCurrentStep,
        defaultValues,
        setDefaultValues,
    } = useContactImporter();

    const [isPasteMode, setIsPasteMode] = useState(false);
    const [pastedText, setPastedText] = useState('');

    const handleTabChange = (value) => {
        resetProcess();
        setIsPasteMode(value === 'paste');
        setPastedText('');
    };

    const handleLoadData = (e) => {
        if (isPasteMode) {
            if (pastedText.trim()) {
                handleFileUpload(pastedText, true);
            } else {
                toast({ title: "Nenhum texto para carregar", description: "A área de texto está vazia.", variant: "destructive" });
            }
        } else {
            handleFileUpload(e);
        }
    };
    
    const handleDefaultValueChange = (e) => {
        const { name, value } = e.target;
        setDefaultValues(prev => ({ ...prev, [name]: value }));
    };


    const renderStep1 = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8 items-start">
            <div className="glass-effect rounded-xl p-8 space-y-6">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        {isPasteMode ? <FileText className="w-10 h-10 text-white" /> : <Upload className="w-10 h-10 text-white" />}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{isPasteMode ? 'Cole sua Lista' : 'Selecione o Arquivo'}</h3>
                </div>
                
                {isPasteMode ? (
                    <>
                        <textarea
                            value={pastedText}
                            onChange={(e) => setPastedText(e.target.value)}
                            placeholder="email;nome;telefone&#10;contato@empresa.com;Nome Contato;11999999999"
                            rows="8"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
                        />
                        <Button onClick={handleLoadData} className="btn-gradient text-white w-full" disabled={!pastedText}>
                            <CheckCircle className="w-5 h-5 mr-2" /> Carregar Lista
                        </Button>
                    </>
                ) : (
                    <>
                        <p className="text-white/70 text-center">Formatos aceitos: CSV, TXT (separados por ';').</p>
                        <div className="text-center">
                            <input type="file" accept=".csv,.txt" onChange={handleLoadData} className="hidden" id="import-file-upload" />
                            <label htmlFor="import-file-upload" className="inline-flex items-center px-6 py-3 btn-gradient text-white rounded-lg cursor-pointer hover:scale-105 transition-transform">
                                <Upload className="w-5 h-5 mr-2" /> Selecionar Arquivo
                            </label>
                        </div>
                        {file && (
                           <div className="text-green-300 font-medium text-center">{file.name}</div>
                        )}
                    </>
                )}
                 <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Valores Padrão (Opcional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                          type="text"
                          name="country"
                          value={defaultValues.country}
                          onChange={handleDefaultValueChange}
                          placeholder="País Padrão"
                          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
                        />
                      </div>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                          type="text"
                          name="profession"
                          value={defaultValues.profession}
                          onChange={handleDefaultValueChange}
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
                          value={defaultValues.branch}
                          onChange={handleDefaultValueChange}
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
            </div>

            <div className="glass-effect rounded-xl p-6">
                 <h3 className="text-xl font-semibold text-white mb-4">📋 Como Funciona</h3>
                 <p className="text-white/70 mb-4">A primeira linha do seu arquivo ou texto colado deve ser o cabeçalho para o mapeamento.</p>
                 <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <div className="text-white/70 mb-2">Exemplo (separado por ponto e vírgula):</div>
                    <div className="text-green-400">email;nome;telefone</div>
                    <div className="text-cyan-400">contato@empresa.com;Nome Contato;11999999999</div>
                    <div className="text-cyan-400">info@negocio.com;Outro Nome;21988888888</div>
                </div>
                 <div className="mt-4 text-white/70 text-sm space-y-2">
                    <p>✔️ O campo <strong>E-mail</strong> é obrigatório para o mapeamento.</p>
                    <p>✔️ O sistema irá inserir novos contatos e atualizar os existentes com base no e-mail.</p>
                    <p>✔️ Valores padrão serão aplicados em campos vazios.</p>
                </div>
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><Settings className="w-6 h-6 mr-2" /> Mapeamento de Colunas</h3>
                <p className="text-white/70 mb-6">Associe as colunas da sua lista aos campos do banco de dados.</p>
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                    <h4 className="text-white font-medium mb-3">Preview dos dados:</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    {fileData.headers.map((header, index) => (
                                        <th key={index} className="text-white/70 p-2 text-left">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {fileData.rows.slice(0, 3).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {fileData.headers.map((header, cellIndex) => (
                                            <td key={cellIndex} className="text-white/80 p-2 border-t border-white/10">{row[header] || '-'}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="space-y-4">
                    {fileData.headers.map((header, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                            <div className="flex-1">
                                <div className="text-white font-medium">{header}</div>
                                <div className="text-white/60 text-sm">Coluna do seu arquivo</div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-white/50" />
                            <div className="flex-1">
                                <select value={columnMapping[header] || ''} onChange={(e) => handleColumnMapping(header, e.target.value)} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow">
                                    <option value="" className="bg-slate-800">Não importar</option>
                                    {dbColumns.map(col => <option key={col.key} value={col.key} className="bg-slate-800">{col.label} {col.required ? '(obrigatório)' : ''}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between">
                <Button onClick={() => setCurrentStep(1)} className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300">Voltar</Button>
                <Button onClick={() => setCurrentStep(3)} className="btn-gradient text-white" disabled={!Object.values(columnMapping).includes('email')}>
                    Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
    
    const renderProcessingStep = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-xl p-8">
            <div className="flex justify-center items-center mb-6">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">Iniciando Processamento...</h3>
            <p className="text-white/70 text-center">Sua lista está sendo enviada para processamento em segundo plano. Você pode navegar para outras páginas.</p>
        </motion.div>
    );

    const renderStep3 = () => {
        if (isProcessing) return renderProcessingStep();

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">Confirmar Importação</h3>
                <div className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6">
                        <h4 className="text-white font-semibold mb-4">Resumo da Operação:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><div className="text-white/70 text-sm">Fonte:</div><div className="text-white font-medium">{file?.name || (isPasteMode ? 'Lista Colada' : 'N/A')}</div></div>
                            <div><div className="text-white/70 text-sm">Total de linhas para processar:</div><div className="text-white font-medium">{fileData.rows.length}</div></div>
                        </div>
                    </div>
                     <div className="bg-white/5 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-4">Valores Padrão a serem Aplicados:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><p className="text-sm text-white/70">País:</p><p className="font-medium text-white">{defaultValues.country || 'Nenhum'}</p></div>
                            <div><p className="text-sm text-white/70">Profissão:</p><p className="font-medium text-white">{defaultValues.profession || 'Nenhum'}</p></div>
                            <div><p className="text-sm text-white/70">Ramo:</p><p className="font-medium text-white">{defaultValues.branch || 'Nenhum'}</p></div>
                        </div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <Database className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div><div className="text-blue-300 font-medium">Lógica Upsert</div><div className="text-blue-200/80 text-sm">Contatos existentes (mesmo e-mail) serão atualizados. Novos e-mails serão inseridos.</div></div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-8">
                    <Button onClick={() => setCurrentStep(2)} className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300">Voltar</Button>
                    <Button onClick={processImport} disabled={isProcessing} className="btn-gradient text-white">
                        <CheckCircle className="w-4 h-4 mr-2" /> Iniciar Importação
                    </Button>
                </div>
            </motion.div>
        )
    };
    
    const renderStep4 = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-white" /></div>
          <h3 className="text-2xl font-semibold text-white mb-6">Processamento Iniciado!</h3>
          <p className="text-white/70 max-w-xl mx-auto mb-8">Sua lista foi enviada para processamento em segundo plano. Você será notificado quando terminar. Enquanto isso, pode continuar usando o sistema.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard icon={Database} label="Total de Linhas" value={importResults?.total || 0} color="text-blue-400" />
            <StatCard icon={UserCheck} label="Contatos Válidos" value={importResults?.processed || 0} color="text-green-400" />
            <StatCard icon={AlertTriangle} label="Inválidos/Opt-out" value={importResults?.errors || 0} color="text-red-400" />
          </div>
          <Button onClick={resetProcess} className="btn-gradient text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Nova Importação
          </Button>
        </motion.div>
    );

    const steps = [
        { number: 1, title: 'Upload', active: currentStep >= 1, completed: currentStep > 1 },
        { number: 2, title: 'Mapeamento', active: currentStep >= 2, completed: currentStep > 2 },
        { number: 3, title: 'Confirmação', active: currentStep >= 3, completed: currentStep > 3 },
        { number: 4, title: 'Resultado', active: currentStep >= 4, completed: currentStep === 4 }
    ];

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            default: return renderStep1();
        }
    };
    
    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <h1 className="text-3xl font-bold text-white mb-4">📥 Importador de Contatos</h1>
                <p className="text-white/70 max-w-2xl mx-auto">Adicione ou atualize contatos em massa com um sistema flexível de mapeamento de colunas.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex justify-center mb-6">
                    <div className="flex items-center space-x-4 p-1 bg-slate-800/50 rounded-lg">
                        <Button onClick={() => handleTabChange('upload')} variant="ghost" className={`px-4 py-2 text-sm transition-all ${!isPasteMode ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}>
                            <Upload className="w-4 h-4 mr-2" /> Importar Arquivo
                        </Button>
                        <Button onClick={() => handleTabChange('paste')} variant="ghost" className={`px-4 py-2 text-sm transition-all ${isPasteMode ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}>
                            <FileText className="w-4 h-4 mr-2" /> Colar Lista
                        </Button>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex justify-center">
                 <div className="flex items-center space-x-4">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step.completed ? 'bg-green-500 border-green-500 text-white' : step.active ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/30 text-white/50'}`}>
                            {step.completed ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-semibold">{step.number}</span>}
                        </div>
                        <div className="text-center"><div className={`text-sm font-medium ${step.active ? 'text-white' : 'text-white/50'}`}>{step.title}</div></div>
                        {index < steps.length - 1 && <div className={`w-8 h-0.5 ${step.completed ? 'bg-green-500' : 'bg-white/20'}`} />}
                        </React.Fragment>
                    ))}
                </div>
            </motion.div>
            
            <div className="mt-8">
                {renderCurrentStep()}
            </div>
        </div>
    );
};

export default ContactImporter;