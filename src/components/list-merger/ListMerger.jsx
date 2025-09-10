import React from 'react';
import { motion } from 'framer-motion';
import { useListMerger } from '@/hooks/useListMerger';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { UploadCloud, FileText, Trash2, Settings, Play, Loader2, Download, BarChart, AlertTriangle, ShieldOff, FileCheck2, FileX2, MailWarning, Bot } from 'lucide-react';

const ListMerger = () => {
    const {
        inputFiles,
        optOutFile,
        options,
        outputSize,
        isProcessing,
        report,
        downloadLinks,
        handleInputFilesChange,
        handleOptOutFileChange,
        handleOptionChange,
        handleOutputSizeChange,
        handleRemoveFile,
        processLists,
    } = useListMerger();

    const renderFileDropzone = (files, onChange, onRemove, id, multiple = false) => (
        <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-6 text-center transition-all hover:border-white/40 hover:bg-white/10">
            <UploadCloud className="w-12 h-12 mx-auto text-white/50 mb-4" />
            <Label htmlFor={id} className="text-white font-semibold cursor-pointer">
                Arraste e solte arquivos aqui ou clique para selecionar
            </Label>
            <p className="text-xs text-white/60 mt-1">Arquivos CSV ou TXT</p>
            <Input
                id={id}
                type="file"
                multiple={multiple}
                accept=".csv,.txt"
                onChange={onChange}
                className="hidden"
            />
            {files.length > 0 && (
                <div className="mt-4 space-y-2 text-left">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-cyan-300" />
                                <span className="text-sm text-white/90 truncate">{file.name}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => onRemove(index, id === 'opt-out-file' ? 'optout' : 'input')}>
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderReportCard = (Icon, label, value, color) => (
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <p className="text-white/80">{label}</p>
            </div>
            <p className={`font-bold text-lg ${color}`}>{value}</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-white text-center mb-2">🧬 Mesclar e Higienizar Listas</h1>
                <p className="text-lg text-white/70 text-center max-w-3xl mx-auto">
                    Unifique, limpe e formate suas listas de contatos com um poderoso conjunto de ferramentas.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="glass-effect rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Listas de Entrada</h2>
                        {renderFileDropzone(inputFiles, handleInputFilesChange, handleRemoveFile, 'input-files', true)}
                    </div>

                    <div className="glass-effect rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Opções de Higienização</h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-lg">
                                <Checkbox id="applyDbOptOut" checked={options.applyDbOptOut} onCheckedChange={(checked) => handleOptionChange('applyDbOptOut', checked)} />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="applyDbOptOut" className="text-white font-medium">Aplicar Opt-Out do Banco de Dados</Label>
                                    <p className="text-sm text-white/60">Remover contatos que estão na sua lista de bloqueio principal.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-lg">
                                <Checkbox id="removeDuplicates" checked={options.removeDuplicates} onCheckedChange={(checked) => handleOptionChange('removeDuplicates', checked)} />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="removeDuplicates" className="text-white font-medium">Remover E-mails Duplicados</Label>
                                    <p className="text-sm text-white/60">Garantir que cada e-mail apareça apenas uma vez na lista final.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-lg">
                                <Checkbox id="removeMuseum" checked={options.removeMuseum} onCheckedChange={(checked) => handleOptionChange('removeMuseum', checked)} />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="removeMuseum" className="text-white font-medium">Remover domínios ".museum"</Label>
                                    <p className="text-sm text-white/60">Excluir e-mails com o domínio de topo ".museum".</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-lg">
                                <Checkbox id="removeSystem" checked={options.removeSystem} onCheckedChange={(checked) => handleOptionChange('removeSystem', checked)} />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="removeSystem" className="text-white font-medium">Remover E-mails de Sistema</Label>
                                    <p className="text-sm text-white/60">Excluir e-mails que parecem ser gerados por sistemas (ex: hashes longos).</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Subir arquivo de Opt-Out (opcional)</h3>
                            {renderFileDropzone(optOutFile ? [optOutFile] : [], handleOptOutFileChange, handleRemoveFile, 'opt-out-file')}
                        </div>
                    </div>

                    <div className="glass-effect rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Configuração de Saída</h2>
                        <div className="grid gap-1.5">
                            <Label htmlFor="outputSize" className="text-white font-medium">Tamanho dos arquivos de saída (linhas)</Label>
                            <Input
                                id="outputSize"
                                type="number"
                                value={outputSize}
                                onChange={handleOutputSizeChange}
                                placeholder="Ex: 50000"
                                className="max-w-xs bg-white/10 border-white/20 text-white placeholder-white/50"
                            />
                            <p className="text-sm text-white/60">A lista final será dividida em arquivos com este número de linhas.</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6 sticky top-28"
                >
                    <div className="glass-effect rounded-xl p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Processar</h2>
                        <Button
                            onClick={processLists}
                            disabled={isProcessing || inputFiles.length === 0}
                            className="w-full btn-gradient text-white text-lg py-6"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                <>
                                    <Play className="w-6 h-6 mr-2" />
                                    Iniciar Processamento
                                </>
                            )}
                        </Button>
                    </div>

                    {(report || downloadLinks.length > 0) && (
                        <div className="glass-effect rounded-xl p-6">
                            <h2 className="text-2xl font-semibold text-white mb-4">Resultados</h2>
                            {report && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center"><BarChart className="w-5 h-5 mr-2" /> Relatório</h3>
                                    <div className="space-y-2">
                                        {renderReportCard(ShieldOff, "Removidos por Opt-Out", report.optOutRemoved, "text-red-400")}
                                        {renderReportCard(FileCheck2, "Duplicatas Removidas", report.duplicatesRemoved, "text-yellow-400")}
                                        {renderReportCard(FileX2, "E-mails Inválidos", report.invalidEmails, "text-orange-400")}
                                        {renderReportCard(MailWarning, "Domínios .museum", report.museumRemoved, "text-purple-400")}
                                        {renderReportCard(Bot, "E-mails de Sistema", report.systemRemoved, "text-indigo-400")}
                                        {renderReportCard(AlertTriangle, "Tentativas de Correção", 0, "text-blue-400")}
                                    </div>
                                </div>
                            )}
                            {downloadLinks.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center"><Download className="w-5 h-5 mr-2" /> Arquivos de Saída</h3>
                                    <div className="space-y-2">
                                        {downloadLinks.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                download={link.name}
                                                className="block w-full text-center bg-green-500/20 text-green-300 hover:bg-green-500/30 font-semibold py-2 px-4 rounded-lg transition-all"
                                            >
                                                Baixar {link.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ListMerger;