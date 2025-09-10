import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, CheckSquare, Square, Globe, Linkedin, Facebook, Twitter, Instagram, Github, Loader2, Phone } from 'lucide-react';

const WebsiteIcon = ({ url }) => {
    if (!url) return <span className="text-white/50">-</span>;

    let Icon = Globe;
    let color = "text-gray-400";
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('linkedin.com')) { Icon = Linkedin; color = "text-blue-400"; }
    else if (lowerUrl.includes('facebook.com')) { Icon = Facebook; color = "text-blue-600"; }
    else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) { Icon = Twitter; color = "text-sky-500"; }
    else if (lowerUrl.includes('instagram.com')) { Icon = Instagram; color = "text-pink-500"; }
    else if (lowerUrl.includes('github.com')) { Icon = Github; color = "text-purple-400"; }

    return (
        <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="text-white/80 truncate max-w-[150px]">{url.replace(/^(https?:\/\/)?(www\.)?/, '')}</span>
        </a>
    );
};

const ContactTable = ({ contacts, selectedContacts, onSelectContact, onSelectAll, onEditContact, onDeleteContact, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-effect rounded-xl overflow-hidden"
    >
      <div className="overflow-x-auto relative">
        {loading && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
        )}
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="p-4 text-left w-12">
                <button onClick={onSelectAll} className="text-white/70 hover:text-white disabled:opacity-50" disabled={contacts.length === 0}>
                  {contacts.length > 0 && contacts.every(c => selectedContacts.includes(c.id)) 
                    ? <CheckSquare className="w-5 h-5" /> 
                    : <Square className="w-5 h-5" />}
                </button>
              </th>
              <th className="p-4 text-left text-white font-semibold">Nome</th>
              <th className="p-4 text-left text-white font-semibold">Email</th>
              <th className="p-4 text-left text-white font-semibold">Telefone</th>
              <th className="p-4 text-left text-white font-semibold">Website</th>
              <th className="p-4 text-left text-white font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <motion.tr
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-t border-white/10 ${selectedContacts.includes(contact.id) ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}
              >
                <td className="p-4">
                  <button onClick={() => onSelectContact(contact.id)} className="text-white/70 hover:text-white">
                    {selectedContacts.includes(contact.id) 
                      ? <CheckSquare className="w-5 h-5 text-blue-400" /> 
                      : <Square className="w-5 h-5" />}
                  </button>
                </td>
                <td className="p-4 text-white">{contact.name || '-'}</td>
                <td className="p-4 text-white/80">{contact.email}</td>
                <td className="p-4 text-white/80">{contact.phone || '-'}</td>
                <td className="p-4 text-white/80"><WebsiteIcon url={contact.website} /></td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onEditContact(contact)} className="text-blue-400 hover:bg-blue-500/20 hover:text-blue-300">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDeleteContact(contact.id)} className="text-red-400 hover:bg-red-500/20 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ContactTable;