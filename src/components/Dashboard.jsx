
    import React, { useState, useEffect, useCallback } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Users, Upload, Sparkles, Search, Database, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';

    const Dashboard = ({ onNavigate }) => {
      const { user } = useAuth();
      const { toast } = useToast();
      const [stats, setStats] = useState({
        total_contacts: 0,
        imported_today: 0,
        enriched_contacts: 0,
        extracted_names: 0
      });
      const [loading, setLoading] = useState(true);
      const [isSyncing, setIsSyncing] = useState(false);
      const [error, setError] = useState(null);

      const fetchStats = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
          const { data, error: rpcError } = await supabase.rpc('handle_data_flow', {
            p_action: 'get_dashboard_stats',
            p_user_id: user.id
          });

          if (rpcError) throw rpcError;
          
          if (data) {
            setStats(data);
          } else {
            await handleSyncStats(false);
          }
        } catch (err) {
          console.error('Error fetching dashboard stats:', err);
          setError('Não foi possível carregar as estatísticas. Tente sincronizar manualmente.');
          setStats({ total_contacts: 0, imported_today: 0, enriched_contacts: 0, extracted_names: 0 });
        } finally {
          setLoading(false);
        }
      }, [user]);

      const handleSyncStats = async (showToast = true) => {
        setIsSyncing(true);
        if(showToast) {
            toast({ title: "Sincronizando estatísticas...", description: "Isso pode levar alguns momentos, dependendo do volume de dados." });
        }
        try {
            const { error: syncError } = await supabase.rpc('sync_user_stats', { p_user_id: user.id });
            if (syncError) throw syncError;
            
            await fetchStats(); 
            if(showToast) {
                toast({ title: "Sincronização concluída!", description: "As estatísticas foram atualizadas.", variant: "success" });
            }
        } catch (err) {
            toast({ title: "Erro na sincronização", description: err.message, variant: "destructive" });
        } finally {
            setIsSyncing(false);
        }
      };

      useEffect(() => {
        fetchStats();
      }, [fetchStats]);

      const dashboardCards = [
        {
          title: 'Gerenciar Contatos',
          description: 'Visualize, edite e gerencie sua base de contatos com filtros avançados',
          icon: Users,
          color: 'from-blue-500 to-cyan-500',
          action: () => onNavigate('contacts'),
          statsKey: 'total_contacts',
          statsLabel: 'contatos'
        },
        {
          title: 'Importar Contatos',
          description: 'Importe listas de contatos de arquivos CSV/TXT com mapeamento flexível',
          icon: Upload,
          color: 'from-green-500 to-emerald-500',
          action: () => onNavigate('import'),
          statsKey: 'imported_today',
          statsLabel: 'importados hoje'
        },
        {
          title: 'Enriquecer Dados',
          description: 'Atualize e enriqueça informações existentes com mapeamento inteligente',
          icon: Sparkles,
          color: 'from-purple-500 to-pink-500',
          action: () => onNavigate('enrich'),
          statsKey: 'enriched_contacts',
          statsLabel: 'enriquecidos'
        },
        {
          title: 'Extrair Nomes',
          description: 'Extraia nomes de listas de e-mails com algoritmos inteligentes',
          icon: Search,
          color: 'from-orange-500 to-red-500',
          action: () => onNavigate('extract'),
          statsKey: 'extracted_names',
          statsLabel: 'extraídos'
        }
      ];
      
        if (loading && !isSyncing) {
        return (
          <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        );
      }

      return (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Dashboard de Gerenciamento
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Centralize o gerenciamento de seus contatos com ferramentas poderosas de importação, 
              enriquecimento e higienização de dados.
            </p>
          </motion.div>
          
          {error && !isSyncing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-effect rounded-xl p-6 text-center text-orange-300 flex items-center justify-center space-x-4">
                  <AlertCircle className="w-8 h-8 text-orange-400" />
                  <div>
                      <h2 className="text-lg font-semibold text-white mb-1">Atenção</h2>
                      <p>{error}</p>
                  </div>
              </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Total de Contatos', value: stats.total_contacts || 0, icon: Database, color: 'text-blue-400' },
              { label: 'Importados Hoje', value: stats.imported_today || 0, icon: Upload, color: 'text-green-400' },
              { label: 'Enriquecidos', value: stats.enriched_contacts || 0, icon: Sparkles, color: 'text-purple-400' },
              { label: 'Nomes Extraídos', value: stats.extracted_names || 0, icon: TrendingUp, color: 'text-orange-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="glass-effect rounded-xl p-6 card-hover"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {dashboardCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass-effect rounded-2xl p-8 card-hover group cursor-pointer"
                onClick={card.action}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${card.color} group-hover:scale-110 transition-transform`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-white/70 mb-4 leading-relaxed">
                      {card.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50">{`${stats[card.statsKey] || 0} ${card.statsLabel}`}</span>
                      <Button
                        className="btn-gradient text-white group-hover:scale-105 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          card.action();
                        }}
                      >
                        Acessar
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start">
                        <Database className="w-6 h-6 mr-3" /> Sincronização de Dados
                    </h2>
                    <p className="text-white/70 mt-1">Se os números parecerem desatualizados, sincronize para recalcular as estatísticas.</p>
                </div>
                <Button onClick={() => handleSyncStats()} variant="outline" className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white" disabled={isSyncing}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} /> {isSyncing ? 'Sincronizando...' : 'Sincronizar Estatísticas'}
                </Button>
            </div>
          </motion.div>

        </div>
      );
    };

    export default Dashboard;
  