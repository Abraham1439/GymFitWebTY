// Contexto de React para manejar la autenticación globalmente
// Context: API de React que permite compartir datos sin pasar props manualmente
// createContext: Función de React que crea un nuevo contexto
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Importación de interfaces y tipos
import type { User, AuthData, LoginData, RegisterData } from '../interfaces/gym.interfaces';
import { UserRole } from '../interfaces/gym.interfaces';

// Importación de helpers para validaciones
import {
  isValidEmail,
  isValidPassword,
  passwordsMatch,
  isValidName
} from '../helpers';
// Importación de servicios API
import { usuariosService } from '../services/usuariosService';

// Interfaz que define la forma del contexto de autenticación
// Interface: Define el contrato del objeto de contexto
interface AuthContextType {
  authData: AuthData;                        // Datos de autenticación actuales
  login: (data: LoginData) => Promise<User | null>; // Función para iniciar sesión, retorna el usuario o null
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
  // Efecto que se ejecuta al montar el componente para restaurar la sesión
  useEffect(() => {
    // Verificar si hay un token JWT guardado
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Si hay token, intentar obtener los datos del usuario
      // Por ahora, solo verificamos que el token existe
      // En producción, deberías validar el token con el backend
      const savedUser = localStorage.getItem('user_data');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setAuthData({
            user: user,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          // Si hay error, limpiar datos inválidos
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user_data');
        }
      }
    }
  }, []); // Array de dependencias vacío: se ejecuta solo al montar el componente

  /**
   * Función para inicializar datos por primera vez
   * Ya no es necesaria porque los datos vienen de los microservicios
   * void: Tipo que indica que la función no retorna valor
   */
  const initializeData = (): void => {
    // Ya no se inicializan datos aquí, todo viene de los microservicios
    // Esta función se mantiene por compatibilidad pero no hace nada
  };

  /**
   * Función para iniciar sesión
   * @param data - Datos de login (email y contraseña)
   * @returns Promise que resuelve al usuario si el login es exitoso, null si no
   * Promise: Objeto que representa una operación asíncrona
   */
  const login = async (data: LoginData): Promise<User | null> => {
    try {
      // Valida el formato del email
      if (!isValidEmail(data.email)) {
        console.error('[AuthContext] Invalid email format:', data.email);
        return null;                        // Retorna null si el email no es válido
      }

      console.log('[AuthContext] Attempting login for:', data.email);

      // Intenta hacer login con el microservicio
      const result = await usuariosService.login({
        email: data.email,
        password: data.password
      });

      console.log('[AuthContext] Login result:', result);

      if (!result.success) {
        console.error('[AuthContext] Login failed:', result.message);
        return null;
      }

      console.log('[AuthContext] Login successful, fetching user data...');

      // Si el login es exitoso, obtiene los datos del usuario
      const usuarioAPI = await usuariosService.getUsuarioByEmail(data.email);
      
      console.log('[AuthContext] User data fetched:', usuarioAPI);

      if (!usuarioAPI) {
        console.error('[AuthContext] User not found after successful login');
        return null;
      }

      // Convierte el usuario del API al formato del frontend
      const user: User = {
        id: usuarioAPI.id.toString(),
        email: usuarioAPI.email,
        password: '', // No guardamos la contraseña en el frontend
        name: usuarioAPI.username,
        role: usuarioAPI.rol.nombre === 'Administrador' ? UserRole.ADMIN :
              usuarioAPI.rol.nombre === 'Entrenador' ? UserRole.TRAINER : UserRole.USER,
        createdAt: new Date().toISOString(),
        phone: usuarioAPI.phone,
        address: usuarioAPI.address
      };

      console.log('[AuthContext] User converted:', user);

      const newAuthData: AuthData = {
        user: user,
        isAuthenticated: true
      };

      setAuthData(newAuthData);
      
      // Guardar datos del usuario en localStorage para persistencia
      localStorage.setItem('user_data', JSON.stringify(user));
      
      console.log('[AuthContext] Login completed successfully');
      return user;                           // Retorna el usuario para que LoginPage pueda redirigir según el rol
    } catch (error) {
      // Manejo de errores: registra el error en consola
      console.error('[AuthContext] Error en login:', error);
      return null;                           // Retorna null en caso de error
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

      // Valida que el nombre no esté vacío y tenga formato válido
      if (!data.name.trim()) {
        return false;
      }
      if (!isValidName(data.name)) {
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

      // Valida que la dirección esté presente
      if (!data.address || !data.address.trim()) {
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

      // El usuario ya está guardado en la BD del microservicio
      // No se guarda en localStorage para evitar IDs duplicados
      // Los datos se obtienen directamente del microservicio cuando se necesiten
      
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
    // Limpiar token JWT y datos del usuario del localStorage
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
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

