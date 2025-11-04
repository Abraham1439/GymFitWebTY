// Enumeración para definir los roles de usuario en el sistema
// Enum: Tipo de datos TypeScript que permite definir un conjunto de constantes con nombre
export enum UserRole {
  ADMIN = 'admin',        // Rol de administrador: puede gestionar usuarios
  USER = 'user',          // Rol de usuario: puede comprar productos y contratar entrenadores
  TRAINER = 'trainer'     // Rol de entrenador: puede responder a usuarios y ver sus clientes
}

// Interfaz que define la estructura de un usuario en el sistema
// Interface: Contrato TypeScript que define la forma de un objeto
export interface User {
  id: string;                    // Identificador único del usuario (UUID o string único)
  email: string;                 // Correo electrónico del usuario (usado para login)
  password: string;               // Contraseña del usuario (en producción debería estar hasheada)
  name: string;                  // Nombre completo del usuario
  role: UserRole;                // Rol del usuario (admin, user, trainer)
  createdAt: string;             // Fecha de creación del usuario (ISO string)
  phone?: string;                // Número de teléfono opcional
  address?: string;              // Dirección opcional del usuario
}

// Interfaz que define la estructura de un producto en la tienda
// Interface: Define la forma de los objetos de producto
export interface Product {
  id: string;                    // Identificador único del producto
  name: string;                  // Nombre del producto
  description: string;           // Descripción detallada del producto
  price: number;                 // Precio del producto en la moneda local
  category: 'accessory' | 'supplement'; // Categoría del producto (accesorio o suplemento)
  image: string;                 // URL o ruta de la imagen del producto
  stock: number;                 // Cantidad disponible en inventario
  createdAt: string;             // Fecha de creación del producto (ISO string)
}

// Interfaz que define la estructura de un entrenador
// Interface: Define la forma de los objetos de entrenador
export interface Trainer {
  id: string;                    // Identificador único del entrenador
  userId: string;                // ID del usuario que es entrenador (referencia a User)
  name: string;                  // Nombre del entrenador
  specialization: string;        // Especialización del entrenador (ej: "Fuerza", "Cardio")
  experience: number;            // Años de experiencia
  price: number;                // Precio por hora o mes de entrenamiento
  description: string;           // Descripción del entrenador
  rating: number;               // Calificación promedio (0-5)
  image: string;                // URL o ruta de la imagen del entrenador
  available: boolean;           // Disponibilidad del entrenador
}

// Interfaz que define la estructura de una compra de producto
// Interface: Define la forma de los objetos de compra
export interface Purchase {
  id: string;                    // Identificador único de la compra
  userId: string;                // ID del usuario que realiza la compra
  productId: string;             // ID del producto comprado
  quantity: number;              // Cantidad de productos comprados
  total: number;                 // Precio total de la compra (price * quantity)
  date: string;                  // Fecha de la compra (ISO string)
  status: 'pending' | 'completed' | 'cancelled'; // Estado de la compra
}

// Interfaz que define la estructura de una contratación de entrenador
// Interface: Define la forma de los objetos de contratación
export interface TrainerHire {
  id: string;                    // Identificador único de la contratación
  userId: string;                // ID del usuario que contrata
  trainerId: string;             // ID del entrenador contratado
  startDate: string;             // Fecha de inicio del entrenamiento (ISO string)
  endDate?: string;              // Fecha de fin del entrenamiento (opcional, ISO string)
  status: 'active' | 'completed' | 'cancelled'; // Estado de la contratación
  messages: Message[];           // Array de mensajes entre usuario y entrenador
}

// Interfaz que define la estructura de un mensaje
// Interface: Define la forma de los objetos de mensaje
export interface Message {
  id: string;                    // Identificador único del mensaje
  senderId: string;              // ID del usuario que envía el mensaje
  senderName: string;            // Nombre del remitente
  content: string;               // Contenido del mensaje
  timestamp: string;             // Fecha y hora del mensaje (ISO string)
}

// Interfaz que define los datos de autenticación
// Interface: Define la forma de los datos de login
export interface AuthData {
  user: User | null;             // Usuario autenticado o null si no hay sesión
  isAuthenticated: boolean;      // Booleano que indica si hay una sesión activa
}

// Interfaz que define los datos del formulario de registro
// Interface: Define la forma de los datos de registro
export interface RegisterData {
  email: string;                 // Email del nuevo usuario
  password: string;              // Contraseña del nuevo usuario
  confirmPassword: string;       // Confirmación de la contraseña
  name: string;                  // Nombre del nuevo usuario
  role: UserRole;                // Rol seleccionado (solo USER o TRAINER, no ADMIN)
  phone?: string;                // Teléfono opcional
  address?: string;              // Dirección opcional
}

// Interfaz que define los datos del formulario de login
// Interface: Define la forma de los datos de inicio de sesión
export interface LoginData {
  email: string;                 // Email para login
  password: string;              // Contraseña para login
}

