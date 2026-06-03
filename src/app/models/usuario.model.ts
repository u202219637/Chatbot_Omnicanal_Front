export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  jwttoken: string;
  username: string;
  rol: string; // CLIENTE | ASESOR | ADMINISTRADOR
}

export interface UsuarioRegistro {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  username: string;
  password: string;
}

export interface UsuarioPerfil {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  username: string;
  roles: string[];
}
