// Contexto de React para manejar la autenticación globalmente
// Context: API de React que permite compartir datos sin pasar props manualmente
// createContext: Función de React que crea un nuevo contexto
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Importación de interfaces y tipos
import type { User, AuthData, LoginData, RegisterData, Trainer, Product } from '../interfaces/gym.interfaces';
import { UserRole } from '../interfaces/gym.interfaces';

// Importación de helpers para localStorage y validaciones
import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  isValidEmail,
  isValidPassword,
  passwordsMatch,
  generateId
} from '../helpers';
// Importación de servicios API
import { usuariosService } from '../services/usuariosService';


// Constantes para las claves de localStorage
// const: Declaración de constante que no puede ser reasignada
const STORAGE_KEY_USERS = 'gymUsers';        // Clave para almacenar usuarios en localStorage
const STORAGE_KEY_AUTH = 'gymAuth';          // Clave para almacenar sesión autenticada
const STORAGE_KEY_PRODUCTS = 'gymProducts';  // Clave para almacenar productos
const STORAGE_KEY_TRAINERS = 'gymTrainers';  // Clave para almacenar entrenadores
const STORAGE_KEY_PURCHASES = 'gymPurchases'; // Clave para almacenar compras
const STORAGE_KEY_HIRES = 'gymHires';        // Clave para almacenar contrataciones

// Interfaz que define la forma del contexto de autenticación
// Interface: Define el contrato del objeto de contexto
interface AuthContextType {
  authData: AuthData;                        // Datos de autenticación actuales
  login: (data: LoginData) => Promise<boolean>; // Función para iniciar sesión
  register: (data: RegisterData) => Promise<boolean>; // Función para registrar usuario
  logout: () => void;                        // Función para cerrar sesión
  initializeData: () => void;               // Función para inicializar datos por primera vez
}

// Creación del contexto de autenticación
// createContext: Crea un nuevo contexto con un valor por defecto
const AuthContextValue = createContext<AuthContextType | undefined>(undefined);

// Interfaz para las props del proveedor del contexto
// ReactNode: Tipo de React que representa cualquier nodo renderizable
interface AuthProviderProps {
  children: ReactNode;                       // Componentes hijos que tendrán acceso al contexto
}

