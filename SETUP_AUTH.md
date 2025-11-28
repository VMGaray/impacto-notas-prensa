# Guía de Configuración - Sistema de Autenticación

Esta guía te ayudará a configurar el sistema de autenticación y límites de consultas implementado en la aplicación.

## 📋 Prerequisitos

- Cuenta de Supabase (https://supabase.com)
- Cuenta de Google Cloud Platform (para OAuth de Google - opcional)

## 🔧 Paso 1: Configurar Supabase

### 1.1 Crear Proyecto en Supabase

1. Accede a https://supabase.com y crea un nuevo proyecto
2. Espera a que el proyecto se inicialice completamente
3. Anota la URL y la clave anónima (Anon Key)

### 1.2 Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` con tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

### 1.3 Ejecutar el Script SQL

1. Ve a tu proyecto de Supabase
2. Navega a **SQL Editor** en el menú lateral
3. Crea una nueva consulta
4. Copia y pega todo el contenido del archivo `src/archivo/supabase_schema.sql`
5. Ejecuta el script

Esto creará:
- Tabla `visitors_queries` - para rastrear consultas anónimas
- Tabla `user_queries` - para rastrear consultas de usuarios autenticados
- Tabla `user_plans` - para gestionar planes (Free/Pro)
- Políticas RLS (Row Level Security)
- Trigger para crear plan Free automáticamente

### 1.4 Verificar Tablas Creadas

En Supabase, ve a **Table Editor** y verifica que existan:
- ✅ visitors_queries
- ✅ user_queries
- ✅ user_plans

## 🔐 Paso 2: Configurar Google OAuth (Opcional pero Recomendado)

### 2.1 Crear Credenciales en Google Cloud

1. Ve a https://console.cloud.google.com
2. Crea un nuevo proyecto o selecciona uno existente
3. Navega a **APIs & Services > Credentials**
4. Haz clic en **Create Credentials > OAuth client ID**
5. Selecciona **Web application**
6. Configura:
   - **Name**: MMI React App
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **Authorized redirect URIs**:
     - `https://tu-proyecto.supabase.co/auth/v1/callback`

7. Anota el **Client ID** y **Client Secret**

### 2.2 Configurar OAuth en Supabase

1. En Supabase, ve a **Authentication > Providers**
2. Busca **Google** y actívalo
3. Pega el **Client ID** y **Client Secret** de Google
4. Guarda los cambios

### 2.3 Configurar URLs de Redirección

En **Authentication > URL Configuration**:
- **Site URL**: `http://localhost:5173` (desarrollo) o tu dominio en producción
- **Redirect URLs**: Agrega `http://localhost:5173` y tu dominio de producción

## 📧 Paso 3: Configurar Email de Confirmación (Opcional)

Por defecto, Supabase require confirmación por email. Puedes desactivarlo para desarrollo:

1. Ve a **Authentication > Providers > Email**
2. Desactiva **Confirm email**
3. Guarda los cambios

Para producción, configura un proveedor de email personalizado en **Project Settings > Auth > Email Templates**.

## 🚀 Paso 4: Probar la Aplicación

### 4.1 Instalar Dependencias

```bash
npm install
```

### 4.2 Ejecutar en Desarrollo

```bash
npm run dev
```

### 4.3 Flujo de Pruebas

1. **Primera Consulta Anónima**:
   - Abre la aplicación
   - Completa el formulario sin registrarte
   - Envía la consulta
   - Deberías ver los resultados y un banner invitando a crear cuenta

2. **Segunda Consulta (Bloqueo)**:
   - Haz clic en "Analizar otra nota de prensa"
   - Deberías ver un modal pidiendo registro

3. **Registro/Login**:
   - Prueba registrarte con email
   - Prueba login con Google
   - Verifica que puedas hacer 3 consultas diarias

4. **Verificar Base de Datos**:
   - Ve a Supabase Table Editor
   - Verifica que se estén registrando las consultas en `visitors_queries` y `user_queries`

## 🔍 Solución de Problemas

### Error: "Invalid Supabase URL"
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Verifica que las variables empiecen con `VITE_`
- Reinicia el servidor de desarrollo

### Error: "Google OAuth no funciona"
- Verifica que las URLs de redirección coincidan exactamente
- Verifica que el Client ID y Secret sean correctos
- Verifica que el OAuth esté habilitado en Supabase

### Error: "Failed to create tables"
- Asegúrate de ejecutar todo el script SQL completo
- Verifica que tengas permisos de administrador en Supabase
- Revisa los logs de errores en Supabase SQL Editor

### Las consultas no se están limitando
- Verifica que las tablas se hayan creado correctamente
- Revisa la consola del navegador para errores
- Verifica que las políticas RLS estén activas

## 📊 Estructura de Límites

### Usuario Anónimo
- **Consultas permitidas**: 1 cada 24 horas
- **Identificación**: Fingerprinting del navegador + IP
- **Persistencia**: 24 horas en tabla `visitors_queries`

### Usuario Free (Registrado)
- **Consultas permitidas**: 3 por día
- **Reseteo**: Diario (00:00 UTC)
- **Historial**: Guardado en `user_queries`

### Usuario Pro
- **Consultas permitidas**: Ilimitadas
- **Funciones extra**: Comparativas, historial extendido, reportes

## 🔄 Actualizar a Plan Pro

Para actualizar un usuario a plan Pro manualmente:

1. Ve a Supabase Table Editor
2. Abre la tabla `user_plans`
3. Busca el registro del usuario
4. Cambia `plan_type` de `'free'` a `'pro'`
5. Guarda los cambios

## 📝 Notas Importantes

1. **Seguridad**: Nunca compartas tus credenciales de Supabase o Google
2. **Producción**: Cambia las URLs de desarrollo por las de producción
3. **RLS**: Las políticas de seguridad RLS están activas para proteger los datos
4. **Limpieza**: Los registros de `visitors_queries` se limpian automáticamente después de 24 horas
5. **Backup**: Haz backup de tu base de datos regularmente

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs en la consola del navegador
2. Revisa los logs en Supabase Dashboard
3. Verifica que todas las variables de entorno estén correctas
4. Contacta al equipo de desarrollo

## ✅ Checklist de Configuración

- [ ] Proyecto de Supabase creado
- [ ] Variables de entorno configuradas en `.env`
- [ ] Script SQL ejecutado correctamente
- [ ] Tablas verificadas en Table Editor
- [ ] Google OAuth configurado (opcional)
- [ ] Email de confirmación configurado
- [ ] Aplicación ejecutándose en desarrollo
- [ ] Primera consulta anónima funciona
- [ ] Bloqueo después de primera consulta funciona
- [ ] Registro/Login funciona
- [ ] Límites de consultas funcionan correctamente
