# ¿Funcionó mi nota de prensa?

Aplicación web para analizar la repercusión de notas de prensa en medios de comunicación canarios (radio y televisión).

## Descripción

Esta herramienta permite a organizaciones y profesionales de la comunicación evaluar el impacto de sus notas de prensa en los medios canarios. El sistema analiza menciones en radio y televisión, proporcionando métricas detalladas sobre cobertura, alcance y duración en la agenda mediática.

### Características principales

- Análisis de menciones en radio y televisión de Canarias
- Métricas detalladas: cobertura de medios, emisiones, alcance estimado
- Resumen ejecutivo generado con Inteligencia Artificial
- Visualización de menciones con extractos de las noticias
- Descarga de informes en formato texto
- Interfaz responsive adaptada a dispositivos móviles

## Tecnologías

- **Frontend:** React 19 + TypeScript
- **Build:** Vite
- **Backend:** n8n (webhooks)
- **Base de datos:** Supabase (opcional)
- **IA:** Claude AI para análisis de contenido

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd mmi-react
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar `.env` con tus credenciales de Supabase (opcional).

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta el linter |

## Estructura del proyecto

```
src/
├── components/        # Componentes React
│   ├── AuthModal.tsx
│   ├── MencionesDisplay.tsx
│   ├── MetricsDisplay.tsx
│   └── Modal.tsx
├── types/            # Definiciones de tipos TypeScript
├── App.tsx           # Componente principal
├── App.css           # Estilos
└── main.tsx          # Punto de entrada
```

## Versiones

### Versión gratuita
- Consulta menciones de radio y televisión en Canarias
- Análisis de los últimos 3 días
- Descarga de informe básico

### Versión Pro
- Comparación de múltiples análisis
- Historial de análisis guardado
- Análisis de prensa escrita y digital
- Exportación de reportes en PDF

## Contacto

Para consultas sobre la versión Pro: **contacto@icc-e.org**

## Licencia

Proyecto privado - Todos los derechos reservados.
