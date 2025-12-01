// Pruebas unitarias para productosService
// Unit Test: Prueba que verifica el comportamiento del servicio de productos

import { describe, it, expect } from 'vitest';
import { mockProductosService } from '../../../src/__mocks__/services/productosService.mock';

describe('productosService (Mock)', () => {
  // describe: Agrupa pruebas relacionadas

  describe('getAll', () => {
    it('debe retornar una lista de productos', async () => {
      // it: Define una prueba individual
      const productos = await mockProductosService.getAll();
      
      // expect: Función de Vitest para hacer aserciones
      expect(productos).toBeDefined();
      expect(Array.isArray(productos)).toBe(true);
      expect(productos.length).toBeGreaterThan(0);
    });
  });

  describe('getById', () => {
    it('debe retornar un producto cuando existe', async () => {
      const producto = await mockProductosService.getById(1);
      
      expect(producto).toBeDefined();
      expect(producto?.id).toBe('1');
    });

    it('debe retornar null cuando el producto no existe', async () => {
      const producto = await mockProductosService.getById(999);
      
      expect(producto).toBeNull();
    });
  });

  describe('create', () => {
    it('debe crear un nuevo producto', async () => {
      const newProducto = {
        name: 'New Product',
        description: 'Test Description',
        price: 30000,
        stock: 10,
        category: 'supplement' as const,
        image: 'https://example.com/image.jpg'
      };

      const created = await mockProductosService.create(newProducto);
      
      expect(created).toBeDefined();
      expect(created?.name).toBe(newProducto.name);
    });
  });

  describe('update', () => {
    it('debe actualizar un producto existente', async () => {
      const updates = {
        name: 'Updated Product',
        price: 40000
      };

      const updated = await mockProductosService.update(1, updates);
      
      expect(updated).toBeDefined();
      expect(updated?.name).toBe(updates.name);
    });

    it('debe retornar null si el producto no existe', async () => {
      const updated = await mockProductosService.update(999, { name: 'Test' });
      
      expect(updated).toBeNull();
    });
  });

  describe('delete', () => {
    it('debe eliminar un producto', async () => {
      const result = await mockProductosService.delete(1);
      
      expect(result).toBe(true);
    });
  });

  describe('updateStock', () => {
    it('debe actualizar el stock de un producto', async () => {
      const updated = await mockProductosService.updateStock(1, 5);
      
      expect(updated).toBeDefined();
      expect(updated?.stock).toBeGreaterThan(0);
    });

    it('debe retornar null si el producto no existe', async () => {
      const updated = await mockProductosService.updateStock(999, 5);
      
      expect(updated).toBeNull();
    });
  });
});

