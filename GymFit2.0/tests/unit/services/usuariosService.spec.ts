// Pruebas unitarias para usuariosService
// Unit Test: Prueba que verifica el comportamiento del servicio de usuarios

import { describe, it, expect } from 'vitest';
import { mockUsuariosService } from '../../../src/__mocks__/services/usuariosService.mock';

describe('usuariosService (Mock)', () => {
  // describe: Agrupa pruebas relacionadas

  describe('login', () => {
    it('debe hacer login exitoso con credenciales válidas', async () => {
      // it: Define una prueba individual
      const result = await mockUsuariosService.login('test@test.com', 'password123');
      
      // expect: Función de Vitest para hacer aserciones
      expect(result).not.toBeNull();
      expect(result?.token).toBe('mock-jwt-token');
      expect(result?.user.email).toBe('test@test.com');
    });

    it('debe retornar null con credenciales inválidas', async () => {
      const result = await mockUsuariosService.login('wrong@test.com', 'wrongpassword');
      
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@test.com',
        password: 'password123',
        phone: '+56912345678',
        address: 'New Address',
        role: 'USER' as const
      };

      const user = await mockUsuariosService.register(userData);
      
      expect(user).not.toBeNull();
      expect(user?.name).toBe(userData.name);
      expect(user?.email).toBe(userData.email);
    });
  });

  describe('getUserByEmail', () => {
    it('debe retornar un usuario cuando existe', async () => {
      const user = await mockUsuariosService.getUserByEmail('existing@test.com');
      
      expect(user).not.toBeNull();
      expect(user?.email).toBe('existing@test.com');
    });

    it('debe retornar null cuando el usuario no existe', async () => {
      const user = await mockUsuariosService.getUserByEmail('nonexistent@test.com');
      
      expect(user).toBeNull();
    });
  });
});

