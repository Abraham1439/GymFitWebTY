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

// Importación del servicio API
import { usuarioAPI, mapUsuarioToUser } from '../services/api';

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

      // Intenta hacer login con la API del microservicio
      try {
        const usuarioBackend = await usuarioAPI.login(data.email, data.password);
        
        // Mapea el usuario del backend al formato del frontend
        const user: User = {
          id: usuarioBackend.id_usuario.toString(),
          email: usuarioBackend.email,
          password: '', // No guardamos la contraseña en el frontend
          name: usuarioBackend.username,
          role: usuarioBackend.rolId === 1 ? UserRole.ADMIN : 
                usuarioBackend.rolId === 2 ? UserRole.USER : UserRole.TRAINER,
          createdAt: new Date().toISOString(),
          phone: usuarioBackend.phone
        };

        // Crea los datos de autenticación
        const newAuthData: AuthData = {
          user: user,
          isAuthenticated: true
        };

        // Actualiza el estado local
        setAuthData(newAuthData);

        // Guarda la sesión en localStorage
        saveToLocalStorage(STORAGE_KEY_AUTH, newAuthData);

        // Retorna true indicando login exitoso
        return true;
      } catch (apiError: any) {
        // Si la API falla, intenta con localStorage como fallback
        console.warn('API no disponible, usando localStorage:', apiError);
        
        const users = getFromLocalStorage<User[]>(STORAGE_KEY_USERS) || [];
        const user = users.find(
          (u) => u.email === data.email && u.password === data.password
        );

        if (!user) {
          return false;
        }

        const newAuthData: AuthData = {
          user: user,
          isAuthenticated: true
        };

        setAuthData(newAuthData);
        saveToLocalStorage(STORAGE_KEY_AUTH, newAuthData);
        return true;
      }
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

      // Intenta registrar con la API del microservicio
      try {
        const usuarioBackend = await usuarioAPI.register({
          username: data.name,
          email: data.email,
          phone: data.phone || '',
          password: data.password,
          rolId: 2 // 2 = Usuario (1 = Admin, 2 = Usuario, 3 = Vendedor/Moderador)
        });

        // Mapea el usuario del backend al formato del frontend
        const newUser: User = {
          id: usuarioBackend.id_usuario.toString(),
          email: usuarioBackend.email,
          password: '', // No guardamos la contraseña
          name: usuarioBackend.username,
          role: UserRole.USER,
          createdAt: new Date().toISOString(),
          phone: usuarioBackend.phone
        };

        // Guarda también en localStorage como backup
        const users = getFromLocalStorage<User[]>(STORAGE_KEY_USERS) || [];
        users.push(newUser);
        saveToLocalStorage(STORAGE_KEY_USERS, users);

        // Retorna true indicando registro exitoso
        return true;
      } catch (apiError: any) {
        // Si la API falla, intenta con localStorage como fallback
        console.warn('API no disponible, usando localStorage:', apiError);
        
        const users = getFromLocalStorage<User[]>(STORAGE_KEY_USERS) || [];
        const emailExists = users.some((u) => u.email === data.email);

        if (emailExists) {
          return false;
        }

        const newUser: User = {
          id: generateId(),
          email: data.email,
          password: data.password,
          name: data.name,
          role: UserRole.USER,
          createdAt: new Date().toISOString(),
          phone: data.phone,
          address: data.address
        };

        users.push(newUser);
        saveToLocalStorage(STORAGE_KEY_USERS, users);
        return true;
      }
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

