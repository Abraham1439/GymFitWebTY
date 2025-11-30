import { API_BASE_URLS, apiCall } from './api';

export interface Pago {
  id: number;
  ordenId: number;
  usuarioId: number;
  monto: number;
  metodoPago: string;
  estado: string;
  fechaPago: string;
  informacionAdicional?: string;
}

export interface CreatePagoRequest {
  ordenId: number;
  usuarioId: number;
  monto: number;
  metodoPago: string;
  informacionAdicional?: string;
}

export const pagosService = {
  async getAll(): Promise<Pago[]> {
    try {
      return await apiCall<Pago[]>(`${API_BASE_URLS.pagos}/api/v1/pagos`);
    } catch (error) {
      console.error('Error fetching pagos:', error);
      return [];
    }
  },

  async getById(id: number): Promise<Pago | null> {
    try {
      return await apiCall<Pago>(`${API_BASE_URLS.pagos}/api/v1/pagos/${id}`);
    } catch (error) {
      console.error('Error fetching pago:', error);
      return null;
    }
  },

  async getByUsuario(usuarioId: number): Promise<Pago[]> {
    try {
      return await apiCall<Pago[]>(`${API_BASE_URLS.pagos}/api/v1/pagos/usuario/${usuarioId}`);
    } catch (error) {
      console.error('Error fetching pagos by usuario:', error);
      return [];
    }
  },

  async getByOrden(ordenId: number): Promise<Pago[]> {
    try {
      return await apiCall<Pago[]>(`${API_BASE_URLS.pagos}/api/v1/pagos/orden/${ordenId}`);
    } catch (error) {
      console.error('Error fetching pagos by orden:', error);
      return [];
    }
  },

  async getByEstado(estado: string): Promise<Pago[]> {
    try {
      return await apiCall<Pago[]>(`${API_BASE_URLS.pagos}/api/v1/pagos/estado/${estado}`);
    } catch (error) {
      console.error('Error fetching pagos by estado:', error);
      return [];
    }
  },

  async create(data: CreatePagoRequest): Promise<Pago | null> {
    try {
      return await apiCall<Pago>(`${API_BASE_URLS.pagos}/api/v1/pagos`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error creating pago:', error);
      return null;
    }
  },

  async updateEstado(id: number, estado: string): Promise<Pago | null> {
    try {
      return await apiCall<Pago>(`${API_BASE_URLS.pagos}/api/v1/pagos/${id}/estado`, {
        method: 'PUT',
        body: JSON.stringify({ estado }),
      });
    } catch (error) {
      console.error('Error updating pago estado:', error);
      return null;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      await apiCall(`${API_BASE_URLS.pagos}/api/v1/pagos/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting pago:', error);
      return false;
    }
  },
};

