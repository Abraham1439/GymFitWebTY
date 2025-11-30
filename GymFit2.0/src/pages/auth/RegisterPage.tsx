// Página de registro de usuarios
// Functional Component: Componente de React definido como función
import { useState } from 'react';
// useNavigate: Hook de react-router-dom para navegación programática
import { useNavigate } from 'react-router-dom';
// Importación de componentes de Bootstrap
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';

// Importación del hook de autenticación
import { useAuth } from '../../contexts/AuthContext';
// Importación de tipos e interfaces
import type { RegisterData } from '../../interfaces/gym.interfaces';
import { UserRole } from '../../interfaces/gym.interfaces';
// Importación de helpers de validación
import { isValidEmail, isValidPassword, passwordsMatch, isValidPhone } from '../../helpers';

// Componente de página de registro
// Functional Component: Componente funcional de React
export const RegisterPage = () => {
  // useNavigate: Hook que retorna una función para navegar programáticamente
  // Se utiliza para redirigir al usuario a la página de login después de un registro exitoso
  const navigate = useNavigate();
  
  // useAuth: Hook personalizado que retorna las funciones de autenticación
  // Se utiliza para ejecutar la función de registro que crea un nuevo usuario en el sistema
  const { register } = useAuth();

  // useState: Hook de React para gestionar estado local
  // Estado para los datos del formulario de registro
  const [formData, setFormData] = useState<RegisterData>({
    email: '',                    // Email del nuevo usuario (inicialmente vacío)
    password: '',                  // Contraseña del nuevo usuario (inicialmente vacía)
    confirmPassword: '',          // Confirmación de contraseña (inicialmente vacía)
    name: '',                     // Nombre del nuevo usuario (inicialmente vacío)
    role: UserRole.USER,          // Rol siempre USER: Solo el admin puede asignar otros roles
    phone: '',                    // Teléfono obligatorio (inicialmente vacío)
    address: ''                   // Dirección opcional (inicialmente vacía)
  });

  // Estado para mensajes de error
  const [error, setError] = useState<string>(''); // String vacío significa sin error

  // Estado para mensajes de éxito
  const [success, setSuccess] = useState<string>(''); // String vacío significa sin mensaje

  // Estado para indicar si se está procesando el registro
  const [loading, setLoading] = useState<boolean>(false); // false = no está cargando

  // Estados para controlar si las contraseñas están visibles o no
  const [showPassword, setShowPassword] = useState<boolean>(false); // false = oculta la contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); // false = oculta la confirmación

  // Estado para errores de validación en tiempo real
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
  }>({});

  /**
   * Valida un campo en tiempo real
   * @param name - Nombre del campo
   * @param value - Valor del campo
   */
  const validateField = (name: string, value: string): void => {
    const errors = { ...fieldErrors };

    if (name === 'name') {
      if (!value.trim()) {
        errors.name = 'El nombre es requerido';
      } else if (value.trim().length < 2) {
        errors.name = 'El nombre debe tener al menos 2 caracteres';
      } else {
        delete errors.name;
      }
    }

    if (name === 'email') {
      if (!value.trim()) {
        errors.email = 'El email es requerido';
      } else if (!isValidEmail(value)) {
        errors.email = 'Por favor ingresa un email valido';
      } else {
        delete errors.email;
      }
    }

    if (name === 'password') {
      if (!value.trim()) {
        errors.password = 'La contraseña es requerida';
      } else if (!isValidPassword(value)) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else {
        delete errors.password;
      }
      // Si hay confirmPassword, también validar que coincidan
      if (formData.confirmPassword) {
        if (!passwordsMatch(value, formData.confirmPassword)) {
          errors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete errors.confirmPassword;
        }
      }
    }

    if (name === 'confirmPassword') {
      if (!value.trim()) {
        errors.confirmPassword = 'Por favor confirma tu contraseña';
      } else if (!passwordsMatch(formData.password, value)) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      } else {
        delete errors.confirmPassword;
      }
    }

    if (name === 'phone') {
      // El teléfono es obligatorio
      if (!value.trim()) {
        errors.phone = 'El teléfono es obligatorio';
      } else if (!isValidPhone(value)) {
        errors.phone = 'Formato inválido. Debe empezar con + seguido de 11 dígitos (ejemplo: +56912345678)';
      } else {
        delete errors.phone;
      }
    }

    setFieldErrors(errors);
  };

  /**
   * Maneja el cambio en los campos del formulario
   * @param e - Evento de cambio del input
   * Event: Tipo de evento de React
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    // Obtiene el nombre y valor del campo que cambió
    const { name, value } = e.target;
    
    // Actualiza el estado del formulario con el nuevo valor
    // setState con función: Actualiza el estado basado en el estado anterior
    setFormData((prev) => ({
      ...prev,                    // Spread operator: Copia todas las propiedades anteriores
      [name]: value               // Computed property name: Actualiza solo el campo que cambió
    }));

    // Valida el campo en tiempo real
    validateField(name, value);

    // Limpia los mensajes cuando el usuario empieza a escribir
    if (error) {
      setError('');
    }
    if (success) {
      setSuccess('');
    }
  };

  /**
   * Maneja el envío del formulario de registro
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

    // Valida que la contraseña cumpla los requisitos
    if (!isValidPassword(formData.password)) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Valida que las contraseñas coincidan
    if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Valida que el nombre no esté vacío
    if (!formData.name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    // Valida que el teléfono esté presente y tenga formato válido
    if (!formData.phone || !formData.phone.trim()) {
      setError('El teléfono es obligatorio');
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setError('El teléfono debe tener formato válido: debe empezar con + seguido de 11 dígitos (ejemplo: +56912345678)');
      return;
    }

    // Activa el estado de carga
    setLoading(true);
    // Limpia cualquier error o mensaje anterior
    setError('');
    setSuccess('');

    try {
      // Intenta registrar el usuario con los datos del formulario
      // Siempre registra como USER: Solo el admin puede asignar otros roles
      // await: Palabra clave para esperar una promesa
      const registrationData = { ...formData, role: UserRole.USER };
      const registrationSuccess = await register(registrationData);

      if (registrationSuccess) {
        // Si el registro es exitoso, muestra mensaje de éxito
        setSuccess('Registro exitoso. Redirigiendo al login...');
        
        // Espera 1.5 segundos antes de redirigir al login
        // setTimeout: Función que ejecuta código después de un tiempo
        setTimeout(() => {
          navigate('/login');     // Navega a la página de login
        }, 1500);
      } else {
        // Si el registro falla, muestra un mensaje de error
        setError('Error al registrar. El email puede estar en uso.');
      }
    } catch (err) {
      // Manejo de errores: si ocurre un error inesperado
      setError('Error al registrar. Por favor intenta de nuevo.');
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
      <Card style={{ width: '500px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        {/* Card.Header: Encabezado de la tarjeta */}
        <Card.Header className="text-center bg-success text-white">
          <h3>Registro de Usuario</h3>
        </Card.Header>
        
        {/* Card.Body: Cuerpo de la tarjeta */}
        <Card.Body>
          {/* Form: Componente de Bootstrap para formularios */}
          <Form onSubmit={handleSubmit}>
            {/* Alert: Componente de Bootstrap para mostrar mensajes de error */}
            {/* Condicional: Si hay error, muestra el componente Alert */}
            {error && (
              <Alert variant="danger">
                {/* variant: Prop de Bootstrap que define el estilo del Alert */}
                {error}
              </Alert>
            )}

            {/* Alert: Componente de Bootstrap para mostrar mensajes de éxito */}
            {success && (
              <Alert variant="success">
                {success}
              </Alert>
            )}

            {/* Form.Group: Componente de Bootstrap que agrupa elementos del formulario */}
            <Form.Group className="mb-3">
              {/* Form.Label: Etiqueta del campo de formulario */}
              <Form.Label>Nombre Completo</Form.Label>
              {/* Form.Control: Campo de entrada de Bootstrap */}
              <Form.Control
                type="text"                     // type: Tipo de input HTML5 (texto)
                name="name"                     // name: Nombre del campo
                placeholder="Tu nombre completo" // placeholder: Texto de ejemplo
                value={formData.name}            // value: Valor controlado del input
                onChange={handleChange}          // onChange: Evento que se ejecuta al cambiar
                onBlur={(e) => validateField('name', e.target.value)} // onBlur: Valida al salir del campo
                isInvalid={!!fieldErrors.name}  // isInvalid: Marca el campo como inválido
                required                         // required: Atributo HTML5 para validación
              />
              {/* Form.Control.Feedback: Muestra mensaje de error */}
              {fieldErrors.name && (
                <Form.Control.Feedback type="invalid">
                  {fieldErrors.name}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"                    // type: Tipo de input HTML5 (email)
                name="email"                    // name: Nombre del campo
                placeholder="tu@email.com"      // placeholder: Texto de ejemplo
                value={formData.email}           // value: Valor controlado del input
                onChange={handleChange}          // onChange: Evento que se ejecuta al cambiar
                onBlur={(e) => validateField('email', e.target.value)} // onBlur: Valida al salir del campo
                isInvalid={!!fieldErrors.email}  // isInvalid: Marca el campo como inválido
                required                         // required: Atributo HTML5 para validación
              />
              {/* Form.Control.Feedback: Muestra mensaje de error */}
              {fieldErrors.email && (
                <Form.Control.Feedback type="invalid">
                  {fieldErrors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              {/* InputGroup: Componente de Bootstrap para agrupar input con botón */}
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'} // type: Alterna entre 'text' y 'password'
                  name="password"                  // name: Nombre del campo
                  placeholder="Minimo 6 caracteres" // placeholder: Texto de ejemplo
                  value={formData.password}        // value: Valor controlado del input
                  onChange={handleChange}          // onChange: Evento que se ejecuta al cambiar
                  onBlur={(e) => validateField('password', e.target.value)} // onBlur: Valida al salir del campo
                  isInvalid={!!fieldErrors.password} // isInvalid: Marca el campo como inválido
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
                {/* Form.Control.Feedback: Muestra mensaje de error */}
                {fieldErrors.password && (
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.password}
                  </Form.Control.Feedback>
                )}
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              {/* InputGroup: Componente de Bootstrap para agrupar input con botón */}
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'} // type: Alterna entre 'text' y 'password'
                  name="confirmPassword"           // name: Nombre del campo
                  placeholder="Repite tu contraseña" // placeholder: Texto de ejemplo
                  value={formData.confirmPassword}  // value: Valor controlado del input
                  onChange={handleChange}          // onChange: Evento que se ejecuta al cambiar
                  onBlur={(e) => validateField('confirmPassword', e.target.value)} // onBlur: Valida al salir del campo
                  isInvalid={!!fieldErrors.confirmPassword} // isInvalid: Marca el campo como inválido
                  required                         // required: Atributo HTML5 para validación
                />
                {/* Button: Botón para mostrar/ocultar confirmación de contraseña */}
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} // onClick: Alterna el estado
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {/* Ícono de Font Awesome: cambia según el estado */}
                  <i className={showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </Button>
                {/* Form.Control.Feedback: Muestra mensaje de error */}
                {fieldErrors.confirmPassword && (
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.confirmPassword}
                  </Form.Control.Feedback>
                )}
              </InputGroup>
            </Form.Group>

            {/* Campo de rol eliminado: Solo el administrador puede asignar roles */}
            {/* Todos los usuarios se registran como USER por defecto */}
            
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"                      // type: Tipo de input HTML5 (teléfono)
                name="phone"                    // name: Nombre del campo
                placeholder="Ej: +56912345678" // placeholder: Texto de ejemplo con formato
                value={formData.phone}           // value: Valor controlado del input
                onChange={handleChange}          // onChange: Evento que se ejecuta al cambiar
                onBlur={(e) => validateField('phone', e.target.value)} // onBlur: Valida al salir del campo
                isInvalid={!!fieldErrors.phone}  // isInvalid: Marca el campo como inválido
                required                         // required: Atributo HTML5 para validación
              />
              {/* Form.Text: Texto de ayuda debajo del campo */}
              <Form.Text className="text-muted">
                Formato: Debe empezar con + seguido de 11 dígitos (ejemplo: +56912345678)
              </Form.Text>
              {/* Form.Control.Feedback: Muestra mensaje de error */}
              {fieldErrors.phone && (
                <Form.Control.Feedback type="invalid">
                  {fieldErrors.phone}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dirección (Opcional)</Form.Label>
              <Form.Control
                type="text"                     // type: Tipo de input HTML5 (texto)
                name="address"                  // name: Nombre del campo
                placeholder="Tu dirección"      // placeholder: Texto de ejemplo
                value={formData.address}         // value: Valor controlado del input
                onChange={handleChange}          // onChange: Evento que se ejecuta al cambiar
              />
            </Form.Group>

            {/* Button: Componente de Bootstrap para botones */}
            <Button
              type="submit"                     // type: Tipo de botón (submit envía el formulario)
              variant="success"                 // variant: Estilo del botón de Bootstrap
              className="w-100"                 // className: Clase CSS (w-100 = width 100%)
              disabled={loading}                // disabled: Desactiva el botón mientras carga
            >
              {/* Condicional: Si está cargando muestra "Registrando...", sino "Registrarse" */}
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Form>

          {/* Div con enlace para ir a la página de login */}
          <div className="text-center mt-3">
            <p>
              ¿Ya tienes cuenta?{' '}
              {/* Link o botón para navegar a login */}
              <Button
                variant="link"                  // variant="link": Estilo de enlace en Bootstrap
                onClick={() => navigate('/login')} // onClick: Navega a la página de login
              >
                Inicia sesión aquí
              </Button>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

