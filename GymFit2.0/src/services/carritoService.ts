import { API_BASE_URLS, apiCall } from './api';

export interface ItemCarrito {
  id: number;
  usuarioId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface AddItemRequest {
  usuarioId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export const carritoService = {
  async getCarritoByUsuario(usuarioId: number): Promise<ItemCarrito[]> {
    try {
      return await apiCall<ItemCarrito[]>(`${API_BASE_URLS.carrito}/usuario/${usuarioId}`);
    } catch (error) {
      console.error('Error fetching carrito:', error);
      return [];
    }
  },

  async addItem(data: AddItemRequest): Promise<ItemCarrito | null> {
    try {
      return await apiCall<ItemCarrito>(`${API_BASE_URLS.carrito}/agregar`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error adding item to carrito:', error);
      return null;
    }
  },

  async updateQuantity(itemId: number, cantidad: number): Promise<ItemCarrito | null> {
    try {
      return await apiCall<ItemCarrito>(`${API_BASE_URLS.carrito}/item/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ cantidad }),
      });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      return null;
    }
  },

  async deleteItem(itemId: number): Promise<boolean> {
    try {
      await apiCall(`${API_BASE_URLS.carrito}/item/${itemId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  },

  async deleteItemByProducto(usuarioId: number, productoId: number): Promise<boolean> {
    try {
      await apiCall(`${API_BASE_URLS.carrito}/usuario/${usuarioId}/producto/${productoId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting item by producto:', error);
      return false;
    }
  },

  async vaciarCarrito(usuarioId: number): Promise<boolean> {
    try {
      await apiCall(`${API_BASE_URLS.carrito}/usuario/${usuarioId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error vaciando carrito:', error);
      return false;
    }
  },
};

