// Pruebas unitarias para validation.helpers.ts
// Unit Test: Prueba que verifica el comportamiento de una unidad de código (función, método, etc.)

import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  isNotEmpty,
  isValidName,
  isPositiveNumber,
  passwordsMatch,
  isValidPhone,
  formatDate
} from '../../../src/helpers/validation.helpers';

describe('validation.helpers', () => {
  // describe: Agrupa pruebas relacionadas
  // 'validation.helpers': Nombre del grupo de pruebas

  describe('isValidEmail', () => {
    // it: Define una prueba individual
    it('debe retornar true para emails válidos', () => {
      // expect: Función de Vitest para hacer aserciones
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('debe retornar false para emails inválidos', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('debe retornar true para contraseñas con 6 o más caracteres', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('abcdef')).toBe(true);
    });

    it('debe retornar false para contraseñas con menos de 6 caracteres', () => {
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('abc')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('debe retornar true para strings no vacíos', () => {
      expect(isNotEmpty('text')).toBe(true);
      expect(isNotEmpty('  text  ')).toBe(true);
      expect(isNotEmpty('123')).toBe(true);
    });

    it('debe retornar false para strings vacíos o solo espacios', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
      expect(isNotEmpty('\t\n')).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('debe retornar true para nombres válidos con solo letras y espacios', () => {
      expect(isValidName('Juan Pérez')).toBe(true);
      expect(isValidName('María José')).toBe(true);
      expect(isValidName('José María')).toBe(true);
      expect(isValidName('Ana')).toBe(true);
      expect(isValidName('José María González')).toBe(true);
    });

    it('debe retornar false para nombres con números o caracteres especiales', () => {
      expect(isValidName('Juan123')).toBe(false);
      expect(isValidName('Juan@Pérez')).toBe(false);
      expect(isValidName('Juan-Pérez')).toBe(false);
      expect(isValidName('Juan_Pérez')).toBe(false);
      expect(isValidName('')).toBe(false);
      expect(isValidName('   ')).toBe(false);
    });
  });

  describe('isPositiveNumber', () => {
    it('debe retornar true para números positivos', () => {
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(100)).toBe(true);
      expect(isPositiveNumber(0.5)).toBe(true);
    });

    it('debe retornar false para números negativos o cero', () => {
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-1)).toBe(false);
      expect(isPositiveNumber(-100)).toBe(false);
    });

    it('debe retornar false para NaN', () => {
      expect(isPositiveNumber(NaN)).toBe(false);
    });
  });

  describe('passwordsMatch', () => {
    it('debe retornar true cuando las contraseñas coinciden', () => {
      expect(passwordsMatch('password123', 'password123')).toBe(true);
      expect(passwordsMatch('abc', 'abc')).toBe(true);
    });

    it('debe retornar false cuando las contraseñas no coinciden', () => {
      expect(passwordsMatch('password123', 'password456')).toBe(false);
      expect(passwordsMatch('abc', 'def')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('debe retornar true para teléfonos con formato válido (+11 dígitos)', () => {
      expect(isValidPhone('+56912345678')).toBe(true);
      expect(isValidPhone('+56987654321')).toBe(true);
    });

    it('debe retornar false para teléfonos con formato inválido', () => {
      expect(isValidPhone('56912345678')).toBe(false); // Sin +
      expect(isValidPhone('+5691234567')).toBe(false); // Menos de 11 dígitos
      expect(isValidPhone('+569123456789')).toBe(false); // Más de 11 dígitos
      expect(isValidPhone('+56-912345678')).toBe(false); // Con guión
      expect(isValidPhone('')).toBe(false); // Vacío
      expect(isValidPhone('   ')).toBe(false); // Solo espacios
    });
  });

  describe('formatDate', () => {
    it('debe formatear una fecha correctamente', () => {
      // Usar una fecha en formato ISO que no tenga problemas de zona horaria
      const dateString = '2024-01-15T12:00:00.000Z';
      const formatted = formatDate(dateString);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('enero');
      // La fecha puede variar según la zona horaria, así que verificamos que tenga el formato correcto
      expect(formatted).toMatch(/\d{1,2}/); // Debe contener al menos un número (día)
    });
  });
});

