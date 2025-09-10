
    import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.simulador.app.br';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.B7NkTNQk_V3xKcYUjHnJoxtcsz8jbK_0tKy4tWPJRCw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', 
    redirectTo: 'https://gerenciadordelistas.simulador.app.br'
  }
});
  