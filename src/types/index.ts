export interface Mencion {
  tipo: string;
  extracto?: string;
  texto?: string;
  fecha?: string;
  medio?: string;
}

export interface AnalysisDetail {
  color: string;
}

export interface AnalysisResult {
  sin_cobertura?: boolean;
  mensaje?: string;
  resultado_global: string;
  resumen_ejecutivo?: string;
  ai_model?: string;
  ai_provider?: string;
  error?: string;
  cobertura_medios: number;
  cobertura_radio: number;
  cobertura_tv: number;
  cobertura_emisiones: number;
  duracion_dias: number;
  alcance_estimado: string | number;
  rango_fechas?: string;
  analisis: Record<string, AnalysisDetail>;
  menciones?: {
    detalle: Mencion[];
  };
  recomendaciones?: string[];
}
