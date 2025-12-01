// Mock para el servicio de productos
import { Producto } from '../../interfaces/gym.interfaces';

const mockProductos: Producto[] = [
  {
    id: '1',
    name: 'Proteína Whey',
    description: 'Proteína de suero de leche',
    price: 50000,
    stock: 15,
    category: 'supplement',
    image: 'https://example.com/whey.jpg'
  },
  {
    id: '2',
    name: 'Multivitamínico',
    description: 'Multivitamínico diario',
    price: 20000,
    stock: 23,
    category: 'supplement',
    image: 'https://example.com/vitamin.jpg'
  }
];

export const mockProductosService = {
  getAll: async (): Promise<Producto[]> => {
    return Promise.resolve(mockProductos);
  },

  getById: async (id: number): Promise<Producto | null> => {
    const producto = mockProductos.find(p => p.id === id.toString());
    return Promise.resolve(producto || null);
  },

  create: async (producto: Partial<Producto>): Promise<Producto | null> => {
    const newProducto: Producto = {
      id: '3',
      name: producto.name || 'New Product',
      description: producto.description || '',
      price: producto.price || 0,
      stock: producto.stock || 0,
      category: producto.category || 'supplement',
      image: producto.image || ''
    };
    return Promise.resolve(newProducto);
  },

  update: async (id: number, producto: Partial<Producto>): Promise<Producto | null> => {
    const existing = mockProductos.find(p => p.id === id.toString());
    if (existing) {
      return Promise.resolve({ ...existing, ...producto } as Producto);
    }
    return Promise.resolve(null);
  },

  delete: async (id: number): Promise<boolean> => {
    return Promise.resolve(true);
  },

  updateStock: async (id: number, cantidad: number): Promise<Producto | null> => {
    const existing = mockProductos.find(p => p.id === id.toString());
    if (existing) {
      const updated = { ...existing, stock: existing.stock + cantidad };
      return Promise.resolve(updated);
    }
    return Promise.resolve(null);
  }
};

