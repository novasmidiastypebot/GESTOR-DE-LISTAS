import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Users, UserPlus, UserCheck, Ban } from 'lucide-react';

const StatItem = ({ icon: Icon, value, label, color }) => (
    <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
      <Icon className={`w-8 h-8 mb-2 ${color}`} />
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-sm text-white/70">{label}</span>
    </div>
);

const ImportReportModal = ({ report, onOpenChange }) => {
  if (!report) return null;

  return (
    <AlertDialog open={!!report} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-effect text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">Importação Concluída</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-white/80 pt-2">
            Sua lista foi processada. Veja o resumo abaixo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-6">
            <StatItem icon={Users} value={report.total} label="Contatos Processados" color="text-blue-400" />
            <StatItem icon={UserPlus} value={report.inserted} label="Inseridos com Sucesso" color="text-green-400" />
            <StatItem icon={UserCheck} value={report.updated} label="Atualizados" color="text-yellow-400" />
            <StatItem icon={Ban} value={report.optOut} label="Ignorados (Opt-out)" color="text-red-40á00" />
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)} className="w-full btn-gradient">
            Fechar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImportReportModal;