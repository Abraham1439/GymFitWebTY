// Pruebas unitarias para local-storage.helpers.ts

import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  clearLocalStorage
} from '@/helpers/local-storage.helpers';

describe('local-storage.helpers', () => {
  // Limpiar localStorage antes de cada prueba
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveToLocalStorage', () => {
    it('debe guardar un valor en localStorage', () => {
      const key = 'test-key';
      const value = { name: 'Test', id: 1 };
      
      saveToLocalStorage(key, value);
      
      const stored = localStorage.getItem(key);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(value);
    });

    it('debe guardar diferentes tipos de valores', () => {
      saveToLocalStorage('string', 'test');
      saveToLocalStorage('number', 123);
      saveToLocalStorage('boolean', true);
      saveToLocalStorage('array', [1, 2, 3]);
      
      expect(localStorage.getItem('string')).toBe('"test"');
      expect(localStorage.getItem('number')).toBe('123');
      expect(localStorage.getItem('boolean')).toBe('true');
      expect(localStorage.getItem('array')).toBe('[1,2,3]');
    });
  });

  describe('getFromLocalStorage', () => {
    it('debe recuperar un valor de localStorage', () => {
      const key = 'test-key';
      const value = { name: 'Test', id: 1 };
      
      localStorage.setItem(key, JSON.stringify(value));
      const retrieved = getFromLocalStorage<typeof value>(key);
      
      expect(retrieved).toEqual(value);
    });

    it('debe retornar null si la clave no existe', () => {
      const retrieved = getFromLocalStorage('non-existent-key');
      expect(retrieved).toBeNull();
    });

    it('debe retornar null si el valor no es JSON válido', () => {
      // Silenciar console.error para esta prueba ya que es el comportamiento esperado
      const originalError = console.error;
      console.error = () => {}; // Función vacía para silenciar el error
      
      localStorage.setItem('invalid-json', 'not valid json{');
      const retrieved = getFromLocalStorage('invalid-json');
      expect(retrieved).toBeNull();
      
      // Restaurar console.error
      console.error = originalError;
    });
  });

  describe('removeFromLocalStorage', () => {
    it('debe eliminar un valor de localStorage', () => {
      const key = 'test-key';
      localStorage.setItem(key, 'test-value');
      
      removeFromLocalStorage(key);
      
      expect(localStorage.getItem(key)).toBeNull();
    });

    it('no debe lanzar error si la clave no existe', () => {
      expect(() => removeFromLocalStorage('non-existent-key')).not.toThrow();
    });
  });

  describe('clearLocalStorage', () => {
    it('debe limpiar todo el contenido de localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      
      clearLocalStorage();
      
      expect(localStorage.length).toBe(0);
    });
  });
});

