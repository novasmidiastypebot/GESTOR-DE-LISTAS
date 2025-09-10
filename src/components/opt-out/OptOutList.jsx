import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trash2, Mail, Globe } from 'lucide-react';

const OptOutList = ({ optOutList, totalCount, onRemoveItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-effect rounded-xl p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-4">
        Lista de Bloqueio ({totalCount})
      </h3>
      {optOutList.length > 0 ? (
        <div className="max-h-96 overflow-y-auto pr-2">
          <ul className="space-y-2">
            {optOutList.map((item, index) => (
              <motion.li
                key={item.email}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {item.type === 'domain' ? (
                    <Globe className="w-5 h-5 text-sky-400" />
                  ) : (
                    <Mail className="w-5 h-5 text-amber-400" />
                  )}
                  <span className="text-white/80">{item.email}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(item)}
                  className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-white/70">A lista de bloqueio está vazia.</p>
        </div>
      )}
    </motion.div>
  );
};

export default OptOutList;