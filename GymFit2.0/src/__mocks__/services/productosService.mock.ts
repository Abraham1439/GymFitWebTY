// Mock para el servicio de productos
import type { Product } from '../../interfaces/gym.interfaces';

const mockProductos: Product[] = [
  {
    id: '1',
    name: 'Proteína Whey',
    description: 'Proteína de suero de leche',
    price: 50000,
    stock: 15,
    category: 'supplement',
    image: 'https://example.com/whey.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Multivitamínico',
    description: 'Multivitamínico diario',
    price: 20000,
    stock: 23,
    category: 'supplement',
    image: 'https://example.com/vitamin.jpg',
    createdAt: new Date().toISOString()
  }
];

export const mockProductosService = {
  getAll: async (): Promise<Product[]> => {
    return Promise.resolve(mockProductos);
  },

  getById: async (id: number): Promise<Product | null> => {
    const producto = mockProductos.find(p => p.id === id.toString());
    return Promise.resolve(producto || null);
  },

  create: async (producto: Partial<Product>): Promise<Product | null> => {
    const newProducto: Product = {
      id: '3',
      name: producto.name || 'New Product',
      description: producto.description || '',
      price: producto.price || 0,
      stock: producto.stock || 0,
      category: producto.category || 'supplement',
      image: producto.image || '',
      createdAt: new Date().toISOString()
    };
    return Promise.resolve(newProducto);
  },

  update: async (id: number, producto: Partial<Product>): Promise<Product | null> => {
    const existing = mockProductos.find(p => p.id === id.toString());
    if (existing) {
      return Promise.resolve({ ...existing, ...producto } as Product);
    }
    return Promise.resolve(null);
  },

  delete: async (id: number): Promise<boolean> => {
    return Promise.resolve(true);
  },

  updateStock: async (id: number, cantidad: number): Promise<Product | null> => {
    const existing = mockProductos.find(p => p.id === id.toString());
    if (existing) {
      const updated = { ...existing, stock: existing.stock + cantidad };
      return Promise.resolve(updated);
    }
    return Promise.resolve(null);
  }
};

