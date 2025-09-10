import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const EditContactModal = ({ contact, setContact, onSave, onCancel, professions, branches }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-effect rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white mb-4">Editar Contato</h3>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="text-white/80 text-sm">Nome</label>
            <input type="text" value={contact.name || ''} onChange={(e) => setContact(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow" />
          </div>
          <div>
            <label className="text-white/80 text-sm">Email</label>
            <input type="email" value={contact.email || ''} onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow" />
          </div>
           <div>
            <label className="text-white/80 text-sm">Telefone</label>
            <input type="tel" value={contact.phone || ''} onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow" />
          </div>
          <div>
            <label className="text-white/80 text-sm">País</label>
            <input type="text" value={contact.country || ''} onChange={(e) => setContact(prev => ({ ...prev, country: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow" />
          </div>
          <div>
            <label className="text-white/80 text-sm">Estado</label>
            <input type="text" value={contact.state || ''} onChange={(e) => setContact(prev => ({ ...prev, state: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow" />
          </div>
          <div>
            <label className="text-white/80 text-sm">Cidade</label>
            <input type="text" value={contact.city || ''} onChange={(e) => setContact(prev => ({ ...prev, city: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow" />
          </div>
          <div>
            <label className="text-white/80 text-sm">Website</label>
            <input type="text" value={contact.website || ''} onChange={(e) => setContact(prev => ({ ...prev, website: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow" />
          </div>
          <div>
            <label className="text-white/80 text-sm">Profissão</label>
            <select value={contact.profession || ''} onChange={(e) => setContact(prev => ({ ...prev, profession: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow">
              <option value="" className="bg-slate-800">Selecione...</option>
              {professions.map(p => <option key={p} value={p} className="bg-slate-800">{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-white/80 text-sm">Ramo</label>
            <select value={contact.branch || ''} onChange={(e) => setContact(prev => ({ ...prev, branch: e.target.value }))} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow">
              <option value="" className="bg-slate-800">Selecione...</option>
              {branches.map(b => <option key={b} value={b} className="bg-slate-800">{b}</option>)}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button onClick={onSave} className="btn-gradient text-white flex-1">Salvar</Button>
          <Button onClick={onCancel} variant="outline" className="bg-transparent border-white/20 text-white/80 hover:bg-white/10 hover:text-white flex-1">Cancelar</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditContactModal;