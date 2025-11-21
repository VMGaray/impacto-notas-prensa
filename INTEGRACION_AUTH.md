# Integración del Sistema de Autenticación

## 📋 Archivos creados

✅ `lib/supabase.ts` - Cliente de Supabase
✅ `lib/hooks/useFingerprint.ts` - Hook para fingerprinting
✅ `lib/services/queryLimits.ts` - Servicio de límites de consultas
✅ `src/components/AuthModal.tsx` - Modal de Login/Registro
✅ `.env.example` - Ejemplo de variables de entorno
✅ Estilos CSS agregados a `src/App.css`

## 🔧 Configuración de Supabase

### 1. Crear archivo .env

Copia `.env.example` a `.env` y completa con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2. Configurar Auth en Supabase

En tu proyecto de Supabase:
- Ve a **Authentication > Settings**
- Configura los providers que quieras (Email/Password está habilitado por defecto)
- Configura las URLs de redirección si es necesario

### 3. Crear tablas necesarias (opcional para límites de consultas)

```sql
-- Tabla para consultas de usuarios registrados
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  organization TEXT,
  theme TEXT,
  date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para consultas anónimas
CREATE TABLE anonymous_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id TEXT NOT NULL,
  query_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Función para contar consultas del día
CREATE OR REPLACE FUNCTION count_queries_today(p_visitor_id TEXT)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM anonymous_queries
  WHERE visitor_id = p_visitor_id
  AND created_at::DATE = CURRENT_DATE;
$$ LANGUAGE SQL;
```

## 🎨 Integración en App.tsx

### Paso 1: Importar componentes

```typescript
import { AuthModal } from './components/AuthModal';
import { useFingerprint } from '../lib/hooks/useFingerprint';
import { supabase } from '../lib/supabase';
```

### Paso 2: Agregar estados

```typescript
function App() {
  // Estados existentes...
  const [sessionId, setSessionId] = useState<string>('');

  // NUEVOS ESTADOS
  const [modalAuth, setModalAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { visitorId, loading: fingerprintLoading } = useFingerprint();

  // ... resto del código
}
```

### Paso 3: Verificar sesión al iniciar

```typescript
useEffect(() => {
  // Verificar si hay sesión activa
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });

  // Escuchar cambios de autenticación
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

### Paso 4: Agregar botón de Login en el header

```typescript
return (
  <div className="container">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>¿Funciono mi nota de prensa?</h1>

      {user ? (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ color: '#4a5568' }}>Hola, {user.user_metadata?.name || user.email}</span>
          <button
            className="btn-small btn-secondary"
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <button
          className="btn-small btn-primary"
          onClick={() => setModalAuth(true)}
        >
          Iniciar Sesión
        </button>
      )}
    </div>

    {/* Resto del componente... */}
  </div>
);
```

### Paso 5: Agregar el modal antes del cierre del return

```typescript
return (
  <div className="container">
    {/* ... todo tu código existente ... */}

    {/* Modal de Autenticación */}
    <AuthModal
      isOpen={modalAuth}
      onClose={() => setModalAuth(false)}
      onAuthSuccess={(userId) => {
        console.log('Usuario autenticado:', userId);
        setModalAuth(false);
      }}
    />
  </div>
);
```

## 🔒 Implementar límites de consultas (opcional)

```typescript
import { checkQueryLimit } from '../lib/services/queryLimits';

// Antes de enviar el formulario
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  // Verificar límites
  const { canQuery, queriesUsed, limit, requiresAuth } = await checkQueryLimit(
    visitorId,
    user?.id || null
  );

  if (!canQuery) {
    if (requiresAuth) {
      alert(`Has alcanzado el límite de ${limit} consulta(s) diarias. Por favor inicia sesión para continuar.`);
      setModalAuth(true);
      return;
    } else {
      alert(`Has alcanzado el límite de ${limit} consultas diarias.`);
      return;
    }
  }

  // Continuar con el análisis...
  // ... tu código existente de fetch al webhook
};
```

## 📱 Características del sistema

### Componente AuthModal
- ✅ Pestañas para cambiar entre Login y Registro
- ✅ Validación de contraseñas (mínimo 6 caracteres)
- ✅ Confirmación de contraseña en registro
- ✅ Manejo de errores con mensajes claros
- ✅ Estados de carga
- ✅ Diseño responsive
- ✅ Mismo estilo visual del proyecto

### Campos de Registro
- Nombre
- Email
- Contraseña
- Confirmar Contraseña

### Campos de Login
- Email
- Contraseña

## 🎯 Próximos pasos

1. **Configurar Supabase** con tus credenciales
2. **Crear las tablas** necesarias en Supabase
3. **Integrar el AuthModal** en App.tsx siguiendo las instrucciones
4. **Implementar los límites** de consultas (opcional)
5. **Probar** el flujo completo de registro/login

## 🔗 Recursos

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [FingerprintJS Documentation](https://github.com/fingerprintjs/fingerprintjs)

---

**Nota:** El archivo `.env` está ignorado en git para proteger tus credenciales.