// Componente proveedor del contexto de autenticación
// Functional Component: Componente de React definido como función
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // useState: Hook de React que gestiona el estado del componente
  // Estado global que almacena los datos de autenticación del usuario actual
  // Este estado es compartido con todos los componentes hijos a través del contexto
  const [authData, setAuthData] = useState<AuthData>({
    user: null,                              // Usuario autenticado (inicialmente null)
    isAuthenticated: false                   // Estado de autenticación (inicialmente false)
  });

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Efecto que se ejecuta al montar el componente para cargar la sesión guardada
  // Restaura la sesión del usuario si había una sesión activa guardada en localStorage
  // Si no hay sesión, inicializa los datos por primera vez (crea usuarios por defecto)
  useEffect(() => {
    // Carga el usuario autenticado desde localStorage si existe
    const savedAuth = getFromLocalStorage<AuthData>(STORAGE_KEY_AUTH);
    if (savedAuth && savedAuth.user) {
      // setState: Actualiza el estado del componente con la sesión guardada
      setAuthData(savedAuth);
    } else {
      // Si no hay sesión guardada, inicializa los datos por primera vez
      initializeData();
    }
  }, []); // Array de dependencias vacío: se ejecuta solo al montar el componente

  /**
   * Función para inicializar datos por primera vez (usuarios, productos, entrenadores)
   * void: Tipo que indica que la función no retorna valor
   */
  const initializeData = (): void => {
    // Verifica si ya existen usuarios en localStorage
    const existingUsers = getFromLocalStorage<User[]>(STORAGE_KEY_USERS);
    
    // Si no existen usuarios, crea los datos iniciales
    if (!existingUsers || existingUsers.length === 0) {
      // Crea un usuario administrador por defecto
      const adminUser: User = {
        id: generateId(),                    // Genera un ID único
        email: 'admin@gym.com',              // Email del administrador
        password: 'admin123',                // Contraseña del administrador (en producción debería estar hasheada)
        name: 'Administrador',              // Nombre del administrador
        role: UserRole.ADMIN,                // Rol de administrador
        createdAt: new Date().toISOString()  // Fecha de creación en formato ISO
      };

      // Crea un usuario entrenador predeterminado
      const trainerUserId = generateId();    // ID único para el usuario entrenador
      const trainerUser: User = {
        id: trainerUserId,                   // ID del usuario entrenador
        email: 'trainer@gym.com',            // Email del entrenador
        password: 'trainer123',              // Contraseña del entrenador
        name: 'Carlos Entrenador',           // Nombre del entrenador
        role: UserRole.TRAINER,              // Rol de entrenador
        createdAt: new Date().toISOString()  // Fecha de creación en formato ISO
      };

      // Crea un usuario normal de ejemplo
      const normalUser: User = {
        id: generateId(),                    // Genera un ID único
        email: 'user@gym.com',               // Email del usuario normal
        password: 'user123',                 // Contraseña del usuario normal
        name: 'Usuario Ejemplo',             // Nombre del usuario normal
        role: UserRole.USER,                 // Rol de usuario normal
        createdAt: new Date().toISOString()  // Fecha de creación en formato ISO
      };

      // Guarda todos los usuarios predeterminados en localStorage
      saveToLocalStorage(STORAGE_KEY_USERS, [adminUser, trainerUser, normalUser]);

      // Crea el perfil de entrenador para el usuario entrenador
      const trainerProfile: Trainer = {
        id: generateId(),                    // ID único del perfil de entrenador
        userId: trainerUserId,               // ID del usuario entrenador
        name: 'Carlos Entrenador',           // Nombre del entrenador
        specialization: 'Fuerza y Potencia', // Especialización
        experience: 5,                        // Años de experiencia
        price: 50,                            // Precio por hora
        description: 'Especialista en entrenamiento de fuerza y levantamiento de pesas', // Descripción
        rating: 4.8,                         // Calificación promedio
        image: 'https://via.placeholder.com/300x300?text=Carlos', // URL de imagen placeholder
        available: true                       // Disponible
      };

      // Guarda el perfil de entrenador en localStorage
      saveToLocalStorage(STORAGE_KEY_TRAINERS, [trainerProfile]);

      // Inicializa productos vacíos (se crearán en StorePage si no existen)
      const existingProducts = getFromLocalStorage<Product[]>(STORAGE_KEY_PRODUCTS);
      if (!existingProducts || existingProducts.length === 0) {
        saveToLocalStorage(STORAGE_KEY_PRODUCTS, []);
      }

      // Inicializa compras vacías
      saveToLocalStorage(STORAGE_KEY_PURCHASES, []);

      // Inicializa contrataciones vacías
      saveToLocalStorage(STORAGE_KEY_HIRES, []);
    }
  };

  /**
   * Función para iniciar sesión
   * @param data - Datos de login (email y contraseña)
   * @returns Promise que resuelve a true si el login es exitoso, false si no
   * Promise: Objeto que representa una operación asíncrona
   */
  const login = async (data: LoginData): Promise<boolean> => {
    try {
      // Valida el formato del email
      if (!isValidEmail(data.email)) {
        return false;                        // Retorna false si el email no es válido
      }

      // Intenta hacer login con el microservicio
      const result = await usuariosService.login({
        email: data.email,
        password: data.password
      });

      if (!result.success) {
        return false;
      }

      // Si el login es exitoso, obtiene los datos del usuario
      const usuarioAPI = await usuariosService.getUsuarioByEmail(data.email);
      
      if (!usuarioAPI) {
        return false;
      }

      // Convierte el usuario del API al formato del frontend
      const user: User = {
        id: usuarioAPI.id.toString(),
        email: usuarioAPI.email,
        password: '', // No guardamos la contraseña en el frontend
        name: usuarioAPI.username,
        role: usuarioAPI.rol.nombre === 'Administrador' ? UserRole.ADMIN :
              usuarioAPI.rol.nombre === 'Moderador' ? UserRole.TRAINER : UserRole.USER,
        createdAt: new Date().toISOString(),
        phone: usuarioAPI.phone
      };

      const newAuthData: AuthData = {
        user: user,
        isAuthenticated: true
      };

      setAuthData(newAuthData);
      saveToLocalStorage(STORAGE_KEY_AUTH, newAuthData);
      return true;
    } catch (error) {
      // Manejo de errores: registra el error en consola
      console.error('Error en login:', error);
      return false;                          // Retorna false en caso de error
    }
  };

  /**
   * Función para registrar un nuevo usuario
   * @param data - Datos de registro
   * @returns Promise que resuelve a true si el registro es exitoso, false si no
   */
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // Valida el formato del email
      if (!isValidEmail(data.email)) {
        return false;
      }

      // Valida que la contraseña cumpla los requisitos
      if (!isValidPassword(data.password)) {
        return false;
      }

      // Valida que las contraseñas coincidan
      if (!passwordsMatch(data.password, data.confirmPassword)) {
        return false;
      }

      // Valida que el nombre no esté vacío
      if (!data.name.trim()) {
        return false;
      }

      // Valida que el rol no sea ADMIN (solo se puede crear admin manualmente)
      // Solo permite registro como USER: Solo el admin puede asignar otros roles
      if (data.role === UserRole.ADMIN || data.role === UserRole.TRAINER) {
        return false;
      }

      // Valida que el teléfono esté presente
      if (!data.phone || !data.phone.trim()) {
        return false;
      }

      // Registra en el microservicio (se guarda en la BD)
      console.log('[AuthContext] Registering user with data:', { 
        username: data.name, 
        email: data.email, 
        phone: data.phone,
        address: data.address
      });
      
      const result = await usuariosService.register({
        username: data.name,
        password: data.password,
        email: data.email,
        phone: data.phone,
        address: data.address
      });

      console.log('[AuthContext] Registration result:', result);

      if (!result.success) {
        console.error('[AuthContext] Registration failed:', result.message);
        return false;
      }

      if (!result.usuario) {
        console.error('[AuthContext] No usuario returned from service');
        return false;
      }

      console.log('[AuthContext] User registered successfully:', result.usuario);

      // Convierte el usuario del API al formato del frontend para mantener compatibilidad
      const newUser: User = {
        id: result.usuario.id.toString(),
        email: result.usuario.email,
        password: '', // No guardamos la contraseña en el frontend
        name: result.usuario.username,
        role: UserRole.USER, // Siempre USER para registros públicos
        createdAt: new Date().toISOString(),
        phone: result.usuario.phone,
        address: result.usuario.address || data.address
      };

      // Guarda en localStorage solo para mantener compatibilidad con el resto de la app
      const users = getFromLocalStorage<User[]>(STORAGE_KEY_USERS) || [];
      users.push(newUser);
      saveToLocalStorage(STORAGE_KEY_USERS, users);
      
      return true;
    } catch (error) {
      // Manejo de errores
      console.error('Error en registro:', error);
      return false;
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = (): void => {
    // Actualiza el estado a no autenticado
    setAuthData({
      user: null,                            // Usuario a null
      isAuthenticated: false                  // Estado de autenticación a false
    });

    // Elimina la sesión de localStorage
    removeFromLocalStorage(STORAGE_KEY_AUTH);
  };

  // Valor del contexto que se compartirá con los componentes hijos
  const value: AuthContextType = {
    authData,                                // Datos de autenticación
    login,                                   // Función de login
    register,                                // Función de registro
    logout,                                  // Función de logout
    initializeData                           // Función de inicialización
  };

  // Provider: Componente que provee el contexto a sus hijos
  // value: Prop que contiene el valor del contexto
  return <AuthContextValue.Provider value={value}>{children}</AuthContextValue.Provider>;
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns El contexto de autenticación
 * Custom Hook: Hook personalizado que encapsula lógica reutilizable
 * 
 * Este hook utiliza useContext internamente para acceder al AuthContext
 * Permite a cualquier componente acceder a los datos de autenticación y funciones
 * (login, register, logout) sin necesidad de pasar props manualmente
 */
export const useAuth = (): AuthContextType => {
  // useContext: Hook de React que permite acceder a un contexto
  // Lee el valor del AuthContextValue más cercano en el árbol de componentes
  // Este hook es la forma de acceder al estado global de autenticación
  const context = useContext(AuthContextValue);

  // Si el contexto no está definido (se usa fuera del Provider), lanza un error
  // Esto previene errores silenciosos y ayuda a identificar problemas de configuración
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  // Retorna el contexto con todos los datos y funciones de autenticación
  return context;
};

