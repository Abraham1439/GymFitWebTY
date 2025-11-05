// Configuración de rutas de la aplicación
// useRoutes: Hook de react-router-dom para definir rutas de forma declarativa
import { useRoutes } from 'react-router-dom';

// Importación de componentes de páginas
import { HomePage } from '../pages/home/HomePage';
import { LoginPage, RegisterPage } from '../pages/auth';
import { StorePage, ProductDetailPage } from '../pages/store';
import { CartPage } from '../pages/cart';
import { TrainersPage, TrainerDetailPage } from '../pages/trainers';
import { UserPanel } from '../pages/user';
import { TrainerPanel } from '../pages/trainer';
import { AdminPanel } from '../pages/admin';

// Componente de rutas de la aplicación
// Functional Component: Componente funcional de React
export const AppRoutes = () => {
  // useRoutes: Hook que retorna el elemento de la ruta correspondiente
  // Array de objetos de configuración de rutas
  const routes = useRoutes([
    // Ruta para la página principal
    {
      path: '/',                  // path: Ruta URL que coincide con esta configuración
      element: <HomePage />       // element: Componente React a renderizar
    },
    // Ruta para la página de login
    {
      path: '/login',             // path: Ruta para login
      element: <LoginPage />      // element: Componente de página de login
    },
    // Ruta para la página de registro
    {
      path: '/register',          // path: Ruta para registro
      element: <RegisterPage />   // element: Componente de página de registro
    },
    // Ruta para la página de tienda
    {
      path: '/store',             // path: Ruta para tienda
      element: <StorePage />      // element: Componente de página de tienda
    },
    // Ruta para la página de detalles de producto
    {
      path: '/product/:id',       // path: Ruta dinámica para detalles de producto
      element: <ProductDetailPage /> // element: Componente de página de detalles
    },
    // Ruta para la página del carrito
    {
      path: '/cart',              // path: Ruta para carrito
      element: <CartPage />       // element: Componente de página de carrito
    },
    // Ruta para la página de entrenadores
    {
      path: '/trainers',          // path: Ruta para entrenadores
      element: <TrainersPage />   // element: Componente de página de entrenadores
    },
    // Ruta para la página de detalles de entrenador
    {
      path: '/trainer/:id',       // path: Ruta dinámica para detalles de entrenador
      element: <TrainerDetailPage /> // element: Componente de página de detalles
    },
    // Ruta para el panel de usuario
    {
      path: '/user-panel',        // path: Ruta para panel de usuario
      element: <UserPanel />      // element: Componente de panel de usuario
    },
    // Ruta para el panel de entrenador
    {
      path: '/trainer-panel',    // path: Ruta para panel de entrenador
      element: <TrainerPanel />  // element: Componente de panel de entrenador
    },
    // Ruta para el panel de administrador
    {
      path: '/admin',            // path: Ruta para panel de administrador
      element: <AdminPanel />    // element: Componente de panel de administrador
    },
    // Ruta comodín para páginas no encontradas (404)
    {
      path: '*',                 // path: '*' coincide con cualquier ruta no definida
      element: <div className="container py-5 text-center">
        <h1>404 - Página no encontrada</h1>
        <p>La página que buscas no existe.</p>
      </div>                     // element: Mensaje de error 404
    }
  ]);

  // Retorna las rutas configuradas
  return routes;
};
