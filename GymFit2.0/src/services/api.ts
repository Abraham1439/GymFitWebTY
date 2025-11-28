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
    console.log(`[API] ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body as string) : '');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Read response text ONCE
    const responseText = await response.text();
    console.log(`[API] Response ${response.status}:`, responseText);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${responseText}`);
    }

    // Handle empty responses
    if (!responseText || responseText.trim() === '') {
      return {} as T;
    }

    // Parse JSON - maneja tanto JSON como strings simples
    try {
      // Si la respuesta parece ser un string simple (no JSON), intenta parsearlo
      if (responseText.trim().startsWith('"') && responseText.trim().endsWith('"')) {
        // Es un string JSON, parsearlo
        return JSON.parse(responseText) as T;
      } else if (!responseText.trim().startsWith('{') && !responseText.trim().startsWith('[')) {
        // Es un string plano, retornarlo como objeto con mensaje
        return { message: responseText } as T;
      }
      return JSON.parse(responseText) as T;
    } catch (parseError) {
      // Si falla el parse, retornar el texto como mensaje
      console.warn('[API] JSON parse error, returning as message:', parseError);
      return { message: responseText } as T;
    }
  } catch (error) {
    console.error('[API] Call failed:', error);
    throw error;
  }
}

export { API_BASE_URLS, apiCall };

