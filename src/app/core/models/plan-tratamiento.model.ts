export type EstadoPlan = 'PROPUESTO' | 'ACEPTADO' | 'RECHAZADO' | 'EN_EJECUCION' | 'COMPLETADO' | 'PARCIAL';
export type EstadoDetalle = 'PENDIENTE' | 'EJECUTADO' | 'OMITIDO' | 'REPROGRAMADO';

export interface PlanTratamientoResponse {
  id: string;
  atencionId: string;
  historiaClinicaId: string;
  estado: EstadoPlan;
  montoTotal: number;
  observaciones: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanTratamientoRequest {
  atencionId: string;
  historiaClinicaId: string;
  observaciones?: string;
}

export interface UpdatePlanTratamientoRequest {
  observaciones?: string;
}

export interface CambiarEstadoPlanRequest {
  estado: EstadoPlan;
  aceptadoPor?: string;
  notas?: string;
}

export interface PlanTratamientoDetalleResponse {
  id: string;
  planTratamientoId: string;
  procedimientoCodigo: string;
  piezaId: number;
  caraCodigo: string;
  cantidad: number;
  precioUnitario: number;
  estado: EstadoDetalle;
  orden: number;
  notas: string;
}

export interface CreateDetalleRequest {
  procedimientoCodigo: string;
  piezaId: any;
  caraCodigo: string;
  cantidad: any;
  precioUnitario: number;
  orden: number;
  notas?: string;
}

export interface UpdateDetalleRequest {
  procedimientoCodigo?: string;
  piezaId?: any;
  caraCodigo?: string;
  cantidad?: any;
  precioUnitario?: number;
  estado?: EstadoDetalle;
  orden?: number;
  notas?: string;
}

export interface PlanTratamientoEventoResponse {
  id: string;
  planTratamientoId: string;
  estadoNuevo: EstadoPlan;
  actorPersonaId: string;
  actorPersonaNombre: string;
  aceptadoPor: string;
  notas: string;
  createdAt: string;
}

export interface TratamientoEjecutadoResponse {
  id: string;
  planDetalleId: string;
  atencionId: string;
  odontologoId: string;
  odontologoNombre: string;
  fechaEjecucion: string;
  observaciones: string;
  createdAt: string;
}

export interface CreateTratamientoEjecutadoRequest {
  planDetalleId: string;
  atencionId: string;
  fechaEjecucion: string;
  observaciones?: string;
}

export interface ProcedimientoInfo {
  id: string;
  codigo: string;
  descripcion: string;
}

export interface PiezaDentalInfo {
  id: number;
  nombre: string;
}

export const ESTADO_PLAN_COLORS: Record<EstadoPlan, string> = {
  'PROPUESTO': '#f59e0b',
  'ACEPTADO': '#22c55e',
  'RECHAZADO': '#ef4444',
  'EN_EJECUCION': '#3b82f6',
  'COMPLETADO': '#15803d',
  'PARCIAL': '#f97316'
};

export const ESTADO_PLAN_LABELS: Record<EstadoPlan, string> = {
  'PROPUESTO': 'Propuesto',
  'ACEPTADO': 'Aceptado',
  'RECHAZADO': 'Rechazado',
  'EN_EJECUCION': 'En Ejecución',
  'COMPLETADO': 'Completado',
  'PARCIAL': 'Parcial'
};

export const ESTADO_DETALLE_COLORS: Record<EstadoDetalle, string> = {
  'PENDIENTE': '#6b7280',
  'EJECUTADO': '#22c55e',
  'OMITIDO': '#f97316',
  'REPROGRAMADO': '#8b5cf6'
};

export const ESTADO_DETALLE_LABELS: Record<EstadoDetalle, string> = {
  'PENDIENTE': 'Pendiente',
  'EJECUTADO': 'Ejecutado',
  'OMITIDO': 'Omitido',
  'REPROGRAMADO': 'Reprogramado'
};
