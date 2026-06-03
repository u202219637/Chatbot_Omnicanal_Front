export interface MensajeRequest {
  contenido: string;
  origen: string; // 'WEB'
}

export interface FuenteRespuesta {
  tipoFuente: string;
  tituloDocumento: string;
  extractoContenido: string;
  scoreRelevancia: number;
}

export interface MensajeResponse {
  id: number;
  conversacionId: number;
  tipoEmisor: string; // 'BOT' | 'CLIENTE'
  contenido: string;
  fuentes: FuenteRespuesta[];
  escalada: boolean;
  fechaEnvio: string;
}

export interface ConversacionList {
  id: number;
  asunto: string;
  estado: string;
  origen: string;
  fechaInicio: string;
  cantidadMensajes: number;
  satisfaccion: number;
}

export interface FeedbackDTO {
  calificacion: number;
  motivo: string;
  comentario: string;
}
