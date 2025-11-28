export interface Mencion {
  medio: string;
  tipo: string;
  fecha: string;
  extracto?: string;
  texto?: string;
}

export interface AnalysisDetail {
  color: string;
}

export interface AnalysisResult {
  sin_cobertura?: boolean;
  mensaje?: string;
  resultado_global: string;
  resumen_ejecutivo?: string;
  impacto?: string;
  nombre_publicacion?: string;
  id?: string;
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
  analisis: {
    cobertura?: AnalysisDetail;
    emisiones?: AnalysisDetail;
    duracion?: AnalysisDetail;
  };
  menciones?: {
    total?: number;
    detalle: Mencion[];
  };
  recomendaciones?: string[];
}
