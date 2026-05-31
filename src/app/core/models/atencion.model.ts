export interface AtencionResponse {
  id: string;
  citaId: string;
  historiaClinicaId: string;
  odontologoId: string;
  fechaInicio: string;
  fechaFin: string | null;
  notas: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAtencionRequest {
  citaId: string;
  historiaClinicaId: string;
  odontologoId: string;
  notas?: string;
}

export interface UpdateAtencionRequest {
  notas?: string;
}
