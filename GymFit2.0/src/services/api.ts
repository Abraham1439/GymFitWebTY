// Servicio API para comunicación con los microservicios
// Define las URLs base de cada microservicio
const API_BASE_URL = {
  usuarios: 'http://localhost:8081/api/v1/usuarios',
  productos: 'http://localhost:8082/api/v1/productos',
  ordenes: 'http://localhost:8083/api/v1/ordenes',
  pagos: 'http://localhost:8084/api/v1/pagos'
};

// Interfaz para respuesta de usuario del backend
interface UsuarioBackend {
  id_usuario: number;
  username: string;
  email: string;
  phone: string;
  rolId: number;
}

// Interfaz para producto del backend
interface ProductoBackend {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  categoriaId: number;
  activo: boolean;
}

// Interfaz para orden del backend
interface OrdenBackend {
  id_orden: number;
  usuarioId: number;
  total: number;
  estado: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Interfaz para pago del backend
interface PagoBackend {
  id_pago: number;
  ordenId: number;
  usuarioId: number;
  monto: number;
  metodoPago: string;
  estado: string;
  fechaPago: string;
  informacionAdicional?: string;
}

// Función helper para manejar errores de fetch
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Servicio de Usuarios
export const usuarioAPI = {
  /**
   * Inicia sesión con email y contraseña
   */
  login: async (email: string, password: string): Promise<UsuarioBackend> => {
    const response = await fetch(`${API_BASE_URL.usuarios}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error de autenticación' }));
      throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return handleResponse<UsuarioBackend>(response);
  },
  
  /**
   * Registra un nuevo usuario
   */
  register: async (usuario: {
    username: string;
    email: string;
    phone: string;
    password: string;
    rolId: number;
  }): Promise<UsuarioBackend> => {
    const response = await fetch(`${API_BASE_URL.usuarios}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    return handleResponse<UsuarioBackend>(response);
  },
  
  /**
   * Obtiene un usuario por ID
   */
  getUsuario: async (id: number): Promise<UsuarioBackend> => {
    const response = await fetch(`${API_BASE_URL.usuarios}/${id}`);
    return handleResponse<UsuarioBackend>(response);
  },
  
  /**
   * Lista todos los usuarios
   */
  getAll: async (): Promise<UsuarioBackend[]> => {
    const response = await fetch(`${API_BASE_URL.usuarios}/listar`);
    return handleResponse<UsuarioBackend[]>(response);
  }
};

// Servicio de Productos
export const productoAPI = {
  /**
   * Obtiene todos los productos
   */
  getAll: async (): Promise<ProductoBackend[]> => {
    try {
      const response = await fetch(`${API_BASE_URL.productos}/listar`);
      return handleResponse<ProductoBackend[]>(response);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      return [];
    }
  },
  
  /**
   * Obtiene solo productos activos
   */
  getActivos: async (): Promise<ProductoBackend[]> => {
    try {
      const response = await fetch(`${API_BASE_URL.productos}/activos`);
      return handleResponse<ProductoBackend[]>(response);
    } catch (error) {
      console.error('Error al cargar productos activos:', error);
      return [];
    }
  },
  
  /**
   * Obtiene un producto por ID
   */
  getById: async (id: number): Promise<ProductoBackend> => {
    const response = await fetch(`${API_BASE_URL.productos}/${id}`);
    return handleResponse<ProductoBackend>(response);
  },
  
  /**
   * Crea un nuevo producto
   */
  create: async (producto: {
    nombre: string;
    descripcion?: string;
    precio: number;
    imagen?: string;
    stock: number;
    categoriaId: number;
    activo?: boolean;
  }): Promise<ProductoBackend> => {
    const response = await fetch(`${API_BASE_URL.productos}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    return handleResponse<ProductoBackend>(response);
  },
  
  /**
   * Actualiza un producto
   */
  update: async (id: number, producto: Partial<ProductoBackend>): Promise<ProductoBackend> => {
    const response = await fetch(`${API_BASE_URL.productos}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    return handleResponse<ProductoBackend>(response);
  },
  
  /**
   * Elimina un producto
   */
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL.productos}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar producto: ${response.statusText}`);
    }
  }
};

// Servicio de Órdenes
export const ordenAPI = {
  /**
   * Crea una nueva orden
   */
  create: async (orden: {
    usuarioId: number;
    total: number;
    estado?: string;
  }): Promise<OrdenBackend> => {
    const response = await fetch(`${API_BASE_URL.ordenes}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orden)
    });
    return handleResponse<OrdenBackend>(response);
  },
  
  /**
   * Obtiene una orden por ID
   */
  getById: async (id: number): Promise<OrdenBackend> => {
    const response = await fetch(`${API_BASE_URL.ordenes}/${id}`);
    return handleResponse<OrdenBackend>(response);
  },
  
  /**
   * Lista todas las órdenes
   */
  getAll: async (): Promise<OrdenBackend[]> => {
    const response = await fetch(`${API_BASE_URL.ordenes}/listar`);
    return handleResponse<OrdenBackend[]>(response);
  },
  
  /**
   * Obtiene órdenes por usuario
   */
  getByUsuario: async (usuarioId: number): Promise<OrdenBackend[]> => {
    try {
      const response = await fetch(`${API_BASE_URL.ordenes}/usuario/${usuarioId}`);
      return handleResponse<OrdenBackend[]>(response);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      return [];
    }
  }
};

// Servicio de Pagos
export const pagoAPI = {
  /**
   * Crea un nuevo pago
   */
  create: async (pago: {
    ordenId: number;
    usuarioId: number;
    monto: number;
    metodoPago: string;
    estado?: string;
    informacionAdicional?: string;
  }): Promise<PagoBackend> => {
    const response = await fetch(`${API_BASE_URL.pagos}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pago)
    });
    return handleResponse<PagoBackend>(response);
  },
  
  /**
   * Obtiene un pago por ID
   */
  getById: async (id: number): Promise<PagoBackend> => {
    const response = await fetch(`${API_BASE_URL.pagos}/${id}`);
    return handleResponse<PagoBackend>(response);
  },
  
  /**
   * Lista todos los pagos
   */
  getAll: async (): Promise<PagoBackend[]> => {
    const response = await fetch(`${API_BASE_URL.pagos}/listar`);
    return handleResponse<PagoBackend[]>(response);
  },
  
  /**
   * Obtiene pagos por usuario
   */
  getByUsuario: async (usuarioId: number): Promise<PagoBackend[]> => {
    try {
      const response = await fetch(`${API_BASE_URL.pagos}/usuario/${usuarioId}`);
      return handleResponse<PagoBackend[]>(response);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      return [];
    }
  }
};

// Función helper para mapear UsuarioBackend a User (frontend)
export const mapUsuarioToUser = (usuario: UsuarioBackend): any => {
  return {
    id: usuario.id_usuario.toString(),
    email: usuario.email,
    name: usuario.username,
    role: usuario.rolId === 1 ? 'admin' : usuario.rolId === 2 ? 'user' : 'trainer',
    phone: usuario.phone
  };
};

// Función helper para mapear ProductoBackend a Product (frontend)
export const mapProductoToProduct = (producto: ProductoBackend): any => {
  return {
    id: producto.id_producto.toString(),
    name: producto.nombre,
    description: producto.descripcion || '',
    price: producto.precio,
    image: producto.imagen || '',
    stock: producto.stock,
    category: producto.categoriaId === 1 ? 'supplement' : 'accessory',
    createdAt: new Date().toISOString()
  };
};

