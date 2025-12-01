// Mock para AuthContext
import type { User } from '../../interfaces/gym.interfaces';
import { UserRole } from '../../interfaces/gym.interfaces';

export const mockAuthContext = {
  login: async (email: string, password: string): Promise<boolean> => {
    return email === 'test@test.com' && password === 'password123';
  },

  register: async (userData: any): Promise<boolean> => {
    return true;
  },

  logout: (): void => {
    // Mock logout
  },

  authData: {
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123', // Campo requerido por la interfaz User
      role: UserRole.USER,
      createdAt: new Date().toISOString(), // Campo requerido por la interfaz User
      phone: '+56912345678',
      address: 'Test Address'
    } as User
  }
};

