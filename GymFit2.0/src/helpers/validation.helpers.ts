// Helper para validaciones de formularios
// Validación: Proceso de verificar que los datos cumplen con ciertos criterios

/**
 * Valida si un email tiene formato válido
 * @param email - Email a validar (string)
 * @returns true si el email es válido, false si no
 */
export const isValidEmail = (email: string): boolean => {
  // Expresión regular para validar formato de email
  // RegExp: Objeto que representa una expresión regular (regex)
  // /^[^\s@]+@[^\s@]+\.[^\s@]+$/: Patrón regex que valida formato email
  // ^: Inicio de la cadena
  // [^\s@]+: Uno o más caracteres que no sean espacios ni @
  // @: Debe contener un símbolo @
  // [^\s@]+: Uno o más caracteres que no sean espacios ni @
  // \.: Debe contener un punto (escapado)
  // [^\s@]+$: Uno o más caracteres hasta el final
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // test: Método de RegExp que verifica si el string coincide con el patrón
  return emailRegex.test(email);
};

/**
 * Valida si una contraseña cumple con los requisitos mínimos
 * @param password - Contraseña a validar (string)
 * @returns true si la contraseña es válida, false si no
 */
export const isValidPassword = (password: string): boolean => {
  // Verifica que la contraseña tenga al menos 6 caracteres
  // length: Propiedad de string que retorna la cantidad de caracteres
  return password.length >= 6;
};

/**
 * Valida si un string no está vacío
 * @param value - Valor a validar (string)
 * @returns true si el string no está vacío, false si está vacío
 */
export const isNotEmpty = (value: string): boolean => {
  // trim: Método que elimina espacios en blanco al inicio y final
  // Verifica que después de trimear, el string tenga longitud mayor a 0
  return value.trim().length > 0;
};

/**
 * Valida si un número es positivo
 * @param value - Número a validar (number)
 * @returns true si el número es positivo, false si no
 */
export const isPositiveNumber = (value: number): boolean => {
  // Verifica que el número sea mayor que 0
  // isNaN: Función que verifica si un valor es NaN (Not a Number)
  return !isNaN(value) && value > 0;
};

/**
 * Valida si dos contraseñas coinciden
 * @param password - Primera contraseña (string)
 * @param confirmPassword - Segunda contraseña para confirmar (string)
 * @returns true si las contraseñas coinciden, false si no
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  // Comparación estricta (===): Verifica que ambos valores sean iguales en tipo y valor
  return password === confirmPassword;
};

/**
 * Valida si un teléfono tiene formato válido
 * @param phone - Teléfono a validar (string)
 * @returns true si el teléfono es válido, false si tiene formato inválido o está vacío
 */
export const isValidPhone = (phone: string): boolean => {
  // El teléfono es obligatorio, no puede estar vacío
  if (!phone || phone.trim().length === 0) {
    return false;
  }
  // Validar formato: 8-15 dígitos, puede empezar con +
  // ^\\+?[0-9]{8,15}$: Patrón regex que valida formato de teléfono
  // ^: Inicio de la cadena
  // \\+?: El símbolo + es opcional (0 o 1 vez)
  // [0-9]{8,15}: Entre 8 y 15 dígitos
  // $: Fin de la cadena
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Genera un ID único usando timestamp y número aleatorio
 * @returns String con ID único
 */
export const generateId = (): string => {
  // Date.now(): Método que retorna el timestamp actual en milisegundos
  // Math.random(): Función que genera un número aleatorio entre 0 y 1
  // toString(36): Convierte el número a base 36 (0-9, a-z)
  // substring(2, 9): Toma una parte del string generado
  // Template literal: Sintaxis de JavaScript para concatenar strings con ${}
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Formatea una fecha a formato legible
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha formateada como string
 */
export const formatDate = (dateString: string): string => {
  // new Date(): Constructor que crea un objeto Date
  // toLocaleDateString(): Método que convierte la fecha a formato local
  // 'es-ES': Locale para formato español
  // { year: 'numeric', month: 'long', day: 'numeric' }: Opciones de formato
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

