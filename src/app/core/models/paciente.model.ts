export interface Persona {
  id?: string;
  tipoDocumentoCodigo: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento: string;
  sexoCodigo: string;
  celular?: string;
  email?: string;
  direccion?: string;
}

export interface PacienteResponse {
  id: string;
  personaId: string;
  tipoDocumentoCodigo: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexoCodigo: string;
  celular: string;
  email: string;
  direccion: string;
  codigoHistoria: string;
  historiaClinicaId: string | null;
  lugarNacimiento: string;
  procedencia: string;
  viajesUltimoAnio: string;
  gradoInstruccionCodigo: string;
  ocupacion: string;
  estadoCivilCodigo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePacienteRequest {
  tipoDocumentoCodigo: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento: string;
  sexoCodigo: string;
  celular?: string;
  email?: string;
  direccion?: string;
  lugarNacimiento?: string;
  procedencia?: string;
  viajesUltimoAnio?: string;
  gradoInstruccionCodigo: string;
  ocupacion?: string;
  estadoCivilCodigo: string;
}

export interface UpdatePacienteRequest {
  tipoDocumentoCodigo: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento: string;
  sexoCodigo: string;
  celular?: string;
  email?: string;
  direccion?: string;
  lugarNacimiento?: string;
  procedencia?: string;
  viajesUltimoAnio?: string;
  gradoInstruccionCodigo: string;
  ocupacion?: string;
  estadoCivilCodigo: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Catalogo {
  id: number;
  codigo: string;
  descripcion: string;
}