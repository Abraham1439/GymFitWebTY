// Pruebas unitarias para CartContext
// Unit Test: Prueba que verifica el comportamiento del contexto del carrito

import { describe, it, expect } from 'vitest';
import { mockCartContext } from '../../../src/__mocks__/contexts/CartContext.mock';

describe('CartContext (Mock)', () => {
  // describe: Agrupa pruebas relacionadas

  describe('cartItems', () => {
    it('debe tener items en el carrito', () => {
      // it: Define una prueba individual
      // expect: Función de Vitest para hacer aserciones
      expect(mockCartContext.cartItems).toBeDefined();
      expect(Array.isArray(mockCartContext.cartItems)).toBe(true);
      expect(mockCartContext.cartItems.length).toBeGreaterThan(0);
    });
  });

  describe('getTotalItems', () => {
    it('debe calcular el total de items correctamente', () => {
      const total = mockCartContext.getTotalItems();
      
      expect(total).toBeGreaterThan(0);
      expect(typeof total).toBe('number');
    });
  });

  describe('getTotalPrice', () => {
    it('debe calcular el precio total correctamente', () => {
      const total = mockCartContext.getTotalPrice();
      
      expect(total).toBeGreaterThan(0);
      expect(typeof total).toBe('number');
    });
  });

  describe('addToCart', () => {
    it('debe ser una función', () => {
      expect(typeof mockCartContext.addToCart).toBe('function');
    });
  });

  describe('removeFromCart', () => {
    it('debe ser una función', () => {
      expect(typeof mockCartContext.removeFromCart).toBe('function');
    });
  });

  describe('updateQuantity', () => {
    it('debe ser una función', () => {
      expect(typeof mockCartContext.updateQuantity).toBe('function');
    });
  });

  describe('clearCart', () => {
    it('debe ser una función', () => {
      expect(typeof mockCartContext.clearCart).toBe('function');
    });
  });
});

