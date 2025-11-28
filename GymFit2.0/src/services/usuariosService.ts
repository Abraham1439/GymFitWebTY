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
  address?: string;
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
  address?: string;
}

export const usuariosService = {
  async login(data: LoginRequest): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('[usuariosService] Attempting login for:', data.email);
      
      const response = await fetch(`${API_BASE_URLS.usuarios}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log('[usuariosService] Login response status:', response.status);
      console.log('[usuariosService] Login response body:', responseText);

      if (response.ok) {
        // El endpoint retorna JSON con {message: "Login exitoso"} o texto plano
        try {
          const jsonResponse = JSON.parse(responseText);
          return { success: true, message: jsonResponse.message || jsonResponse.error || 'Login exitoso' };
        } catch {
          // Si no es JSON, es texto plano
          return { success: true, message: responseText || 'Login exitoso' };
        }
      } else {
        // Manejar errores
        try {
          const jsonResponse = JSON.parse(responseText);
          return { success: false, message: jsonResponse.error || jsonResponse.message || 'Error al iniciar sesión' };
        } catch {
          return { success: false, message: responseText || 'Error al iniciar sesión' };
        }
      }
    } catch (error: any) {
      console.error('[usuariosService] Login error:', error);
      return { success: false, message: error.message || 'Error al iniciar sesión' };
    }
  },

  async register(data: RegisterRequest): Promise<{ success: boolean; usuario?: Usuario; message?: string }> {
    try {
      console.log('[usuariosService] Registering:', data);
      const usuario = await apiCall<Usuario>(
        `${API_BASE_URLS.usuarios}/register`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      console.log('[usuariosService] Registration successful:', usuario);
      return { success: true, usuario };
    } catch (error: any) {
      console.error('[usuariosService] Registration error:', error);
      return { success: false, message: error.message || 'Error al registrar usuario' };
    }
  },

  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    try {
      console.log('[usuariosService] Fetching user by email:', email);
      const usuario = await apiCall<Usuario>(`${API_BASE_URLS.usuarios}/users/email/${encodeURIComponent(email)}`);
      console.log('[usuariosService] User found:', usuario);
      return usuario;
    } catch (error) {
      console.error('[usuariosService] Error fetching usuario:', error);
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

