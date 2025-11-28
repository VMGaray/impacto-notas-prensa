# 🧪 Guía de Testing - Sistema de Autenticación

## ✅ Lo que acabo de implementar:

1. **Sistema de fallback con localStorage** - Funciona sin Supabase para testing
2. **Banner de advertencia** - Te avisa cuando Supabase no está configurado
3. **Logs en consola** - Para debugging
4. **Flujo completo** - Primera consulta gratis → Banner → Modal de registro

---

## 🚀 Cómo Probar AHORA (sin configurar Supabase)

### 1. Abre la aplicación en tu navegador:
```
http://localhost:5173
```

### 2. Abre la Consola del Navegador (F12 → Console)
Verás mensajes como:
```
⚠️ Supabase no configurado - usando localStorage como fallback
```

### 3. Haz la PRIMERA consulta:
- Completa el formulario (organización, tema, fecha)
- Haz clic en "Analizar mi nota de prensa"
- Espera los resultados

**Lo que debería pasar:**
- ✅ Consulta se procesa normalmente
- ✅ Ves el banner: **"✨ Te quedan 0 consultas gratuitas hoy"**
- ✅ En consola: `✅ Consulta anónima registrada en localStorage`

### 4. Intenta hacer SEGUNDA consulta:
**Opción A**: Haz clic en el botón **"🔄 Analizar otra nota de prensa"**

**Opción B**: Llena el formulario de nuevo y haz submit

**Lo que debería pasar:**
- ✅ Aparece el modal de Login/Registro
- ✅ En consola: `[handleResetForm] Límite alcanzado - mostrando modal de autenticación`
- ❌ NO te deja hacer más consultas

### 5. Verificar localStorage:
En la consola del navegador, ejecuta:
```javascript
localStorage.getItem('anonymous_query_data')
```

Deberías ver algo como:
```json
{"queryCount":1,"lastQueryAt":1732543200000,"expiresAt":1732629600000}
```

---

## 🔍 Debugging

### Si el banner NO aparece:

1. **Abre la consola del navegador** (F12 → Console)
2. Busca errores en rojo
3. Verifica que veas:
   ```
   ✅ Consulta anónima registrada en localStorage
   Estado actualizado: remainingQueries=0, showBanner=true
   ```

### Si te deja hacer más consultas:

1. Verifica en consola que aparezca:
   ```
   [handleResetForm] Límite alcanzado - mostrando modal de autenticación
   ```

2. Si no aparece, limpia localStorage:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

### Limpiar todo y empezar de nuevo:

En la consola del navegador:
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## 📊 Mensajes de Consola que Deberías Ver

### Al cargar la página:
```
⚠️ Supabase no está configurado. Usando localStorage como fallback temporal.
ID de sesión generado: [uuid]
```

### Al hacer primera consulta:
```
Enviando datos al webhook: {organizacion: "...", tema: "...", ...}
⚠️ Supabase no configurado - usando localStorage como fallback
✅ Consulta anónima registrada en localStorage
Estado actualizado: remainingQueries=0, showBanner=true
```

### Al intentar segunda consulta:
```
[handleResetForm] Verificando límites - remainingQueries: 0 showBanner: true
[handleResetForm] Límite alcanzado - mostrando modal de autenticación
```

---

## 🎯 Checklist de Pruebas

- [ ] Banner de advertencia amarillo aparece arriba
- [ ] Primera consulta funciona normalmente
- [ ] Banner "Te quedan 0 consultas" aparece después de primera consulta
- [ ] Botón "Analizar otra nota" muestra modal de login
- [ ] Modal tiene tabs "Crear cuenta" e "Iniciar sesión"
- [ ] Modal muestra mensaje "¡Vemos que te gusta! 🎉"
- [ ] Botón "Continuar con Google" está visible
- [ ] localStorage tiene el registro guardado

---

## ⚙️ Para Usar en Producción (con Supabase)

1. **Sigue el archivo `SETUP_AUTH.md`**
2. **Crea el archivo `.env`** con tus credenciales
3. **Ejecuta el script SQL** en Supabase
4. **Reinicia el servidor**: `npm run dev`
5. El banner amarillo desaparecerá automáticamente
6. Datos se guardarán en Supabase en lugar de localStorage

---

## 🐛 Problemas Comunes

### "No aparece el modal de login"
- Verifica en consola que `remainingQueries` sea 0
- Verifica que `showBanner` sea true
- Limpia localStorage y vuelve a intentar

### "El banner dice '1 consulta' en lugar de '0'"
- Verifica que la consulta se haya registrado correctamente
- Revisa consola para ver `✅ Consulta anónima registrada`

### "Puedo hacer consultas infinitas"
- localStorage puede estar limpio
- Verifica con: `localStorage.getItem('anonymous_query_data')`
- Si está vacío, el sistema piensa que no has hecho consultas

---

## 📞 Siguiente Paso

Una vez que confirmes que el flujo funciona correctamente con localStorage, podemos:
1. Configurar Supabase para persistencia real
2. Configurar Google OAuth
3. Deployar a producción

¡Pruébalo ahora y dime qué ves! 🚀
