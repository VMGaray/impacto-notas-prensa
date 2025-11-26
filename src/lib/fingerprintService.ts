import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { supabase } from './supabase';

let fpPromise: Promise<any> | null = null;

// Verificar si Supabase está configurado
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && !url.includes('tu-proyecto') && !key.includes('tu-anon-key');
};

/**
 * Inicializa y obtiene el visitor ID único del navegador
 */
export const getVisitorId = async (): Promise<string> => {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }

  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
};

/**
 * Obtiene la IP del usuario (aproximada desde el cliente)
 */
const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
};

/**
 * Verifica si un usuario anónimo puede hacer una consulta (con fallback a localStorage)
 * Límite: 3 consultas gratuitas cada 24 horas
 * Retorna: { canQuery: boolean, remainingQueries: number }
 */
export const checkAnonymousQueryLimit = async (): Promise<{
  canQuery: boolean;
  remainingQueries: number;
}> => {
  const MAX_ANONYMOUS_QUERIES = 3;

  // Si Supabase no está configurado, usar localStorage como fallback
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase no configurado - usando localStorage como fallback');
    const stored = localStorage.getItem('anonymous_query_data');
    if (!stored) {
      return { canQuery: true, remainingQueries: MAX_ANONYMOUS_QUERIES };
    }

    const data = JSON.parse(stored);
    const now = new Date().getTime();

    // Verificar si expiró (24 horas)
    if (now > data.expiresAt) {
      localStorage.removeItem('anonymous_query_data');
      return { canQuery: true, remainingQueries: MAX_ANONYMOUS_QUERIES };
    }

    // Calcular consultas restantes
    const remaining = MAX_ANONYMOUS_QUERIES - (data.queryCount || 0);
    return {
      canQuery: remaining > 0,
      remainingQueries: Math.max(0, remaining)
    };
  }

  try {
    const fingerprint = await getVisitorId();

    // Consultar si ya existe un registro en las últimas 24 horas
    const { data, error } = await supabase
      .from('visitors_queries')
      .select('*')
      .eq('fingerprint', fingerprint)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 es "no rows returned", lo cual está bien
      console.error('Error al verificar límite:', error);
      throw error;
    }

    if (!data) {
      // Primera vez hoy - puede hacer 3 consultas
      return { canQuery: true, remainingQueries: MAX_ANONYMOUS_QUERIES };
    }

    // Calcular consultas restantes
    const queryCount = data.query_count || 0;
    const remaining = MAX_ANONYMOUS_QUERIES - queryCount;

    return {
      canQuery: remaining > 0,
      remainingQueries: Math.max(0, remaining)
    };
  } catch (error) {
    console.error('Error en checkAnonymousQueryLimit:', error);
    // En caso de error, usar localStorage como fallback
    const stored = localStorage.getItem('anonymous_query_data');
    if (!stored) {
      return { canQuery: true, remainingQueries: MAX_ANONYMOUS_QUERIES };
    }
    const data = JSON.parse(stored);
    const remaining = MAX_ANONYMOUS_QUERIES - (data.queryCount || 0);
    return {
      canQuery: remaining > 0,
      remainingQueries: Math.max(0, remaining)
    };
  }
};

/**
 * Registra una consulta anónima (con fallback a localStorage)
 * Incrementa el contador de consultas
 */
export const registerAnonymousQuery = async (): Promise<boolean> => {
  // Si Supabase no está configurado, usar localStorage como fallback
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase no configurado - usando localStorage como fallback');
    const now = new Date().getTime();
    const expiresAt = now + (24 * 60 * 60 * 1000); // 24 horas

    const stored = localStorage.getItem('anonymous_query_data');
    let queryCount = 1;

    if (stored) {
      const data = JSON.parse(stored);
      // Si no expiró, incrementar contador
      if (now < data.expiresAt) {
        queryCount = (data.queryCount || 0) + 1;
      }
    }

    const data = {
      queryCount,
      lastQueryAt: now,
      expiresAt: expiresAt
    };

    localStorage.setItem('anonymous_query_data', JSON.stringify(data));
    console.log(`✅ Consulta anónima registrada en localStorage (${queryCount}/3)`);
    return true;
  }

  try {
    const fingerprint = await getVisitorId();
    const ip = await getClientIP();

    // Verificar si ya existe un registro
    const { data: existing, error: selectError } = await supabase
      .from('visitors_queries')
      .select('*')
      .eq('fingerprint', fingerprint)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error al verificar registro:', selectError);
      throw selectError;
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    if (!existing) {
      // Crear nuevo registro
      const { error } = await supabase
        .from('visitors_queries')
        .insert({
          fingerprint,
          ip_address: ip,
          query_count: 1,
          last_query_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;
      console.log('✅ Consulta anónima registrada en Supabase (1/3)');
    } else {
      // Actualizar contador
      const newCount = (existing.query_count || 0) + 1;
      const { error } = await supabase
        .from('visitors_queries')
        .update({
          query_count: newCount,
          last_query_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
      console.log(`✅ Consulta anónima registrada en Supabase (${newCount}/3)`);
    }

    return true;
  } catch (error) {
    console.error('Error en registerAnonymousQuery:', error);
    // Fallback a localStorage
    const now = new Date().getTime();
    const stored = localStorage.getItem('anonymous_query_data');
    let queryCount = 1;

    if (stored) {
      const data = JSON.parse(stored);
      if (now < data.expiresAt) {
        queryCount = (data.queryCount || 0) + 1;
      }
    }

    const data = {
      queryCount,
      lastQueryAt: now,
      expiresAt: now + (24 * 60 * 60 * 1000)
    };
    localStorage.setItem('anonymous_query_data', JSON.stringify(data));
    return true;
  }
};

/**
 * Verifica límites para usuarios autenticados
 * Free: 10 consultas diarias
 * Pro: ilimitado
 */
export const checkAuthenticatedQueryLimit = async (
  userId: string,
  plan: 'free' | 'pro' = 'free'
): Promise<{
  canQuery: boolean;
  remainingQueries: number;
}> => {
  if (plan === 'pro') {
    return { canQuery: true, remainingQueries: -1 }; // -1 significa ilimitado
  }

  const MAX_FREE_QUERIES = 10;

  try {
    // Obtener las consultas de hoy del usuario
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('user_queries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('Error al verificar límite de usuario:', error);
      throw error;
    }

    const queriesCount = data?.length || 0;
    const remaining = Math.max(0, MAX_FREE_QUERIES - queriesCount);

    return {
      canQuery: remaining > 0,
      remainingQueries: remaining
    };
  } catch (error) {
    console.error('Error en checkAuthenticatedQueryLimit:', error);
    // En caso de error, permitir consultas por defecto
    return { canQuery: true, remainingQueries: MAX_FREE_QUERIES };
  }
};

/**
 * Registra una consulta de usuario autenticado
 */
export const registerAuthenticatedQuery = async (
  userId: string,
  queryData: {
    organizacion: string;
    tema: string;
    fecha: string;
  }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_queries')
      .insert({
        user_id: userId,
        organizacion: queryData.organizacion,
        tema: queryData.tema,
        fecha: queryData.fecha,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error al registrar consulta de usuario:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en registerAuthenticatedQuery:', error);
    return false;
  }
};
