import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Download, Edit, Trash2 } from 'lucide-react';

const ContactHeader = ({ filteredCount, totalCount, selectedCount, onExport, onBulkEdit, onBulkDelete, isFiltered }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          👥 Gerenciador de Contatos
        </h1>
        <p className="text-white/70">
          Exibindo {filteredCount} de {totalCount} contatos.
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          onClick={onExport}
          variant="outline"
          className="bg-transparent border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
          disabled={filteredCount === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 p-1 rounded-lg bg-white/10">
            <span className="text-sm text-white/80 px-2">
              {selectedCount} selecionado(s)
            </span>
            <Button
              onClick={onBulkEdit}
              size="sm"
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente os {selectedCount} contatos selecionados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onBulkDelete(false)} className="bg-red-600 hover:bg-red-700">
                    Sim, excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {isFiltered && selectedCount === 0 && filteredCount > 0 && (
           <div className="flex items-center gap-3">
             <Button
                onClick={onBulkEdit}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar {filteredCount} filtrados
              </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir {filteredCount} filtrados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir todos os contatos filtrados?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente os {filteredCount} contatos que correspondem aos filtros atuais.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onBulkDelete(true)} className="bg-red-600 hover:bg-red-700">
                    Sim, excluir todos
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContactHeader;