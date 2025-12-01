// Mock para el servicio de usuarios
import { User } from '../../interfaces/gym.interfaces';

export const mockUsuariosService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User } | null> => {
    if (email === 'test@test.com' && password === 'password123') {
      return {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@test.com',
          role: 'USER' as const,
          phone: '+56912345678',
          address: 'Test Address'
        }
      };
    }
    return null;
  },

  register: async (userData: any): Promise<User | null> => {
    return {
      id: '2',
      name: userData.name,
      email: userData.email,
      role: userData.role || 'USER' as const,
      phone: userData.phone,
      address: userData.address
    };
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    if (email === 'existing@test.com') {
      return {
        id: '1',
        name: 'Existing User',
        email: 'existing@test.com',
        role: 'USER' as const,
        phone: '+56912345678',
        address: 'Existing Address'
      };
    }
    return null;
  }
};

