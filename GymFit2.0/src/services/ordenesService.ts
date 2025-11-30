import { API_BASE_URLS, apiCall } from './api';

export interface ItemOrden {
  id: number;
  orden: Orden;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Orden {
  id: number;
  usuarioId: number;
  total: number;
  estado: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  direccionEnvio?: string;
  notas?: string;
}

export interface CreateOrdenRequest {
  usuarioId: number;
  total: number;
  direccionEnvio?: string;
  notas?: string;
  items: Array<{
    productoId: number;
    cantidad: number;
    precioUnitario: number;
  }>;
}

export const ordenesService = {
  async getAll(): Promise<Orden[]> {
    try {
      return await apiCall<Orden[]>(`${API_BASE_URLS.ordenes}/api/v1/ordenes`);
    } catch (error) {
      console.error('Error fetching ordenes:', error);
      return [];
    }
  },

  async getById(id: number): Promise<Orden | null> {
    try {
      return await apiCall<Orden>(`${API_BASE_URLS.ordenes}/api/v1/ordenes/${id}`);
    } catch (error) {
      console.error('Error fetching orden:', error);
      return null;
    }
  },

  async getByUsuario(usuarioId: number): Promise<Orden[]> {
    try {
      return await apiCall<Orden[]>(`${API_BASE_URLS.ordenes}/api/v1/ordenes/usuario/${usuarioId}`);
    } catch (error) {
      console.error('Error fetching ordenes by usuario:', error);
      return [];
    }
  },

  async getByEstado(estado: string): Promise<Orden[]> {
    try {
      return await apiCall<Orden[]>(`${API_BASE_URLS.ordenes}/api/v1/ordenes/estado/${estado}`);
    } catch (error) {
      console.error('Error fetching ordenes by estado:', error);
      return [];
    }
  },

  async getItemsByOrden(ordenId: number): Promise<ItemOrden[]> {
    try {
      return await apiCall<ItemOrden[]>(`${API_BASE_URLS.ordenes}/api/v1/ordenes/${ordenId}/items`);
    } catch (error) {
      console.error('Error fetching items by orden:', error);
      return [];
    }
  },

  async create(data: CreateOrdenRequest): Promise<Orden | null> {
    try {
      return await apiCall<Orden>(`${API_BASE_URLS.ordenes}/api/v1/ordenes`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error creating orden:', error);
      return null;
    }
  },

  async updateEstado(id: number, estado: string): Promise<Orden | null> {
    try {
      return await apiCall<Orden>(`${API_BASE_URLS.ordenes}/api/v1/ordenes/${id}/estado`, {
        method: 'PUT',
        body: JSON.stringify({ estado }),
      });
    } catch (error) {
      console.error('Error updating orden estado:', error);
      return null;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      await apiCall(`${API_BASE_URLS.ordenes}/api/v1/ordenes/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting orden:', error);
      return false;
    }
  },
};

