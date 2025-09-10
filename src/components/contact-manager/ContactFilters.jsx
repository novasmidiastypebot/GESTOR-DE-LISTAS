import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Phone } from 'lucide-react';

const ContactFilters = ({ filters, handleFilterChange, uniqueCountries, uniqueStates, uniqueCities, uniqueProfessions, uniqueBranches }) => {
  const handleChange = (e) => {
    handleFilterChange(e.target.name, e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-effect rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-white/70" />
        <h3 className="text-lg font-semibold text-white">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative md:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            name="search"
            placeholder="Buscar por nome, email ou site..."
            value={filters.search}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-3">
          <select
            name="country"
            value={filters.country}
            onChange={handleChange}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow"
          >
            <option value="" className="bg-slate-800">Todos os países</option>
            {uniqueCountries.map(country => (
              <option key={country} value={country} className="bg-slate-800">{country}</option>
            ))}
          </select>
          
          <select
            name="state"
            value={filters.state}
            onChange={handleChange}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow"
            disabled={!filters.country}
          >
            <option value="" className="bg-slate-800">Todos os estados</option>
            {uniqueStates.map(state => (
              <option key={state} value={state} className="bg-slate-800">{state}</option>
            ))}
          </select>
          
          <select
            name="city"
            value={filters.city}
            onChange={handleChange}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow"
            disabled={!filters.state}
          >
            <option value="" className="bg-slate-800">Todas as cidades</option>
            {uniqueCities.map(city => (
              <option key={city} value={city} className="bg-slate-800">{city}</option>
            ))}
          </select>

          <select
            name="profession"
            value={filters.profession}
            onChange={handleChange}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow"
          >
            <option value="" className="bg-slate-800">Todas as profissões</option>
            {uniqueProfessions.map(profession => (
              <option key={profession} value={profession} className="bg-slate-800">{profession}</option>
            ))}
          </select>

          <select
            name="branch"
            value={filters.branch}
            onChange={handleChange}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow"
          >
            <option value="" className="bg-slate-800">Todos os ramos</option>
            {uniqueBranches.map(branch => (
              <option key={branch} value={branch} className="bg-slate-800">{branch}</option>
            ))}
          </select>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              name="phone"
              placeholder="Buscar por telefone..."
              value={filters.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactFilters;