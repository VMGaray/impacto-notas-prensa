// lib/services/queryLimits.ts
import {supabase} from "../supabase"

export const LIMITS = {
  ANONYMOUS: 1,
  FREE: 3,
  PRO: 999
};

export async function checkQueryLimit(
  visitorId: string | null,
  userId: string | null
): Promise<{
  canQuery: boolean;
  queriesUsed: number;
  limit: number;
  requiresAuth: boolean;
}> {
  // Si hay usuario registrado
  if (userId) {
    // TODO: Verificar plan del usuario (Pro vs Free)
    // Por ahora asumimos Free
    const { data: queries } = await supabase
      .from('queries') // tu tabla actual de queries
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', new Date().toISOString().split('T')[0]);

    const used = queries?.length || 0;

    return {
      canQuery: used < LIMITS.FREE,
      queriesUsed: used,
      limit: LIMITS.FREE,
      requiresAuth: false
    };
  }

  // Usuario anónimo
  if (visitorId) {
    const { data, error } = await supabase
      .rpc('count_queries_today', { p_visitor_id: visitorId });

    if (error) {
      console.error('Error checking limits:', error);
      // Si falla, permitimos la consulta (fail-open)
      return {
        canQuery: true,
        queriesUsed: 0,
        limit: LIMITS.ANONYMOUS,
        requiresAuth: false
      };
    }

    const used = data || 0;

    return {
      canQuery: used < LIMITS.ANONYMOUS,
      queriesUsed: used,
      limit: LIMITS.ANONYMOUS,
      requiresAuth: used >= LIMITS.ANONYMOUS
    };
  }

  // Sin visitorId ni userId (error)
  return {
    canQuery: false,
    queriesUsed: 0,
    limit: 0,
    requiresAuth: true
  };
}

export async function recordAnonymousQuery(
  visitorId: string,
  queryData: { organization: string; theme: string; date: string }
) {
  const { error } = await supabase
    .from('anonymous_queries')
    .insert({
      visitor_id: visitorId,
      query_data: queryData
    });

  if (error) {
    console.error('Error recording query:', error);
    throw error;
  }
} 