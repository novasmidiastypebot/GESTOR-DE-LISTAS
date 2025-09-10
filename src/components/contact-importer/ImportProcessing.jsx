import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const ImportProcessing = ({ title, progress, processedCount, totalCount }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="glass-effect rounded-xl p-8 text-center"
        >
            <div className="flex justify-center items-center mb-6">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-6">{title}</h3>
            <p className="text-white/70 mb-4">Aguarde enquanto processamos sua lista.</p>
            {totalCount > 0 && (
                <>
                    <Progress value={progress} className="w-full mb-2" />
                    <div className="flex justify-between text-sm text-white/80">
                        <span>{Math.round(progress)}%</span>
                        <span>{processedCount} / {totalCount} contatos processados</span>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default ImportProcessing;