// Exportación de todos los helpers del proyecto
// export: Palabra clave para exportar funciones, clases, etc. desde un módulo

// Exporta la función updateArray (mantenida del proyecto original)
export { updateArray } from './update-array.helpers'

// Exporta la función capitalizeFirst (mantenida del proyecto original)
export { capitalizeFirst } from './capitalize-first.helpers'

// Exporta las funciones de localStorage para persistencia de datos
export {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  clearLocalStorage
} from './local-storage.helpers'

// Exporta las funciones de validación para formularios
export {
  isValidEmail,
  isValidPassword,
  isNotEmpty,
  isPositiveNumber,
  passwordsMatch,
  isValidPhone,
  isValidName,
  generateId,
  formatDate
} from './validation.helpers'