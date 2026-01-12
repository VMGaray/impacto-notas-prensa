¿Funcionó mi nota de prensa?
Herramienta de análisis de impacto mediático con IA para el ecosistema MMI. Evalúa el rendimiento de notas de prensa en Radio y Televisión de Canarias mediante búsqueda semántica y análisis automatizado.
  
________________________________________
📋 Tabla de Contenidos
•	Descripción General
•	Características
•	Tecnologías
•	Instalación
•	Uso
•	Arquitectura
•	API y Integración
•	Planes y Límites
•	Documentación Técnica
•	Contacto
________________________________________
🎯 Descripción General
Funcionó Mi Nota permite a organizaciones y profesionales de comunicación evaluar el impacto de sus notas de prensa mediante inteligencia artificial, recuperando datos reales de medios audiovisuales.
Problema que Resuelve
1.	Lentitud del monitoreo manual: Automatiza búsquedas en bases de datos masivas, entregando resultados en segundos
2.	Falta de estructura: Transforma datos crudos en métricas estructuradas con alcance y recomendaciones
3.	Interpretación subjetiva: Análisis objetivo mediante IA especializada
Usuarios Objetivo
•	📢 Departamentos de Comunicación y RR.PP.
•	📊 Analistas de Medios
•	👔 Directivos y Jefes de Prensa
________________________________________
✨ Características
Análisis Inteligente
•	✅ Menciones en Radio y Televisión de Canarias
•	✅ Búsqueda semántica con RAG (Retrieval-Augmented Generation)
•	✅ Clasificación automática por tipo de medio
•	✅ Resumen ejecutivo generado con IA
Métricas Detalladas
•	📈 Cobertura de medios (radio/TV)
•	📡 Emisiones únicas que cubrieron la noticia
•	👥 Alcance estimado (personas impactadas)
•	⏱️ Duración en agenda mediática
•	🎯 Análisis por colores (verde/amarillo/rojo)
Interfaz y Usabilidad
•	💻 Responsive design (móvil/tablet/desktop)
•	📥 Descarga de informes en texto
•	🔍 Extractos de menciones con contexto
•	⚡ Resultados en segundos
________________________________________
🛠️ Tecnologías
Frontend
React 19 + TypeScript
Vite
Tailwind CSS
Backend & Orquestación
n8n (Workflows automatizados)
Supabase (PostgreSQL + pgvector)
Inteligencia Artificial
OpenRouter (GPT-4o-mini, GPT-4.1)
OpenAI Embeddings
RAG (Retrieval-Augmented Generation)
________________________________________
🚀 Instalación
Requisitos Previos
•	Node.js 18+
•	npm o yarn
•	Cuenta en Supabase (opcional para desarrollo local)
Pasos
1.	Clonar el repositorio
git clone < https://github.com/VMGaray/impacto-notas-prensa.git >
cd mmi-react
2.	Instalar dependencias
npm install
3.	Configurar variables de entorno
cp .env.example .env
Editar .env:
VITE_SUPABASE_URL=https://bypxqpsgeactmjmikvxr.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
VITE_N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/...
4.	Iniciar servidor de desarrollo
npm run dev
Scripts Disponibles
Comando	Descripción
npm run dev	Servidor de desarrollo (localhost:5173)
npm run build	Build para producción
npm run preview	Previsualizar build de producción
npm run lint	Ejecutar linter (ESLint)
________________________________________
📖 Uso
Flujo Básico
1.	Acceder a la aplicación
o	Usuarios anónimos: Acceso directo sin límites de registro
o	Usuarios registrados: Límite de 10 consultas diarias
2.	Ingresar datos de la nota de prensa
3.	Organización: Nombre de tu empresa
4.	Tema: Título de la nota de prensa
5.	Fecha: Fecha de publicación
6.	Obtener análisis
o	Resumen ejecutivo
o	Métricas de cobertura
o	Detalle de menciones
o	Recomendaciones accionables
7.	Descargar informe (formato texto)
Ejemplo de Resultado
{
  "resumen_ejecutivo": "La campaña logró excelente cobertura con 45 menciones...",
  "cobertura_medios": 45,
  "cobertura_radio": 30,
  "cobertura_tv": 15,
  "resultado_global": "Funcionó excelentemente",
  "recomendaciones": [
    "Aprovechar el momentum con seguimiento",
    "Reforzar relaciones con medios TV",
    "Programar próxima nota en horario prime time"
  ]
}
________________________________________
🏗️ Arquitectura
Diagrama de Sistema
┌─────────────────────┐
│   Frontend React    │
│  (Vite + TypeScript)│
└──────────┬──────────┘
           │ HTTP POST
           ▼
┌─────────────────────┐
│   n8n Workflow      │
│  - Rate Limiter     │
│  - AI Agent (RAG)   │
│  - Output Parser    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Supabase          │
│  - PostgreSQL       │
│  - Vector Store     │
│  - user_queries     │
└─────────────────────┘
Componentes Principales
1. Frontend (React)
src/
├── components/
│   ├── AuthModal.tsx        # Modal de autenticación
│   ├── MencionesDisplay.tsx # Visualización de menciones
│   ├── MetricsDisplay.tsx   # Tarjetas de métricas
│   └── Modal.tsx            # Modal genérico
├── types/
│   └── index.ts             # Tipos TypeScript
├── App.tsx                  # Componente principal
└── main.tsx                 # Entry point
2. Backend (n8n Workflow)
Nodos principales:
•	Webhook: Recibe peticiones del frontend
•	AI Agent: Orquesta búsqueda con RAG
•	Supabase Vector Store: Búsqueda semántica (top 100)
•	Structured Output Parser: Garantiza formato JSON
•	Rate Limiter: Gestiona límites de uso
Flujo simplificado:
Webhook → Verificar límites → Preparar prompt → 
AI Agent + RAG → Clasificar Radio/TV → 
Generar JSON → Respuesta
3. Base de Datos (Supabase)
Tabla user_queries: Control de límites
CREATE TABLE user_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  organizacion TEXT,
  tema TEXT,
  fecha DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
