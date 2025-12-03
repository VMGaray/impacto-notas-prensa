
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Faltan las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // ⚠️ CRÍTICO: Habilita el flujo PKCE para Google Login
    flowType: 'pkce',
    
    // ⚠️ CRÍTICO: Detecta la sesión en la URL tras el redirect
    detectSessionInUrl: true,
    
    persistSession: true,
    autoRefreshToken: true,
  },
});


/*import { createClient } from '@supabase/supabase-js';

// TODO: Reemplazar con tus credenciales reales de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
*/