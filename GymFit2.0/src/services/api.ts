// API base URLs Para los microservices
const API_BASE_URLS = {
  usuarios: 'https://pjrm5vf1-8081.brs.devtunnels.ms',
  carrito: 'https://pjrm5vf1-8082.brs.devtunnels.ms',
  productos: 'https://pjrm5vf1-8083.brs.devtunnels.ms',
  pagos: 'https://pjrm5vf1-8084.brs.devtunnels.ms',
  ordenes: 'https://pjrm5vf1-8085.brs.devtunnels.ms',
};

// Helper function to make API calls
async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    console.log(`[API] ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body as string) : '');
    
    // Obtener token JWT del localStorage si existe
    const token = localStorage.getItem('jwt_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    
    // Agregar token JWT al header si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
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