Tabla tripadvisor: Vector Store (RAG)
CREATE TABLE tripadvisor (
  id UUID PRIMARY KEY,
  content TEXT,
  metadata JSONB,
  embedding VECTOR(1536)
);
________________________________________
🔌 API y Integración
Endpoint Principal
URL: https://[n8n-instance]/webhook/0c67f547-a6b6-431a-9368-68dd2d8a4a8b
Método: POST
Request Body:
{
  "user_id": "uuid-opcional",
  "organizacion": "MMI Comunicaciones",
  "tema": "Lanzamiento de nuevo producto",
  "fecha": "2025-01-12",
  "id_sesion": "session-uuid"
}
Response (200 OK):
{
  "resumen_ejecutivo": "Análisis profesional...",
  "impacto": "Se alcanzaron 45 menciones...",
  "cobertura_medios": 45,
  "cobertura_radio": 30,
  "cobertura_tv": 15,
  "menciones": {
    "total": 45,
    "detalle": [
      {
        "medio": "Radio Nacional",
        "tipo": "radio",
        "fecha": "2025-01-12",
        "extracto": "Contexto de la mención"
      }
    ]
  },
  "resultado_global": "Funcionó excelentemente",
  "recomendaciones": ["...", "...", "..."],
  "analisis": {
    "cobertura": { "color": "verde" },
    "emisiones": { "color": "verde" },
    "duracion": { "color": "amarillo" }
  }
}
Response (429 Too Many Requests):
{
  "error": "Límite de consultas alcanzado",
  "message": "Has alcanzado el límite de 10 consultas diarias.",
  "remainingQueries": 0,
  "maxQueries": 10
}
Ejemplo de Integración (React)
const analyzePress = async (data: PressData) => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user?.id,
        organizacion: data.organization,
        tema: data.subject,
        fecha: data.date,
        id_sesion: sessionId,
      }),
    });

    if (response.status === 429) {
      const error = await response.json();
      showUpgradeModal(error.message);
      return;
    }

    const result = await response.json();
    displayResults(result);
  } catch (error) {
    console.error('Error:', error);
  }
};
________________________________________
💎 Planes y Límites
Plan Gratuito
•	✅ 10 consultas diarias por usuario
•	✅ Análisis de Radio y TV
•	✅ Métricas básicas
•	✅ Descarga de informes
•	⏰ Reset diario a las 00:00
Plan Pro
💼 Contacto: administracion@mmi-e.com
Funcionalidades Pro:
•	♾️ Consultas ilimitadas
•	📊 Comparación de múltiples notas con gráficos
•	📚 Historial completo de análisis
•	📄 Exportación en PDF profesional
•	📰 Análisis de prensa escrita y digital
•	🎯 Alertas personalizadas
________________________________________
📚 Documentación Técnica
Para Desarrolladores
Configuración de n8n
1.	Importar el workflow desde impacto-notas-prensa.json
2.	Configurar credenciales: 
o	OpenRouter API
o	Supabase API
o	OpenAI API
3.	Activar el workflow
4.	Actualizar URL del webhook en el frontend
Variables de Entorno (n8n)
SUPABASE_URL=https://bypxqpsgeactmjmikvxr.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
OPENROUTER_API_KEY=sk-or-...
OPENAI_API_KEY=sk-...
Estructura del Prompt (AI Agent)
const prompt = `Analiza ${tema} de la organización ${organizacion} 
en la fecha ${fecha}. Genera un análisis profesional basado 
únicamente en datos de Supabase. IMPORTANTE: solo RADIO y TELEVISION.`;
Sistema RAG (Retrieval-Augmented Generation)
1.	Query del usuario → OpenAI Embeddings
2.	Búsqueda semántica en Vector Store (top 100)
3.	Clasificación por tipo de medio (Radio/TV)
4.	Generación de análisis estructurado
Monitoreo y Logs
•	n8n Dashboard: Revisar ejecuciones y errores
•	Supabase Dashboard: Monitorear uso de BD y rate limits
•	OpenRouter Dashboard: Controlar tokens y costos
Optimizaciones Futuras
•	[ ] Implementar caché con Redis
•	[ ] Añadir índices compuestos en user_queries
•	[ ] Batch processing para múltiples análisis
•	[ ] Compresión de embeddings
________________________________________
🤝 Contribución
Este es un proyecto privado de MMI. Para reportar bugs o sugerir mejoras:
1.	Crear un issue detallado
2.	Incluir pasos para reproducir
3.	Adjuntar logs relevantes
________________________________________
📞 Contacto
Equipo MMI
•	📧 Email: administracion@mmi-e.com
•	🌐 Web: mmi-e.com
•	💼 Plan Pro: Contactar por email
________________________________________
📄 Licencia
© 2025 MMI - Todos los derechos reservados.
________________________________________
📝 Changelog
v1.0.0 (2025-01-12)
•	🎉 Lanzamiento inicial
•	✅ Análisis de Radio y TV
•	✅ Sistema de límites (10 consultas/día)
•	✅ Interfaz responsive
•	✅ Integración con n8n y Supabase
