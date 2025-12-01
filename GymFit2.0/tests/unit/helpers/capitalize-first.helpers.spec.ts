// Pruebas unitarias para capitalize-first.helpers.ts

import { describe, it, expect } from 'vitest';
import { capitalizeFirst } from '../../../src/helpers/capitalize-first.helpers';

describe('capitalize-first.helpers', () => {
  describe('capitalizeFirst', () => {
    it('debe capitalizar la primera letra y poner el resto en minúsculas', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('WORLD')).toBe('World');
      expect(capitalizeFirst('tEsT')).toBe('Test');
    });

    it('debe retornar string vacío si el texto está vacío', () => {
      expect(capitalizeFirst('')).toBe('');
    });

    it('debe manejar strings con una sola letra', () => {
      expect(capitalizeFirst('a')).toBe('A');
      expect(capitalizeFirst('A')).toBe('A');
    });

    it('debe manejar strings con espacios', () => {
      expect(capitalizeFirst('hello world')).toBe('Hello world');
    });
  });
});

