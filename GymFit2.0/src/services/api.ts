// API base URLs for microservices
const API_BASE_URLS = {
  usuarios: 'http://localhost:8081/api/v1/usuario',
  carrito: 'http://localhost:8082/api/v1/carrito',
  productos: 'http://localhost:8083/api/v1/productos',
  pagos: 'http://localhost:8084/api/v1/pagos',
  ordenes: 'http://localhost:8085/api/v1/ordenes',
};

// Helper function to make API calls
async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);
    }

    return {} as T;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export { API_BASE_URLS, apiCall };

