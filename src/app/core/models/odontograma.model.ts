export type EstadoHallazgo = 'EXISTENTE' | 'REQUERIDO' | 'REALIZADO';

export interface OdontogramaResponse {
  id: string;
  historiaClinicaId: string;
  atencionId: string;
  fecha: string;
  isInicial: boolean;
  observaciones: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOdontogramaRequest {
  historiaClinicaId: string;
  atencionId: string;
  isInicial?: boolean;
  observaciones?: string;
}

export interface UpdateOdontogramaRequest {
  observaciones?: string;
}

export interface HallazgoResponse {
  id: string;
  odontogramaId: string;
  piezaId: number;
  caraCodigo: string;
  condicionCodigo: string;
  estado: EstadoHallazgo;
  notas: string;
  isRegistradoVoz: boolean;
  transcripcionVoz: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHallazgoRequest {
  piezaId: number;
  caraCodigo: string;
  condicionCodigo: string;
  estado?: EstadoHallazgo;
  notas?: string;
}

export interface CreateHallazgoVozRequest {
  transcripcionVoz: string;
  hallazgos: CreateHallazgoRequest[];
}

export interface UpdateHallazgoRequest {
  estado?: EstadoHallazgo;
  notas?: string;
}

export interface PiezaDental {
  id: number;
  cuadrante: number;
  posicion: number;
  nombre: string;
  isDeciduo: boolean;
}

export interface CaraDental {
  codigo: string;
  descripcion: string;
  abreviatura: string;
}

export interface CondicionDental {
  codigo: string;
  descripcion: string;
  colorHex: string;
}

export interface CatalogoOdontograma {
  piezas: PiezaDental[];
  caras: CaraDental[];
  condiciones: CondicionDental[];
}

export interface HallazgoParaPieza {
  piezaId: number;
  caraCodigo: string;
  hallazgos: HallazgoResponse[];
}

export interface GridCell {
  pieza: PiezaDental;
  hallazgos: Map<string, HallazgoResponse[]>;
}
