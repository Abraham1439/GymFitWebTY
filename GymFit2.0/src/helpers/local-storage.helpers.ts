// Helper para guardar datos en localStorage del navegador
// localStorage: API del navegador que permite almacenar datos en el cliente de forma persistente
// JSON.stringify: Método que convierte un objeto JavaScript a una cadena JSON

/**
 * Guarda un valor en localStorage
 * @param key - Clave única para identificar el valor almacenado (string)
 * @param value - Valor a guardar (cualquier tipo que se pueda serializar a JSON)
 */
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    // Convierte el valor a JSON string y lo guarda en localStorage
    // JSON.stringify: Serializa el objeto a formato JSON string
    const serializedValue = JSON.stringify(value);
    // localStorage.setItem: Método que guarda un par clave-valor en localStorage
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    // Manejo de errores: Si falla la serialización, se registra el error en consola
    // console.error: Método para imprimir errores en la consola del navegador
    console.error(`Error guardando en localStorage: ${error}`);
  }
};

/**
 * Obtiene un valor de localStorage
 * @param key - Clave del valor a recuperar (string)
 * @returns El valor recuperado o null si no existe
 */
export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    // localStorage.getItem: Método que recupera un valor de localStorage por su clave
    const item = localStorage.getItem(key);
    // Si no existe el item, retorna null
    if (item === null) {
      return null;
    }
    // JSON.parse: Método que convierte una cadena JSON a un objeto JavaScript
    // Type assertion: Convierte el resultado parseado al tipo genérico T
    return JSON.parse(item) as T;
  } catch (error) {
    // Manejo de errores: Si falla el parseo, se registra el error
    console.error(`Error leyendo de localStorage: ${error}`);
    return null;
  }
};

/**
 * Elimina un valor de localStorage
 * @param key - Clave del valor a eliminar (string)
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    // localStorage.removeItem: Método que elimina un par clave-valor de localStorage
    localStorage.removeItem(key);
  } catch (error) {
    // Manejo de errores: Si falla la eliminación, se registra el error
    console.error(`Error eliminando de localStorage: ${error}`);
  }
};

/**
 * Limpia todo el contenido de localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    // localStorage.clear: Método que elimina todos los datos de localStorage
    localStorage.clear();
  } catch (error) {
    // Manejo de errores: Si falla la limpieza, se registra el error
    console.error(`Error limpiando localStorage: ${error}`);
  }
};

