// Componente principal de la aplicación GymFitWeb
// Functional Component: Componente de React definido como función
import { NavBar } from './pages/sharedComponents/NavBar';
// Importación del componente de barra de navegación

// Importación de estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Importación del CSS de Bootstrap para estilos

// Componente principal de la aplicación
// Functional Component: Componente funcional de React
export const GymApp = () => {
  // JSX: Sintaxis de JavaScript que permite escribir HTML en JavaScript
  return (
    // div: Elemento HTML contenedor principal
    <div>
      {/* NavBar: Componente de barra de navegación */}
      <NavBar />
      
      {/* Contenido principal de la aplicación */}
      {/* Las rutas se renderizarán aquí mediante AppRoutes */}
      {/* Este componente actúa como layout principal que envuelve todas las páginas */}
    </div>
  );
};



