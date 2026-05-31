export type EstadoCita =
  | 'PROGRAMADA'
  | 'CONFIRMADA'
  | 'EN_CURSO'
  | 'ATENDIDA'
  | 'CANCELADA'
  | 'NO_ASISTIO';

export interface CitaResponse {
  id: string;
  pacienteId: string;
  odontologoId: string;
  historiaClinicaId: string;
  pacienteNombres: string;
  pacienteApellidoPaterno: string;
  pacienteApellidoMaterno: string;
  pacienteNumeroDocumento: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: EstadoCita;
  motivo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCitaRequest {
  pacienteId: string;
  odontologoId: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  motivo?: string;
}

export interface UpdateCitaRequest {
  pacienteId: string;
  odontologoId: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  motivo?: string;
}

export interface CambiarEstadoRequest {
  estado: EstadoCita;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}