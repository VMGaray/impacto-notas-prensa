-- Tabla para rastrear consultas de visitantes anónimos
CREATE TABLE IF NOT EXISTS visitors_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fingerprint VARCHAR(64) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  query_count INT DEFAULT 1,
  last_query_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para búsquedas rápidas por fingerprint
CREATE INDEX IF NOT EXISTS idx_visitors_fingerprint ON visitors_queries(fingerprint);

-- Índice para limpiar registros expirados
CREATE INDEX IF NOT EXISTS idx_visitors_expires ON visitors_queries(expires_at);

-- Tabla para rastrear consultas de usuarios autenticados
CREATE TABLE IF NOT EXISTS user_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organizacion TEXT NOT NULL,
  tema TEXT NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_user_queries_user_id ON user_queries(user_id);

-- Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_user_queries_created_at ON user_queries(created_at);

-- Tabla para gestionar planes de usuarios (Free/Pro)
CREATE TABLE IF NOT EXISTS user_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_type VARCHAR(20) DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans(user_id);

-- Función para limpiar registros expirados automáticamente
CREATE OR REPLACE FUNCTION cleanup_expired_visitors()
RETURNS void AS $$
BEGIN
  DELETE FROM visitors_queries WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Políticas de seguridad RLS (Row Level Security)

-- Habilitar RLS en las tablas
ALTER TABLE visitors_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

-- Políticas para visitors_queries (acceso público para insertar/consultar)
CREATE POLICY "Permitir inserción anónima" ON visitors_queries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir lectura anónima por fingerprint" ON visitors_queries
  FOR SELECT USING (true);

-- Políticas para user_queries (solo el usuario puede ver sus propias consultas)
CREATE POLICY "Usuarios pueden insertar sus consultas" ON user_queries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden ver sus consultas" ON user_queries
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para user_plans (solo el usuario puede ver su plan)
CREATE POLICY "Usuarios pueden ver su plan" ON user_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Sistema puede crear planes" ON user_plans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Sistema puede actualizar planes" ON user_plans
  FOR UPDATE USING (true);

-- Trigger para crear plan Free automáticamente al registrarse
CREATE OR REPLACE FUNCTION create_default_user_plan()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_plans (user_id, plan_type)
  VALUES (NEW.id, 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_plan();

-- Comentarios en las tablas
COMMENT ON TABLE visitors_queries IS 'Rastreo de consultas anónimas con fingerprinting del navegador';
COMMENT ON TABLE user_queries IS 'Historial de consultas de usuarios autenticados';
COMMENT ON TABLE user_plans IS 'Planes de suscripción de usuarios (Free/Pro)';
