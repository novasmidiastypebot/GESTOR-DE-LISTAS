
    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { User, Mail, Phone, Lock, Save, Loader2 } from 'lucide-react';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const AccountPage = () => {
      const { user, updateUser } = useAuth();
      const { toast } = useToast();

      const [userData, setUserData] = useState({
        full_name: '',
        email: '',
        phone: ''
      });
      const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
      });
      const [isSavingUser, setIsSavingUser] = useState(false);
      const [isSavingPassword, setIsSavingPassword] = useState(false);

      useEffect(() => {
        if (user) {
          setUserData({
            full_name: user.user_metadata?.full_name || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || ''
          });
        }
      }, [user]);

      const handleUserDataChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
      };

      const handlePasswordDataChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
      };

      const handleSaveUserData = async (e) => {
        e.preventDefault();
        setIsSavingUser(true);

        const updates = {
          email: userData.email,
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
          },
        };

        const { error } = await updateUser(updates);

        if (error) {
          toast({
            title: "Erro ao atualizar ❌",
            description: error.message || "Não foi possível salvar seus dados.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Dados atualizados! ✅",
            description: "Suas informações pessoais foram salvas com sucesso."
          });
          if (user.email !== userData.email) {
            toast({
                title: "Verificação de e-mail necessária!",
                description: "Enviamos um link de confirmação para o seu novo e-mail.",
                variant: "default",
                duration: 9000
            });
          }
        }
        setIsSavingUser(false);
      };

      const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast({
            title: "Erro na senha ❌",
            description: "A nova senha e a confirmação não correspondem.",
            variant: "destructive"
          });
          return;
        }

        if (passwordData.newPassword.length < 6) {
          toast({
            title: "Senha muito curta ❌",
            description: "A nova senha deve ter pelo menos 6 caracteres.",
            variant: "destructive"
          });
          return;
        }
        
        setIsSavingPassword(true);

        const { error } = await updateUser({ password: passwordData.newPassword });

        if (error) {
          toast({
            title: "Erro ao alterar senha ❌",
            description: error.message || "Não foi possível atualizar sua senha.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Senha alterada! 🔐",
            description: "Sua senha foi atualizada com sucesso."
          });
          setPasswordData({ newPassword: '', confirmPassword: '' });
        }
        
        setIsSavingPassword(false);
      };

      return (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-4">
              👤 Minha Conta
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Gerencie suas informações pessoais e de segurança.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-blue-400" />
                Dados Pessoais
              </h2>
              
              <form onSubmit={handleSaveUserData} className="space-y-6">
                <div>
                  <label className="text-white/80 text-sm font-medium">Nome</label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="text"
                      name="full_name"
                      value={userData.full_name}
                      onChange={handleUserDataChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/80 text-sm font-medium">Email</label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleUserDataChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
                      placeholder="Seu endereço de e-mail"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/80 text-sm font-medium">Telefone</label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleUserDataChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
                      placeholder="(XX) XXXXX-XXXX"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-gradient text-white font-semibold py-3 rounded-lg"
                  disabled={isSavingUser}
                >
                  {isSavingUser ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Salvando...</>
                  ) : (
                    <><Save className="w-5 h-5 mr-2" /> Salvar Alterações</>
                  )}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-purple-400" />
                Alterar Senha
              </h2>
              
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="text-white/80 text-sm font-medium">Nova Senha</label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordDataChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/80 text-sm font-medium">Confirmar Nova Senha</label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordDataChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none input-glow"
                      placeholder="Repita a nova senha"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-gradient text-white font-semibold py-3 rounded-lg"
                  disabled={isSavingPassword}
                >
                  {isSavingPassword ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Alterando...</>
                  ) : (
                    <><Save className="w-5 h-5 mr-2" /> Alterar Senha</>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      );
    };

    export default AccountPage;
  