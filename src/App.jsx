
import React, { useState, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, LayoutDashboard, Contact, FileInput, Sparkles, Combine, ListFilter, Trash2 } from 'lucide-react';
import LoginPage from '@/components/LoginPage';

const pageComponents = {
  dashboard: lazy(() => import('@/components/Dashboard')),
  contacts: lazy(() => import('@/components/contact-manager/ContactManager')),
  import: lazy(() => import('@/components/contact-importer/ContactImporter')),
  enrich: lazy(() => import('@/components/ContactEnricher')),
  extract: lazy(() => import('@/components/name-extractor/NameExtractor')),
  merge: lazy(() => import('@/components/list-merger/ListMerger')),
  optout: lazy(() => import('@/components/opt-out/OptOutManager')),
  account: lazy(() => import('@/components/AccountPage')),
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'contacts', label: 'Contatos', icon: <Contact className="w-4 h-4" /> },
  { id: 'import', label: 'Importar', icon: <FileInput className="w-4 h-4" /> },
  { id: 'enrich', label: 'Enriquecer', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'extract', label: 'Extrair Nomes', icon: <Combine className="w-4 h-4" /> },
  { id: 'merge', label: 'Mesclar', icon: <ListFilter className="w-4 h-4" /> },
  { id: 'optout', label: 'Opt-out', icon: <Trash2 className="w-4 h-4" /> },
];

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const { session, user, signOut, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [dataForEnricher, setDataForEnricher] = useState(null);

  const handleLogout = async () => {
    await signOut();
    setCurrentPage('dashboard');
  };
  
  const navigateToEnricher = (data) => {
    setDataForEnricher(data);
    setCurrentPage('enrich');
  };

  const PageComponent = pageComponents[currentPage] || pageComponents.dashboard;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Helmet>
          <title>Sistema de Contatos - Login</title>
          <meta name="description" content="Acesse ou crie sua conta para gerenciar seus contatos." />
        </Helmet>
        <LoginPage />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gerenciador de Contatos - {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</title>
        <meta name="description" content="Gerencie, enriqueça e higienize suas listas de contatos." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
        <header className="sticky top-0 z-50 glassmorphism">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="text-2xl font-bold text-white cursor-pointer"
                  onClick={() => setCurrentPage('dashboard')}
                  whileHover={{ scale: 1.05 }}
                >
                  <span role="img" aria-label="logo">🚀</span> ContatoBoost
                </motion.div>
                <div className="hidden md:flex items-center space-x-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentPage(item.id)}
                      className="flex items-center space-x-2"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setCurrentPage('account')} className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{user?.user_metadata?.full_name || user?.email}</span>
                </Button>
                <Button variant="destructive" size="sm" onClick={handleLogout} className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <PageComponent 
                  onNavigate={setCurrentPage}
                  onSendToEnricher={navigateToEnricher}
                  initialData={currentPage === 'enrich' ? dataForEnricher : null}
                  onClearInitialData={() => setDataForEnricher(null)}
                />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

export default App;
