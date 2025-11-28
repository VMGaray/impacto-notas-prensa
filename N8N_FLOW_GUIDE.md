# 🔄 Guía de Flujo n8n - Verificación de Límites

## 📊 **Arquitectura del Flujo**

```
[Webhook] → [IF: ¿Tiene user_id?] → [SI: Verificar límites registrado]
                                   → [NO: Continuar sin verificar]
```

---

## 🛠️ **Configuración Paso a Paso**

### **NODO 1: Webhook (Ya existe)**

Tu webhook actual:
```
https://n8n.icc-e.org/webhook/0c67f547-a6b6-431a-9368-68dd2d8a4a8b
```

**Datos que ahora recibe:**
```json
{
  "organizacion": "TechCorp",
  "tema": "Lanzamiento",
  "fecha": "2024-11-25",
  "id_sesion": "uuid-sesion",
  "user_id": "uuid-usuario-o-null"  ← NUEVO
}
```

---

### **NODO 2: IF - ¿Usuario Registrado?**

**Tipo:** IF Node

**Configuración:**
- **Condition 1:**
  - **Field:** `{{ $json.user_id }}`
  - **Operation:** `is not empty`

**Rutas:**
- **TRUE** → Usuario registrado → Verificar límites
- **FALSE** → Usuario anónimo → Continuar (frontend ya validó)

---

### **NODO 3: Supabase - Contar Consultas de Hoy**

**Tipo:** HTTP Request (o Supabase node si lo tienes)

**Configuración:**

**Method:** GET

**URL:**
```
https://bypxqpsgeactmjmikvxr.supabase.co/rest/v1/user_queries
```

**Headers:**
```
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cHhxcHNnZWFjdG1qbWlrdnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNTM4MDUsImV4cCI6MjA2ODkyOTgwNX0.XMyPF4oSKB13EwFmH8KwSkh1LjPWxTuC3KohKe_29RY

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cHhxcHNnZWFjdG1qbWlrdnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNTM4MDUsImV4cCI6MjA2ODkyOTgwNX0.XMyPF4oSKB13EwFmH8KwSkh1LjPWxTuC3KohKe_29RY

Content-Type: application/json
```

**Query Parameters:**
```
user_id=eq.{{ $json.user_id }}
created_at=gte.{{ $today }}
select=id
```

**Para obtener `$today` (inicio del día):**

Agrega un nodo **Code** antes:

```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);

return [{
  json: {
    ...items[0].json,
    today_iso: today.toISOString()
  }
}];
```

Entonces en la query:
```
created_at=gte.{{ $json.today_iso }}
```

---

### **NODO 4: Function - Contar Resultados**

**Tipo:** Code Node

**Código:**
```javascript
const items = $input.all();
const queryResults = items[0].json; // Array de resultados de Supabase

let count = 0;

if (Array.isArray(queryResults)) {
  count = queryResults.length;
}

const MAX_QUERIES = 10;
const remaining = MAX_QUERIES - count;

return [{
  json: {
    queriesCount: count,
    remainingQueries: remaining,
    canContinue: remaining > 0,
    user_id: items[0].json.user_id,
    organizacion: items[0].json.organizacion,
    tema: items[0].json.tema,
    fecha: items[0].json.fecha
  }
}];
```

---

### **NODO 5: IF - ¿Puede Continuar?**

**Tipo:** IF Node

**Configuración:**
- **Condition 1:**
  - **Field:** `{{ $json.canContinue }}`
  - **Operation:** `is equal to`
  - **Value:** `true`

**Rutas:**
- **TRUE** → Continuar con el análisis
- **FALSE** → Retornar error de límite

---

### **NODO 6A: Respond - Error de Límite (FALSE)**

**Tipo:** Respond to Webhook

**Configuración:**

**Status Code:** 429 (Too Many Requests)

**Response Body:**
```json
{
  "error": "Límite de consultas alcanzado",
  "message": "Has alcanzado el límite de 10 consultas diarias. Vuelve mañana o actualiza a Pro.",
  "remainingQueries": 0,
  "maxQueries": 10
}
```

---

### **NODO 6B: Continuar - Registrar Consulta (TRUE)**

**Tipo:** HTTP Request a Supabase

**Method:** POST

**URL:**
```
https://bypxqpsgeactmjmikvxr.supabase.co/rest/v1/user_queries
```

**Headers:** (iguales que antes)

**Body:**
```json
{
  "user_id": "{{ $json.user_id }}",
  "organizacion": "{{ $json.organizacion }}",
  "tema": "{{ $json.tema }}",
  "fecha": "{{ $json.fecha }}"
}
```

Después de esto → **Continúa con tu flujo actual de análisis**

---

## 📋 **Resumen del Flujo Completo**

```
1. [Webhook] Recibe datos
    ↓
2. [Code] Calcular today_iso
    ↓
3. [IF] ¿user_id existe?
    ↓           ↓
   SÍ          NO → Continuar análisis
    ↓
4. [HTTP] Consultar user_queries en Supabase
    ↓
5. [Code] Contar y calcular remaining
    ↓
6. [IF] ¿canContinue?
    ↓           ↓
   SÍ          NO → Error 429
    ↓
7. [HTTP] Registrar consulta en user_queries
    ↓
8. Continuar con análisis actual (Claude, etc.)
```

---

## 🧪 **Testing**

### **Caso 1: Usuario Anónimo**
```json
POST al webhook:
{
  "organizacion": "Test",
  "tema": "Test",
  "fecha": "2024-11-25",
  "user_id": null
}
```
✅ Debería pasar directamente al análisis (frontend ya validó las 3)

### **Caso 2: Usuario Registrado - Primera Consulta**
```json
POST al webhook:
{
  "organizacion": "Test",
  "tema": "Test",
  "fecha": "2024-11-25",
  "user_id": "real-uuid-from-supabase"
}
```
✅ Debería registrar en user_queries y continuar

### **Caso 3: Usuario Registrado - Consulta 11**
```json
(mismo que caso 2, pero después de 10 consultas)
```
❌ Debería retornar error 429

---

## 🔧 **Tips de Implementación**

1. **Orden de nodos:** Primero verificar, luego registrar
2. **Manejo de errores:** Usa Try/Catch en los nodos HTTP
3. **Logs:** Agrega nodos "Set" para debug
4. **Testing:** Usa el botón "Execute Workflow" con datos de prueba

---

## 📝 **Variables que Necesitas**

En tu proyecto n8n:

```javascript
SUPABASE_URL = "https://bypxqpsgeactmjmikvxr.supabase.co"
SUPABASE_ANON_KEY = "eyJhbG..."
MAX_FREE_QUERIES = 10
```

---

## ✅ **Checklist de Implementación**

- [ ] Nodo IF para verificar user_id
- [ ] Nodo Code para calcular today_iso
- [ ] Nodo HTTP para consultar user_queries
- [ ] Nodo Code para contar resultados
- [ ] Nodo IF para verificar límite
- [ ] Nodo Respond para error 429
- [ ] Nodo HTTP para registrar consulta
- [ ] Conectar con flujo de análisis existente
- [ ] Probar con usuario anónimo
- [ ] Probar con usuario registrado (< 10)
- [ ] Probar con usuario registrado (= 10)

---

¿Necesitas ayuda con algún nodo específico? ¡Dime y te explico en detalle!
