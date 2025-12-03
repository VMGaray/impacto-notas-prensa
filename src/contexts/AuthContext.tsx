import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string) => Promise<string | null>;
  userProfile: {
    name?: string;
    email?: string;
    avatar_url?: string;
  } | null;
  userPlan: 'free' | 'pro';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<AuthContextType['userProfile'] | null>(null);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔍 Inicializando autenticación...');
        console.log('📍 URL actual:', window.location.href);

        // Limpieza: Si estamos en una URL de error OAuth, limpiar la URL
        // (esto permite que se detecte la sesión aunque haya habido error en el trigger)
        if (window.location.search?.includes('error=') || window.location.hash?.includes('error=')) {
          console.log('⚠️ URL contiene error, limpiando...');
          // Limpiar la URL sin recarga
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Esperar para que Supabase procese cualquier sesión pendiente
        await new Promise(resolve => setTimeout(resolve, 300));

        // Obtener la sesión actual (puede estar en localStorage aunque haya error en la URL)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🔍 Sesión obtenida:', session?.user?.email ?? 'Sin usuario');
        if (sessionError) {
          console.warn('⚠️ Warning al obtener sesión:', sessionError?.message);
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          console.log('✅ Usuario encontrado en sesión:', session.user.email);
          fetchUserProfile();
          fetchUserPlan(session.user.id);
        }
        setLoading(false);

        // Escuchar cambios de autenticación en tiempo real
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('🔔 onAuthStateChange:', event);
          console.log('   Usuario:', session?.user?.email ?? 'Sin usuario');
          
          setUser(session?.user ?? null);

          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ SIGNED_IN detectado:', session.user.email);
            fetchUserProfile();
            fetchUserPlan(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            console.log('📤 SIGNED_OUT detectado');
            setUserProfile(null);
            setUserPlan('free');
          } else if (event === 'USER_UPDATED' && session?.user) {
            console.log('🔄 USER_UPDATED:', session.user.email);
            fetchUserProfile();
            fetchUserPlan(session.user.id);
          } else if (session?.user) {
            console.log('ℹ️ Sesión disponible:', session.user.email);
            fetchUserProfile();
            fetchUserPlan(session.user.id);
          }
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('❌ initAuth error:', err);
        setLoading(false);
      }
    };

    const cleanup = initAuth().then(unsub => unsub);
    return () => {
      cleanup.then(unsub => unsub?.());
    };
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Usar solo datos del auth.user (sin intentar acceder a nota_prensa_profiles)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('✅ Usuario obtenido:', user.email);
        setUserProfile({
          name: user.user_metadata?.full_name ?? user.email ?? 'Usuario',
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url
        });
      }
    } catch (error) {
      console.error('❌ fetchUserProfile error:', error);
    }
  };

  const fetchUserPlan = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_plans')
        .select('plan_type')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('⚠️ Error al obtener plan del usuario:', error.message || error);
        setUserPlan('free');
        return;
      }

      const plan = (data as any)?.plan_type ?? 'free';
      setUserPlan(plan === 'pro' ? 'pro' : 'free');
    } catch (err) {
      console.error('❌ fetchUserPlan error:', err);
      setUserPlan('free');
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;

    // El servidor de Supabase crea el perfil automáticamente via trigger
    console.log('✅ Usuario registrado:', data.user?.email);
    return data.user?.id ?? null;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;

    // Devolver el id del usuario si está disponible, o null si requiere confirmación por email
    return data.user?.id ?? null;
  };

  const signInWithGoogle = async () => {
    try {
      console.log('🚀 Iniciando login con Google...');
      console.log('📍 Redirect URL:', window.location.origin);

      // Usar redirect estándar de Supabase (recomendado)
      // Supabase se encargará de redirigir a Google y luego de vuelta aquí
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: false  // Deja que Supabase maneje el redirect
        }
      });

      if (error) {
        console.error('❌ Error en Google OAuth:', error);
        throw error;
      }

      console.log('✅ URL de OAuth lista:', data.url ? 'Sí' : 'No');
      // Supabase automáticamente redirige a Google cuando se procesa la respuesta
      // La página se recargará cuando el usuario vuelva de Google
    } catch (err) {
      console.error('❌ Error inesperado en signInWithGoogle:', err);
      throw err;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signOut,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      userProfile,
      userPlan
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
