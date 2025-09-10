
    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';

    const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [session, setSession] = useState(null);
        const [loading, setLoading] = useState(true);
        const { toast } = useToast();

        useEffect(() => {
            const getSession = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            };

            getSession();

            const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            });

            return () => {
                authListener.subscription.unsubscribe();
            };
        }, []);

        const signUp = async ({ email, password, options }) => {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options,
            });
            
            setLoading(false);
            return { data, error };
        };

        const signInWithPassword = async (email, password) => {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                toast({ title: "Erro no Login", description: error.message, variant: "destructive" });
            }
            setLoading(false);
            return { data, error };
        };
        
        const updateUser = async (updates) => {
            const { data, error } = await supabase.auth.updateUser(updates);
            return { data, error };
        };

        const signInWithGitHub = async () => {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
            });
            if (error) {
                toast({ title: "Erro no Login com GitHub", description: error.message, variant: "destructive" });
                setLoading(false);
            }
        };

        const signOut = async () => {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast({ title: "Erro ao Sair", description: error.message, variant: "destructive" });
            }
            setLoading(false);
        };

        const value = {
            user,
            session,
            loading,
            signUp,
            signInWithPassword,
            signInWithGitHub,
            signOut,
            updateUser
        };

        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => {
        const context = useContext(AuthContext);
        if (context === undefined) {
            throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
    };
  