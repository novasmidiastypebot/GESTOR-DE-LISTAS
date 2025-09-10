
    import React, { useState } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Mail, Lock, User, Eye, EyeOff, Key, Github } from 'lucide-react';

    const LoginPage = () => {
      const [mode, setMode] = useState('login');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [fullName, setFullName] = useState('');
      const [loading, setLoading] = useState(false);
      const [showPassword, setShowPassword] = useState(false);
      const { signInWithPassword, signUp, signInWithGitHub } = useAuth();
      const { toast } = useToast();

      const handleAuthAction = async (e) => {
        e.preventDefault();
        
        if (mode === 'signup' && password.length < 6) {
            toast({
                title: "Senha muito curta",
                description: "Sua senha deve ter no mínimo 6 caracteres.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
          if (mode === 'login') {
            const { error } = await signInWithPassword(email, password);
            if (error) throw error;
            toast({
              title: "Login bem-sucedido!",
              description: "Bem-vindo de volta!",
            });
          } else {
            const { data, error } = await signUp({ email, password, options: { data: { full_name: fullName } } });
            if (error) throw error;
            if (data.user?.identities?.length === 0) {
                toast({
                    title: "Erro de Cadastro",
                    description: "Este e-mail já está em uso.",
                    variant: "destructive",
                });
            } else {
                toast({
                  title: "Confirmação necessária!",
                  description: "Enviamos um link de confirmação para o seu e-mail.",
                });
                setMode('login');
            }
          }
        } catch (error) {
          toast({
            title: "Erro de Autenticação",
            description: error.message || "Ocorreu um erro. Por favor, tente novamente.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      const handleGitHubSignIn = async () => {
          setLoading(true);
          await signInWithGitHub();
          setLoading(false);
      };
      
      const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: { 
            duration: 0.5,
            type: "spring",
            stiffness: 120
          } 
        },
      };

      const inputIcon = (IconComponent) => (
        <IconComponent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      );

      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
          <motion.div 
            className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-2xl glassmorphism"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-center mb-8">
                <div className="inline-block p-4 bg-purple-500/20 rounded-full mb-4">
                    <Key className="h-10 w-10 text-purple-300" />
                </div>
                <h1 className="text-3xl font-bold text-white">Sistema de Contatos</h1>
                <p className="text-gray-300 mt-2">Acesse ou crie sua conta para começar</p>
            </div>

            <div className="mb-8">
              <div className="grid grid-cols-2 gap-2 bg-purple-900/30 p-1 rounded-lg">
                <button onClick={() => setMode('login')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'login' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-purple-800/50'}`}>
                  Login
                </button>
                <button onClick={() => setMode('signup')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'signup' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-purple-800/50'}`}>
                  Cadastro
                </button>
              </div>
            </div>

            <form onSubmit={handleAuthAction} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {mode === 'signup' && (
                    <div className="relative">
                      {inputIcon(User)}
                      <Input
                        type="text"
                        placeholder="Nome Completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  )}
                  <div className="relative">
                    {inputIcon(Mail)}
                    <Input
                      type="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="relative">
                    {inputIcon(Lock)}
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Senha (mínimo 6 caracteres)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-base" disabled={loading}>
                {loading ? 'Processando...' : (mode === 'login' ? 'Entrar no Sistema' : 'Criar Conta')}
              </Button>
            </form>

            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs">OU</span>
                <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <Button variant="outline" className="w-full bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-white" onClick={handleGitHubSignIn} disabled={loading}>
                <Github className="mr-2 h-4 w-4" />
                Entrar com GitHub
            </Button>

          </motion.div>
        </div>
      );
    };

    export default LoginPage;
  