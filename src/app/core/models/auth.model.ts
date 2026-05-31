export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuarioId: string;
  personaId: string;
  email: string;
  nombres: string;
  apellidoPaterno: string;
}

export interface UsuarioPrincipal {
  usuarioId: string;
  personaId: string;
  email: string;
  nombres: string;
  apellidoPaterno: string;
}