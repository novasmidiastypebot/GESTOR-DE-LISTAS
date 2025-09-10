import React from 'react';
import { Filter } from 'lucide-react';

const FilterControls = ({ filters, setFilters, options }) => {
  const handleFilterChange = (e) => {
    setFilters(e.target.name, e.target.value);
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-white/70" />
        <h3 className="text-lg font-semibold text-white">Filtrar Resultados</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="country"
          value={filters.country}
          onChange={handleFilterChange}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow"
        >
          <option value="" className="bg-slate-800">Todos os países</option>
          {options.countries.map(country => (
            <option key={country} value={country} className="bg-slate-800">
              {country}
            </option>
          ))}
        </select>
        
        <select
          name="state"
          value={filters.state}
          onChange={handleFilterChange}
          disabled={options.states.length === 0}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" className="bg-slate-800">Todos os estados</option>
          {options.states.map(state => (
            <option key={state} value={state} className="bg-slate-800">
              {state}
            </option>
          ))}
        </select>
        
        <select
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
          disabled={options.cities.length === 0}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none input-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" className="bg-slate-800">Todas as cidades</option>
          {options.cities.map(city => (
            <option key={city} value={city} className="bg-slate-800">
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;