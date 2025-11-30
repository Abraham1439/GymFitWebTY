// Componente de barra de navegación principal
// Functional Component: Componente de React definido como función
import { useNavigate, useLocation } from 'react-router-dom';
// useNavigate: Hook de react-router-dom para navegación programática
// useLocation: Hook de react-router-dom para obtener la ruta actual
// Importación de componentes de Bootstrap
import { Navbar, Nav, NavDropdown, Container, Button, Badge } from 'react-bootstrap';

// Importación del hook de autenticación
import { useAuth } from '../../contexts/AuthContext';
// Importación del hook del carrito
import { useCart } from '../../contexts/CartContext';
// Importación de tipos e interfaces
import { UserRole } from '../../interfaces/gym.interfaces';

// Componente de barra de navegación
// Functional Component: Componente funcional de React
export const NavBar = () => {
  // useNavigate: Hook que retorna una función para navegar programáticamente
  // Se utiliza para navegar a diferentes páginas cuando el usuario hace clic en los enlaces del menú
  const navigate = useNavigate();
  
  // useLocation: Hook que retorna la ubicación actual de la ruta
  // Se utiliza para resaltar el enlace activo en el menú de navegación según la página actual
  const location = useLocation();
  
  // useAuth: Hook personalizado que retorna los datos y funciones de autenticación
  // Se utiliza para mostrar/ocultar opciones del menú según el estado de autenticación y el rol del usuario
  const { authData, logout } = useAuth();
  
  // useCart: Hook personalizado que retorna las funciones del carrito
  // Se utiliza para mostrar la cantidad de items en el carrito en el badge del icono
  const { getTotalItems } = useCart();

  /**
   * Maneja el cierre de sesión
   * void: Tipo que indica que la función no retorna valor
   */
  const handleLogout = (): void => {
    // Ejecuta la función de logout del contexto
    logout();
    // Navega a la página de login después de cerrar sesión
    navigate('/login');
  };

  // JSX: Sintaxis de JavaScript que permite escribir HTML en JavaScript
  return (
    // Navbar: Componente de Bootstrap para barras de navegación
    <Navbar expand="lg" bg="dark" variant="dark" className="border-bottom border-secondary">
      {/* Container: Componente de Bootstrap que centra el contenido */}
      <Container fluid>
        {/* Navbar.Brand: Marca/logo de la barra de navegación */}
        <Navbar.Brand 
          href="#" 
          className="text-white fw-bold"
          onClick={() => navigate('/')} // onClick: Navega a la página principal al hacer clic
        >
          {/* Icono de Font Awesome */}
          <i className="fa-solid fa-dumbbell me-2"></i>
          {/* Nombre de la aplicación */}
          GymFitWeb
        </Navbar.Brand>
        
        {/* Navbar.Toggle: Botón para colapsar/expandir el menú en móviles */}
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        
        {/* Navbar.Collapse: Contenedor colapsable del menú */}
        <Navbar.Collapse id="navbarSupportedContent">
          {/* Nav: Componente de Bootstrap para listas de navegación */}
          <Nav className="me-auto">
            {/* Link a la página principal */}
            <Nav.Link
              href="#"
              active={location.pathname === '/'} // active: Muestra como activo si está en la ruta principal
              className="text-white"
              onClick={() => navigate('/')} // onClick: Navega a la página principal
            >
              {/* Icono de Font Awesome */}
              <i className="fa-solid fa-house me-1"></i>
              Inicio
            </Nav.Link>

            {/* Link a la tienda (visible para todos) */}
            <Nav.Link
              href="#"
              active={location.pathname === '/store'} // active: Muestra como activo si está en la ruta de tienda
              className="text-white"
              onClick={() => navigate('/store')} // onClick: Navega a la página de tienda
            >
              {/* Icono de Font Awesome */}
              <i className="fa-solid fa-shopping-cart me-1"></i>
              Tienda
            </Nav.Link>

            {/* Condicional: Si el usuario está autenticado, muestra opciones según su rol */}
            {authData.isAuthenticated && (
              <>
                {/* Condicional: Si el usuario es ADMIN, muestra panel de administrador */}
                {authData.user?.role === UserRole.ADMIN && (
                  <Nav.Link
                    href="#"
                    active={location.pathname === '/admin'} // active: Muestra como activo si está en la ruta de admin
                    className="text-white"
                    onClick={() => navigate('/admin')} // onClick: Navega al panel de administrador
                  >
                    {/* Icono de Font Awesome */}
                    <i className="fa-solid fa-user-shield me-1"></i>
                    Panel Admin
                  </Nav.Link>
                )}

                {/* Condicional: Si el usuario es USER, muestra panel de usuario */}
                {authData.user?.role === UserRole.USER && (
                  <Nav.Link
                    href="#"
                    active={location.pathname === '/user-panel'} // active: Muestra como activo si está en la ruta de usuario
                    className="text-white"
                    onClick={() => navigate('/user-panel')} // onClick: Navega al panel de usuario
                  >
                    {/* Icono de Font Awesome */}
                    <i className="fa-solid fa-user me-1"></i>
                    Mi Panel
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>

          {/* Nav: Componente de Bootstrap para elementos de navegación a la derecha */}
          <Nav>
            {/* Link al carrito (visible para todos) */}
            <Nav.Link
              href="#"
              active={location.pathname === '/cart'}
              className="text-white position-relative me-3"
              onClick={() => navigate('/cart')}
            >
              <i className="fa-solid fa-shopping-cart me-1"></i>
              Carrito
              {/* Badge: Contador de artículos en el carrito */}
              {getTotalItems() > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.7rem' }}
                >
                  {getTotalItems()}
                </Badge>
              )}
            </Nav.Link>

            {/* Condicional: Si el usuario NO está autenticado, muestra botones de login y registro */}
            {!authData.isAuthenticated ? (
              <>
                {/* Button: Botón para iniciar sesión */}
                <Button
                  variant="outline-light"      // variant: Estilo del botón (outline-light = borde blanco)
                  className="me-2 border-secondary text-white" // className: Clases CSS adicionales
                  onClick={() => navigate('/login')} // onClick: Navega a la página de login
                >
                  <i className="fa-solid fa-sign-in-alt me-1"></i>
                  Iniciar Sesión
                </Button>
                
                {/* Button: Botón para registrarse */}
                <Button
                  variant="success"            // variant: Estilo del botón (success = verde)
                  onClick={() => navigate('/register')} // onClick: Navega a la página de registro
                >
                  <i className="fa-solid fa-user-plus me-1"></i>
                  Registrarse
                </Button>
              </>
            ) : (
              // Si el usuario está autenticado, muestra información del usuario y botón de logout
              <>
                {/* NavDropdown: Componente de Bootstrap para menús desplegables */}
                <NavDropdown
                  title={
                    // Título del menú desplegable con el nombre del usuario
                    <span className="text-white">
                      <i className="fa-solid fa-user-circle me-1"></i>
                      {authData.user?.name || 'Usuario'} {/* Nombre del usuario o "Usuario" por defecto */}
                    </span>
                  }
                  id="user-dropdown"
                  menuVariant="dark"          // menuVariant: Estilo del menú (dark = oscuro)
                >
                  {/* NavDropdown.Item: Elemento del menú desplegable */}
                  <NavDropdown.Item disabled>
                    {/* Texto informativo del usuario */}
                    <small className="text-white">
                      {authData.user?.email}   {/* Email del usuario */}
                    </small>
                  </NavDropdown.Item>
                  
                  {/* NavDropdown.Divider: Separador visual del menú */}
                  <NavDropdown.Divider className="bg-secondary" />
                  
                  {/* NavDropdown.Item: Elemento para cerrar sesión */}
                  <NavDropdown.Item
                    onClick={handleLogout}     // onClick: Ejecuta la función de logout
                    className="text-white"
                  >
                    <i className="fa-solid fa-sign-out-alt me-1"></i>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
