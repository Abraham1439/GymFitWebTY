import { API_BASE_URLS, apiCall } from './api';

export interface Usuario {
  id: number;
  username: string;
  email: string;
  phone: string;
  rol: {
    id: number;
    nombre: string;
  };
  photoUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
}

export const usuariosService = {
  async login(data: LoginRequest): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiCall<{ message?: string }>(
        `${API_BASE_URLS.usuarios}/login`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return { success: true, message: response.message || 'Login exitoso' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Error al iniciar sesión' };
    }
  },

  async register(data: RegisterRequest): Promise<{ success: boolean; usuario?: Usuario; message?: string }> {
    try {
      const usuario = await apiCall<Usuario>(
        `${API_BASE_URLS.usuarios}/register`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return { success: true, usuario };
    } catch (error: any) {
      return { success: false, message: error.message || 'Error al registrar usuario' };
    }
  },

  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    try {
      return await apiCall<Usuario>(`${API_BASE_URLS.usuarios}/users/email/${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Error fetching usuario:', error);
      return null;
    }
  },

  async getUsuarioById(id: number): Promise<Usuario | null> {
    try {
      return await apiCall<Usuario>(`${API_BASE_URLS.usuarios}/users/${id}`);
    } catch (error) {
      console.error('Error fetching usuario:', error);
      return null;
    }
  },

  async getAllUsuarios(): Promise<Usuario[]> {
    try {
      return await apiCall<Usuario[]>(`${API_BASE_URLS.usuarios}/users`);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      return [];
    }
  },
};

