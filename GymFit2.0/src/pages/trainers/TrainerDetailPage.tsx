// Página de detalles de un entrenador específico
// Functional Component: Componente de React definido como función
import { useState, useEffect } from 'react';
// useParams: Hook de react-router-dom para obtener parámetros de la URL
// useNavigate: Hook de react-router-dom para navegación programática
import { useParams, useNavigate } from 'react-router-dom';
// Importación de componentes de Bootstrap
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Modal,
} from 'react-bootstrap';

// Importación de hooks y helpers
import { useAuth } from '../../contexts/AuthContext';
import { getFromLocalStorage, saveToLocalStorage, generateId } from '../../helpers';
// Importación de constantes de colores
import { COLORS } from '../../constants';
// Importación de tipos e interfaces
import type { Trainer, TrainerHire } from '../../interfaces/gym.interfaces';
import { UserRole } from '../../interfaces/gym.interfaces';

// Constante para la clave de localStorage
const STORAGE_KEY_TRAINERS = 'gymTrainers';
const STORAGE_KEY_HIRES = 'gymHires';

// Componente de página de detalles de entrenador
export const TrainerDetailPage = () => {
  // useParams: Hook que obtiene los parámetros de la URL
  // Se utiliza para extraer el ID del entrenador desde la ruta /trainer/:id
  const { id } = useParams<{ id: string }>();
  
  // useNavigate: Hook que retorna una función para navegar programáticamente
  // Se utiliza para redirigir al usuario de vuelta a la lista de entrenadores
  const navigate = useNavigate();
  
  // useAuth: Hook personalizado que retorna los datos de autenticación
  // Se utiliza para verificar si el usuario está autenticado antes de permitir la contratación
  const { authData } = useAuth();

  // useState: Hook de React para gestionar estado local
  // Estado para almacenar el entrenador actual que se está mostrando
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  
  // Estado para controlar si se está cargando el entrenador (muestra pantalla de carga)
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado para mensajes de éxito/error que se muestran al usuario
  const [message, setMessage] = useState<{
    type: 'success' | 'danger';
    text: string;
  } | null>(null);
  
  // Estado para controlar si el modal de confirmación de contratación está visible
  const [showHireModal, setShowHireModal] = useState<boolean>(false);

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Carga el entrenador cuando cambia el ID de la URL (cuando el usuario navega entre entrenadores)
  useEffect(() => {
    if (id) {
      loadTrainer(id);
    }
  }, [id]); // Se ejecuta cada vez que el parámetro 'id' cambia

  /**
   * Carga un entrenador específico desde localStorage
   * @param trainerId - ID del entrenador a cargar
   */
  const loadTrainer = (trainerId: string): void => {
    setLoading(true);
    
    // Simula un pequeño delay para mostrar la pantalla de carga
    setTimeout(() => {
      // Obtiene todos los entrenadores desde localStorage
      const trainers = getFromLocalStorage<Trainer[]>(STORAGE_KEY_TRAINERS) || [];
      
      // Busca el entrenador por ID
      const foundTrainer = trainers.find((t) => t.id === trainerId);
      
      if (foundTrainer) {
        setTrainer(foundTrainer);
      } else {
        setMessage({
          type: 'danger',
          text: 'Entrenador no encontrado',
        });
      }
      
      setLoading(false);
    }, 800); // 800ms de delay para mostrar la pantalla de carga
  };

  /**
   * Maneja el botón de contratar - abre el modal de confirmación
   */
  const handleHire = (): void => {
    if (!trainer) return;

    // Verifica que el usuario esté autenticado
    if (!authData.isAuthenticated || !authData.user) {
      setMessage({ type: 'danger', text: 'Debes iniciar sesión para contratar entrenadores' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Verifica que el usuario tenga rol USER
    if (authData.user.role !== UserRole.USER) {
      setMessage({ type: 'danger', text: 'Solo los usuarios pueden contratar entrenadores' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Verifica que el entrenador esté disponible
    if (!trainer.available) {
      setMessage({ type: 'danger', text: 'Este entrenador no está disponible' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Abre el modal de confirmación
    setShowHireModal(true);
  };

  /**
   * Confirma la contratación del entrenador
   */
  const confirmHire = (): void => {
    // Verifica que haya un entrenador y usuario autenticado
    if (!trainer || !authData.user) {
      return;
    }

    try {
      // Obtiene las contrataciones existentes
      const hires = getFromLocalStorage<TrainerHire[]>(STORAGE_KEY_HIRES) || [];

      // Verifica si el usuario ya contrató este entrenador
      const alreadyHired = hires.some(
        (h) => h.userId === authData.user!.id && h.trainerId === trainer.id && h.status === 'active'
      );

      if (alreadyHired) {
        setMessage({ type: 'danger', text: 'Ya tienes contratado a este entrenador' });
        setTimeout(() => setMessage(null), 3000);
        setShowHireModal(false);
        return;
      }

      // Crea una nueva contratación
      const newHire: TrainerHire = {
        id: generateId(),
        userId: authData.user.id,
        trainerId: trainer.id,
        startDate: new Date().toISOString(),
        status: 'active',
        messages: []
      };

      // Agrega la nueva contratación al array
      hires.push(newHire);

      // Guarda las contrataciones actualizadas en localStorage
      saveToLocalStorage(STORAGE_KEY_HIRES, hires);

      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: `¡Has contratado a ${trainer.name}!` });
      setTimeout(() => setMessage(null), 3000);

      // Cierra el modal
      setShowHireModal(false);

    } catch (error) {
      // Manejo de errores
      console.error('Error al contratar entrenador:', error);
      setMessage({ type: 'danger', text: 'Error al contratar el entrenador' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Si está cargando, muestra pantalla de carga estilizada
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: COLORS.COLOR_5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="text-center">
          {/* Spinner circular */}
          <div
            className="spinner-border"
            role="status"
            style={{
              width: '4rem',
              height: '4rem',
              borderWidth: '0.4rem',
              borderColor: COLORS.COLOR_2,
              borderRightColor: 'transparent',
              marginBottom: '1.5rem',
            }}
          >
            <span className="visually-hidden">Cargando...</span>
          </div>
          
          {/* Texto principal con ícono */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <i className="fa-solid fa-user-tie" style={{ color: COLORS.COLOR_2, fontSize: '1.2rem' }}></i>
            <h4 style={{ color: COLORS.COLOR_2, fontWeight: 'bold', margin: 0 }}>
              Cargando entrenador...
            </h4>
          </div>
          
          {/* Texto secundario */}
          <p style={{ color: COLORS.COLOR_2, fontSize: '0.9rem', margin: 0 }}>
            Preparando los detalles
          </p>
        </div>
      </div>
    );
  }

  // Si no se encontró el entrenador, muestra mensaje de error
  if (!trainer) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Entrenador no encontrado</Alert.Heading>
          <p>El entrenador que buscas no existe o ha sido eliminado.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/trainers')}
            style={{ backgroundColor: COLORS.COLOR_3, borderColor: COLORS.COLOR_3 }}
          >
            Volver a Entrenadores
          </Button>
        </Alert>
      </Container>
    );
  }

  // JSX: Sintaxis de JavaScript que permite escribir HTML en JavaScript
  return (
    <Container fluid className="p-0" style={{ marginTop: 0, paddingTop: 0 }}>
      {/* Container: Contenedor principal del contenido */}
      <Container className="py-4">
        <Row>
          <Col>
            {/* Alert: Mensaje de éxito/error */}
            {message && (
              <Alert variant={message.type} className="mb-4">
                {message.text}
              </Alert>
            )}

            <Row>
              {/* Columna izquierda: Imagen del entrenador */}
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={trainer.image}
                    alt={trainer.name}
                    style={{
                      height: '500px',
                      objectFit: 'cover',
                      width: '100%',
                    }}
                  />
                </Card>
              </Col>

              {/* Columna derecha: Información del entrenador */}
              <Col md={6}>
                <Card>
                  <Card.Body>
                    {/* Badge: Etiqueta de disponibilidad */}
                    <Badge
                      bg={trainer.available ? 'success' : 'secondary'}
                      className="mb-3"
                      style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                    >
                      {trainer.available ? 'Disponible' : 'No Disponible'}
                    </Badge>

                    {/* Título del entrenador */}
                    <Card.Title className="display-5 mb-3">{trainer.name}</Card.Title>

                    {/* Especialización */}
                    <div className="mb-3">
                      <h5 className="text-muted mb-2">
                        <i className="fa-solid fa-dumbbell me-2"></i>
                        {trainer.specialization}
                      </h5>
                    </div>

                    {/* Información adicional */}
                    <div className="mb-4">
                      <p className="text-muted mb-2">
                        <strong>Experiencia:</strong> {trainer.experience} años
                      </p>
                      <p className="text-muted mb-2">
                        <strong>Calificación:</strong>{' '}
                        <i className="fa-solid fa-star text-warning"></i>{' '}
                        {trainer.rating.toFixed(1)}
                      </p>
                      <h2 style={{ color: COLORS.COLOR_3 }} className="mb-2">
                        ${trainer.price}/hora
                      </h2>
                    </div>

                    {/* Descripción */}
                    <div className="mb-4">
                      <h5>Acerca de {trainer.name}</h5>
                      <p className="text-muted" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                        {trainer.description}
                      </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleHire}
                        disabled={!trainer.available || !authData.isAuthenticated || authData.user?.role !== UserRole.USER}
                        className="mb-2"
                        style={{ backgroundColor: COLORS.COLOR_3, borderColor: COLORS.COLOR_3 }}
                      >
                        <i className="fa-solid fa-handshake me-2"></i>
                        Contratar Entrenador
                      </Button>

                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate('/trainers')}
                        style={{ borderColor: COLORS.COLOR_2, color: COLORS.COLOR_2 }}
                      >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Volver a Entrenadores
                      </Button>
                    </div>

                    {/* Información adicional */}
                    <hr className="my-4" />
                    <div className="text-muted small">
                      <p className="mb-1">
                        <i className="fa-solid fa-shield-alt me-2"></i>
                        Entrenamiento profesional certificado
                      </p>
                      <p className="mb-1">
                        <i className="fa-solid fa-comments me-2"></i>
                        Comunicación directa con el entrenador
                      </p>
                      <p className="mb-0">
                        <i className="fa-solid fa-calendar-check me-2"></i>
                        Horarios flexibles según disponibilidad
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Modal: Componente de Bootstrap para mostrar diálogos */}
      <Modal show={showHireModal} onHide={() => setShowHireModal(false)}>
        {/* Modal.Header: Encabezado del modal */}
        <Modal.Header closeButton>
          {/* closeButton: Muestra un botón de cerrar */}
          <Modal.Title>Confirmar Contratación</Modal.Title>
        </Modal.Header>
        
        {/* Modal.Body: Cuerpo del modal */}
        <Modal.Body>
          {trainer && (
            <>
              {/* Información del entrenador seleccionado */}
              <p>
                ¿Estás seguro de que deseas contratar a <strong>{trainer.name}</strong>?
              </p>
              <p>
                <strong>Especialización:</strong> {trainer.specialization}
              </p>
              <p>
                <strong>Precio:</strong> ${trainer.price}/hora
              </p>
              <p className="text-muted">
                Una vez contratado, podrás comunicarte con tu entrenador desde tu panel de usuario.
              </p>
            </>
          )}
        </Modal.Body>
        
        {/* Modal.Footer: Pie del modal */}
        <Modal.Footer>
          {/* Button: Botón para cancelar */}
          <Button variant="secondary" onClick={() => setShowHireModal(false)}>
            Cancelar
          </Button>
          {/* Button: Botón para confirmar */}
          <Button 
            variant="primary" 
            onClick={confirmHire}
            style={{ backgroundColor: COLORS.COLOR_3, borderColor: COLORS.COLOR_3 }}
          >
            Confirmar Contratación
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

