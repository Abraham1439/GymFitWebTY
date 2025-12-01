// Mock para el servicio de API
// Mock: Objeto simulado que imita el comportamiento de un objeto real para pruebas

export const mockApiCall = async <T>(url: string, options?: RequestInit): Promise<T> => {
  // Simula una llamada API exitosa
  return Promise.resolve({} as T);
};

export const mockApiCallError = async (): Promise<never> => {
  // Simula un error en la llamada API
  return Promise.reject(new Error('API Error'));
};

