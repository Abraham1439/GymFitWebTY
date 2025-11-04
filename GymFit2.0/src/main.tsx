// Punto de entrada principal de la aplicación React
// StrictMode: Componente de React que detecta problemas potenciales en la aplicación
import { StrictMode } from 'react';
// createRoot: Función de React 18 para crear la raíz de renderizado
import { createRoot } from 'react-dom/client';
// BrowserRouter: Componente de react-router-dom para enrutamiento del lado del cliente
import { BrowserRouter } from 'react-router-dom';

// Importación de componentes y contexto
import { GymApp } from './GymApp';
// Importación del componente principal de la aplicación
import { AuthProvider } from './contexts/AuthContext';
// Importación del proveedor de contexto de autenticación
import { AppRoutes } from './routes/AppRoutes';
// Importación del componente de rutas

// createRoot: Crea la raíz de renderizado para React 18
// document.getElementById('root'): Obtiene el elemento DOM con id "root"
// !: Operador de aserción no nula (TypeScript): garantiza que el elemento existe
const rootElement = document.getElementById('root')!;

// createRoot: Crea una nueva raíz de React para renderizar
const root = createRoot(rootElement);

// render: Método que renderiza el componente React en el DOM
root.render(
  // StrictMode: Componente que activa verificaciones adicionales en desarrollo
  <StrictMode>
    {/* BrowserRouter: Envuelve la aplicación para habilitar el enrutamiento */}
    <BrowserRouter>
      {/* AuthProvider: Provee el contexto de autenticación a toda la aplicación */}
      {/* Provider: Componente que comparte el contexto con sus hijos */}
      <AuthProvider>
        {/* GymApp: Componente principal de la aplicación (incluye NavBar) */}
        <GymApp />
        {/* AppRoutes: Componente que define y renderiza las rutas de la aplicación */}
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
