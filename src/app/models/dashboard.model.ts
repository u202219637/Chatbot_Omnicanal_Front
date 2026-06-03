export interface KpiDTO {
  totalConversaciones: number;
  conversacionesResueltas: number;
  tiempoPromedioRespuesta: string;
  tasaResolucionAutomatica: number;
  satisfaccionPromedio: number;
  tasaDesvioHumano: number;
  conversacionesWeb: number;
  conversacionesWhatsapp: number;
}

export interface TokenConsumo {
  dia: string;
  tokensEntrada: number;
  tokensSalida: number;
  tokensTotal: number;
}

export interface IntencionFrecuente {
  intencion: string;
  frecuencia: number;
  porcentaje: number;
}
