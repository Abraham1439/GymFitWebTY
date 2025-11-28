import { API_BASE_URLS, apiCall } from './api';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
  stock: number;
}

export const productosService = {
  async getAll(): Promise<Producto[]> {
    try {
      return await apiCall<Producto[]>(API_BASE_URLS.productos);
    } catch (error) {
      console.error('Error fetching productos:', error);
      return [];
    }
  },

  async getById(id: number): Promise<Producto | null> {
    try {
      return await apiCall<Producto>(`${API_BASE_URLS.productos}/${id}`);
    } catch (error) {
      console.error('Error fetching producto:', error);
      return null;
    }
  },

  async getByCategoria(categoria: string): Promise<Producto[]> {
    try {
      return await apiCall<Producto[]>(`${API_BASE_URLS.productos}/categoria/${categoria}`);
    } catch (error) {
      console.error('Error fetching productos by categoria:', error);
      return [];
    }
  },

  async search(nombre: string): Promise<Producto[]> {
    try {
      return await apiCall<Producto[]>(`${API_BASE_URLS.productos}/buscar?nombre=${encodeURIComponent(nombre)}`);
    } catch (error) {
      console.error('Error searching productos:', error);
      return [];
    }
  },

  async create(producto: Partial<Producto>): Promise<Producto | null> {
    try {
      return await apiCall<Producto>(API_BASE_URLS.productos, {
        method: 'POST',
        body: JSON.stringify(producto),
      });
    } catch (error) {
      console.error('Error creating producto:', error);
      return null;
    }
  },

  async update(id: number, producto: Partial<Producto>): Promise<Producto | null> {
    try {
      return await apiCall<Producto>(`${API_BASE_URLS.productos}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(producto),
      });
    } catch (error) {
      console.error('Error updating producto:', error);
      return null;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      await apiCall(`${API_BASE_URLS.productos}/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting producto:', error);
      return false;
    }
  },
};

