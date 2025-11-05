// Página de inicio de sesión
// Functional Component: Componente de React definido como función
import { useState } from 'react';
// useNavigate: Hook de react-router-dom para navegación programática
import { useNavigate } from 'react-router-dom';
// Importación de componentes de Bootstrap
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';

// Importación del hook de autenticación
import { useAuth } from '../../contexts/AuthContext';
// Importación de tipos e interfaces
import type { LoginData } from '../../interfaces/gym.interfaces';
// Importación de helpers de validación
import { isValidEmail } from '../../helpers';

// Componente de página de login
// Functional Component: Componente funcional de React
export const LoginPage = () => {
  // useNavigate: Hook que retorna una función para navegar programáticamente
  const navigate = useNavigate();
  
  // useAuth: Hook personalizado que retorna las funciones y datos de autenticación
  const { login } = useAuth();

  // useState: Hook de React para gestionar estado local
  // Estado para los datos del formulario de login
  const [formData, setFormData] = useState<LoginData>({
    email: '',                    // Email del usuario (inicialmente vacío)
    password: ''                  // Contraseña del usuario (inicialmente vacía)
  });

  // Estado para mensajes de error
  const [error, setError] = useState<string>(''); // String vacío significa sin error

  // Estado para indicar si se está procesando el login
  const [loading, setLoading] = useState<boolean>(false); // false = no está cargando

  // Estado para controlar si la contraseña está visible o no
  const [showPassword, setShowPassword] = useState<boolean>(false); // false = oculta la contraseña

  /**
   * Maneja el cambio en los campos del formulario
   * @param e - Evento de cambio del input
   * Event: Tipo de evento de React
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Obtiene el nombre y valor del campo que cambió
    const { name, value } = e.target;
    
    // Actualiza el estado del formulario con el nuevo valor
    // setState con función: Actualiza el estado basado en el estado anterior
    setFormData((prev) => ({
      ...prev,                    // Spread operator: Copia todas las propiedades anteriores
      [name]: value               // Computed property name: Actualiza solo el campo que cambió
    }));

    // Limpia el error cuando el usuario empieza a escribir
    if (error) {
      setError('');
    }
  };

  /**
   * Maneja el envío del formulario de login
   * @param e - Evento de submit del formulario
   * FormEvent: Tipo de evento de formulario de React
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    // preventDefault: Previene el comportamiento por defecto del formulario (recargar página)
    e.preventDefault();

    // Valida el formato del email
    if (!isValidEmail(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;                     // Sale de la función si hay error
    }

    // Valida que la contraseña no esté vacía
    if (!formData.password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }

    // Activa el estado de carga
    setLoading(true);
    // Limpia cualquier error anterior
    setError('');

    try {
      // Intenta hacer login con los datos del formulario
      // await: Palabra clave para esperar una promesa
      const success = await login(formData);

      if (success) {
        // Si el login es exitoso, navega a la página principal
        navigate('/');
      } else {
        // Si el login falla, muestra un mensaje de error
        setError('Email o contraseña incorrectos');
      }
    } catch (err) {
      // Manejo de errores: si ocurre un error inesperado
      setError('Error al iniciar sesión. Por favor intenta de nuevo.');
    } finally {
      // finally: Bloque que siempre se ejecuta, sin importar si hay error o no
      // Desactiva el estado de carga
      setLoading(false);
    }
  };

  // JSX: Sintaxis de JavaScript que permite escribir HTML en JavaScript
  return (
    // Container: Componente de Bootstrap que centra el contenido
    // pt-2: Padding-top reducido (2 = padding pequeño arriba)
    // pb-2: Padding-bottom reducido (2 = padding pequeño abajo)
    <Container className="d-flex justify-content-center align-items-center min-vh-100 pt-2 pb-2">
      {/* Card: Componente de Bootstrap para crear tarjetas */}
      <Card style={{ width: '400px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        {/* Card.Header: Encabezado de la tarjeta */}
        <Card.Header className="text-center bg-primary text-white">
          <h3>Iniciar Sesión</h3>
        </Card.Header>
        
        {/* Card.Body: Cuerpo de la tarjeta */}
        <Card.Body>
          {/* Form: Componente de Bootstrap para formularios */}
          <Form onSubmit={handleSubmit}>
            {/* Alert: Componente de Bootstrap para mostrar mensajes */}
            {/* Condicional: Si hay error, muestra el componente Alert */}
            {error && (
              <Alert variant="danger">
                {/* variant: Prop de Bootstrap que define el estilo del Alert */}
                {error}
              </Alert>
            )}

            {/* Form.Group: Componente de Bootstrap que agrupa elementos del formulario */}
            <Form.Group className="mb-3">
              {/* Form.Label: Etiqueta del campo de formulario */}
              <Form.Label>Email</Form.Label>
              {/* Form.Control: Campo de entrada de Bootstrap */}
              <Form.Control
                type="email"                    // type: Tipo de input HTML5 (email)
                name="email"                    // name: Nombre del campo (usado en handleChange)
                placeholder="tu@email.com"      // placeholder: Texto de ejemplo
                value={formData.email}           // value: Valor controlado del input
                onChange={handleChange}          // onChange: Evento que se ejecuta al cambiar
                required                         // required: Atributo HTML5 para validación
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              {/* InputGroup: Componente de Bootstrap para agrupar input con botón */}
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'} // type: Alterna entre 'text' y 'password'
                  name="password"                  // name: Nombre del campo
                  placeholder="Tu contraseña"      // placeholder: Texto de ejemplo
                  value={formData.password}         // value: Valor controlado del input
                  onChange={handleChange}          // onChange: Evento que se ejecuta al cambiar
                  required                         // required: Atributo HTML5 para validación
                />
                {/* Button: Botón para mostrar/ocultar contraseña */}
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)} // onClick: Alterna el estado
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {/* Ícono de Font Awesome: cambia según el estado */}
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Button: Componente de Bootstrap para botones */}
            <Button
              type="submit"                     // type: Tipo de botón (submit envía el formulario)
              variant="primary"                 // variant: Estilo del botón de Bootstrap
              className="w-100"                 // className: Clase CSS (w-100 = width 100%)
              disabled={loading}                // disabled: Desactiva el botón mientras carga
            >
              {/* Condicional: Si está cargando muestra "Cargando...", sino "Iniciar Sesión" */}
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </Button>
          </Form>

          {/* Div con enlace para ir a la página de registro */}
          <div className="text-center mt-3">
            <p>
              ¿No tienes cuenta?{' '}
              {/* Link o botón para navegar a registro */}
              <Button
                variant="link"                  // variant="link": Estilo de enlace en Bootstrap
                onClick={() => navigate('/register')} // onClick: Navega a la página de registro
              >
                Regístrate aquí
              </Button>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

