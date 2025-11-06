// Página donde los usuarios pueden ver y contratar entrenadores
// Functional Component: Componente de React definido como función
import { useState, useEffect } from 'react';
// useNavigate: Hook de react-router-dom para navegación programática
import { useNavigate } from 'react-router-dom';
// Importación de componentes de Bootstrap
import { Container, Row, Col, Card, Button, Badge, Alert, Modal } from 'react-bootstrap';

// Importación de hooks y helpers
import { useAuth } from '../../contexts/AuthContext';
import { getFromLocalStorage, saveToLocalStorage, generateId } from '../../helpers';
// Importación de URLs de imágenes
import { TRAINER_IMAGES } from '../../mockData';
// Importación de constantes de colores
import { COLORS } from '../../constants';
// Importación de tipos e interfaces
import type { Trainer, TrainerHire } from '../../interfaces/gym.interfaces';
import { UserRole } from '../../interfaces/gym.interfaces';

// Constantes para las claves de localStorage
const STORAGE_KEY_TRAINERS = 'gymTrainers';    // Clave para almacenar entrenadores
const STORAGE_KEY_HIRES = 'gymHires';          // Clave para almacenar contrataciones

// Componente de página de entrenadores
// Functional Component: Componente funcional de React
export const TrainersPage = () => {
  // useNavigate: Hook que retorna una función para navegar programáticamente
  const navigate = useNavigate();
  
  // useAuth: Hook personalizado que retorna los datos de autenticación
  const { authData } = useAuth();

  // useState: Hook de React para gestionar estado local
  // Estado para almacenar los entrenadores disponibles
  const [trainers, setTrainers] = useState<Trainer[]>([]); // Array vacío inicialmente

  // Estado para el modal de contratación
  const [showHireModal, setShowHireModal] = useState<boolean>(false); // false = modal cerrado

  // Estado para el entrenador seleccionado para contratar
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null); // null = ninguno seleccionado

  // Estado para mensajes de éxito/error
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null); // null = sin mensaje

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Efecto que se ejecuta al montar el componente para cargar entrenadores
  useEffect(() => {
    // Carga los entrenadores desde localStorage
    loadTrainers();
  }, []); // Array de dependencias vacío: se ejecuta solo al montar

  /**
   * Carga los entrenadores desde localStorage
   * void: Tipo que indica que la función no retorna valor
   */
  const loadTrainers = (): void => {
    // Obtiene los entrenadores guardados en localStorage
    const savedTrainers = getFromLocalStorage<Trainer[]>(STORAGE_KEY_TRAINERS);

    // Si no hay entrenadores guardados, inicializa con entrenadores de ejemplo
    if (!savedTrainers || savedTrainers.length === 0) {
      // Array de entrenadores de ejemplo
      const initialTrainers: Trainer[] = [
        // Entrenador 1
        {
          id: generateId(),                    // Genera un ID único
          userId: generateId(),                // ID del usuario entrenador
          name: 'Carlos Rodríguez',            // Nombre del entrenador
          specialization: 'Fuerza y Potencia', // Especialización
          experience: 5,                        // Años de experiencia
          price: 50,                            // Precio por hora
          description: 'Especialista en entrenamiento de fuerza y levantamiento de pesas', // Descripción
          rating: 4.8,                         // Calificación (0-5)
          image: TRAINER_IMAGES.CARLOS,        // URL de imagen específica de Carlos
          available: true                       // Disponible
        },
        // Entrenador 2
        {
          id: generateId(),
          userId: generateId(),
          name: 'María González',
          specialization: 'Cardio y Pérdida de Peso',
          experience: 3,
          price: 40,
          description: 'Experta en rutinas de cardio y programas de pérdida de peso',
          rating: 4.6,
          image: TRAINER_IMAGES.DEFAULT,        // URL de imagen desde mockData
          available: true
        },
        // Entrenador 3
        {
          id: generateId(),
          userId: generateId(),
          name: 'Juan Pérez',
          specialization: 'Calistenia y Movimiento',
          experience: 7,
          price: 60,
          description: 'Especialista en entrenamiento con peso corporal y movilidad',
          rating: 4.9,
          image: TRAINER_IMAGES.DEFAULT,       // URL de imagen desde mockData
          available: true
        },
        // Entrenador 4
        {
          id: generateId(),
          userId: generateId(),
          name: 'Ana Martínez',
          specialization: 'Yoga y Flexibilidad',
          experience: 4,
          price: 45,
          description: 'Instructora certificada de yoga y estiramientos',
          rating: 4.7,
          image: TRAINER_IMAGES.DEFAULT,       // URL de imagen desde mockData
          available: true
        },
        // Entrenador 5: Hany Rambod
        {
          id: generateId(),
          userId: generateId(),
          name: 'Hany Rambod',
          specialization: 'Culturismo de Élite',
          experience: 25,
          price: 150,
          description: `Hany Rambod, apodado "The Pro Creator", es un entrenador de culturismo de élite y el fundador de Evogen Nutrition.

Es más conocido por:
• Entrenar a múltiples campeones de Mr. Olympia, sumando más de 25 títulos en total.
• Ser el creador del revolucionario sistema de entrenamiento FST-7 (Fascia Stretch Training-7).
• Haber entrenado a leyendas del deporte como Phil Heath, Jay Cutler, Chris Bumstead, Hadi Choopan y Derek Lunsford.

Su enfoque combina una sólida base científica (licenciatura en Biología) con décadas de experiencia práctica para maximizar el potencial genético de sus atletas.`,
          rating: 5.0,
          image: TRAINER_IMAGES.HANY_RAMBOD,   // URL de imagen específica de Hany Rambod
          available: true
        }
      ];

      // Guarda los entrenadores iniciales en localStorage
      saveToLocalStorage(STORAGE_KEY_TRAINERS, initialTrainers);
      // Actualiza el estado con los entrenadores iniciales
      setTrainers(initialTrainers);
    } else {
      // Si ya hay entrenadores, actualiza las imágenes si tienen URLs de placeholder o si es Carlos
      let updatedTrainers = savedTrainers.map((trainer) => {
        // Si la imagen es un placeholder, actualízala
        const isPlaceholder = trainer.image.includes('placeholder.com') || 
                             trainer.image.includes('via.placeholder');
        
        // Si es Carlos Rodríguez, actualiza su imagen
        if (trainer.name === 'Carlos Rodríguez' || trainer.name === 'Carlos Entrenador') {
          return {
            ...trainer,
            image: TRAINER_IMAGES.CARLOS
          };
        }
        
        if (isPlaceholder) {
          return {
            ...trainer,
            image: TRAINER_IMAGES.DEFAULT
          };
        }
        return trainer;
      });
      
      // Verifica si Hany Rambod ya existe en los entrenadores
      const hasHanyRambod = updatedTrainers.some((trainer) => 
        trainer.name === 'Hany Rambod'
      );
      
      // Si no existe Hany Rambod, agregarlo
      if (!hasHanyRambod) {
        const hanyRambod: Trainer = {
          id: generateId(),
          userId: generateId(),
          name: 'Hany Rambod',
          specialization: 'Culturismo de Élite',
          experience: 25,
          price: 150,
          description: `Hany Rambod, apodado "The Pro Creator", es un entrenador de culturismo de élite y el fundador de Evogen Nutrition.

Es más conocido por:

• Entrenar a múltiples campeones de Mr. Olympia, sumando más de 25 títulos en total.

• Ser el creador del revolucionario sistema de entrenamiento FST-7 (Fascia Stretch Training-7).

• Haber entrenado a leyendas del deporte como Phil Heath, Jay Cutler, Chris Bumstead, Hadi Choopan y Derek Lunsford.

Su enfoque combina una sólida base científica (licenciatura en Biología) con décadas de experiencia práctica para maximizar el potencial genético de sus atletas.`,
          rating: 5.0,
          image: TRAINER_IMAGES.HANY_RAMBOD,
          available: true
        };
        
        updatedTrainers.push(hanyRambod);
      }
      
      // Guarda los entrenadores actualizados en localStorage
      saveToLocalStorage(STORAGE_KEY_TRAINERS, updatedTrainers);
      // Actualiza el estado con los entrenadores actualizados
      setTrainers(updatedTrainers);
    }
  };

  /**
   * Abre el modal de contratación para un entrenador
   * @param trainer - Entrenador a contratar
   */
  const handleHireClick = (trainer: Trainer): void => {
    // Verifica que el usuario esté autenticado
    if (!authData.isAuthenticated || !authData.user) {
      setMessage({ type: 'danger', text: 'Debes iniciar sesión para contratar entrenadores' });
      // setTimeout: Función que ejecuta código después de un tiempo
      setTimeout(() => setMessage(null), 3000); // Limpia el mensaje después de 3 segundos
      return;                     // Sale de la función si no está autenticado
    }

    // Verifica que el usuario tenga rol USER (no admin ni trainer)
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

    // Establece el entrenador seleccionado
    setSelectedTrainer(trainer);
    // Abre el modal
    setShowHireModal(true);
  };

  /**
   * Confirma la contratación del entrenador
   */
  const confirmHire = (): void => {
    // Verifica que haya un entrenador seleccionado y usuario autenticado
    if (!selectedTrainer || !authData.user) {
      return;                     // Sale de la función si no hay datos
    }

    try {
      // Obtiene las contrataciones existentes
      const hires = getFromLocalStorage<TrainerHire[]>(STORAGE_KEY_HIRES) || [];

      // Verifica si el usuario ya contrató este entrenador
      // some: Método de array que retorna true si algún elemento cumple la condición
      const alreadyHired = hires.some(
        (h) => h.userId === authData.user!.id && h.trainerId === selectedTrainer.id && h.status === 'active'
      );

      if (alreadyHired) {
        setMessage({ type: 'danger', text: 'Ya tienes contratado a este entrenador' });
        setTimeout(() => setMessage(null), 3000);
        setShowHireModal(false); // Cierra el modal
        return;
      }

      // Crea una nueva contratación
      const newHire: TrainerHire = {
        id: generateId(),                    // Genera un ID único
        userId: authData.user.id,            // ID del usuario que contrata
        trainerId: selectedTrainer.id,       // ID del entrenador contratado
        startDate: new Date().toISOString(), // Fecha de inicio (hoy)
        status: 'active',                     // Estado: activa
        messages: []                          // Array de mensajes vacío inicialmente
      };

      // Agrega la nueva contratación al array
      hires.push(newHire);

      // Guarda las contrataciones actualizadas en localStorage
      saveToLocalStorage(STORAGE_KEY_HIRES, hires);

      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: `¡Has contratado a ${selectedTrainer.name}!` });
      setTimeout(() => setMessage(null), 3000);

      // Cierra el modal
      setShowHireModal(false);
      // Limpia el entrenador seleccionado
      setSelectedTrainer(null);

    } catch (error) {
      // Manejo de errores
      console.error('Error al contratar entrenador:', error);
      setMessage({ type: 'danger', text: 'Error al contratar el entrenador' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // JSX: Sintaxis de JavaScript que permite escribir HTML en JavaScript
  return (
    // Container: Componente de Bootstrap que centra el contenido
    // fluid: Container sin padding lateral, p-0: sin padding
    // style: Estilos inline para eliminar cualquier margin/padding adicional
    <Container fluid className="p-0" style={{ marginTop: 0, paddingTop: 0 }}>
      {/* Hero Image: Imagen de banner de gimnasio al inicio */}
      {/* style: Estilos inline para la imagen hero */}
      <div 
        style={{
          width: '100%',
          height: '250px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          marginTop: 0,
          marginBottom: 0
        }}
      >
        {/* Overlay: Capa oscura semitransparente sobre la imagen para mejorar legibilidad del texto */}
        <div 
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexDirection: 'column',
            paddingTop: '40px',
            paddingLeft: '20px',
            paddingRight: '20px'
          }}
        >
          {/* Título sobre la imagen */}
          <h1 className="text-white display-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Nuestros Entrenadores
          </h1>
        </div>
      </div>

      {/* Container: Contenedor principal del contenido */}
      <Container className="pt-1 pb-4">
        {/* Row: Componente de Bootstrap para crear filas */}
        <Row>
          {/* Col: Componente de Bootstrap para crear columnas */}
          <Col>
            {/* Alert: Componente de Bootstrap para mostrar mensajes */}
            {message && (
              <Alert variant={message.type} className="mb-3">
                {message.text}
              </Alert>
            )}

            {/* Row: Fila para mostrar los entrenadores */}
            <Row>
              {/* map: Método de array que itera sobre los entrenadores */}
              {/* Col: Columna para cada entrenador (responsive: 2 columnas en desktop, 1 en móvil) */}
              {trainers.map((trainer) => (
                <Col key={trainer.id} xs={12} md={6} lg={4} className="mb-4">
                  {/* Card: Componente de Bootstrap para crear tarjetas */}
                  <Card className="h-100">
                    {/* Imagen del entrenador clickeable */}
                    <div
                      onClick={() => navigate(`/trainer/${trainer.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Img
                        variant="top"
                        src={trainer.image}
                        alt={trainer.name}
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                    </div>
                    
                    {/* Card.Body: Cuerpo de la tarjeta */}
                    <Card.Body className="d-flex flex-column">
                      {/* Badge: Componente de Bootstrap para etiquetas de disponibilidad */}
                      {/* bg: Color según disponibilidad */}
                      <Badge
                        bg={trainer.available ? 'success' : 'secondary'}
                        className="mb-2"
                      >
                        {trainer.available ? 'Disponible' : 'No Disponible'}
                      </Badge>

                      {/* Card.Title: Título de la tarjeta (nombre del entrenador) clickeable */}
                      <Card.Title
                        onClick={() => navigate(`/trainer/${trainer.id}`)}
                        style={{
                          cursor: 'pointer',
                          color: COLORS.COLOR_3,
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.COLOR_2)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.COLOR_3)}
                      >
                        {trainer.name}
                      </Card.Title>

                      {/* Card.Text: Texto de la tarjeta (especialización) */}
                      <Card.Text className="text-muted">
                        <strong>Especialización:</strong> {trainer.specialization}
                      </Card.Text>

                      {/* Card.Text: Experiencia */}
                      <Card.Text className="text-muted">
                        <strong>Experiencia:</strong> {trainer.experience} años
                      </Card.Text>

                      {/* Card.Text: Calificación */}
                      <Card.Text className="text-muted">
                        <strong>Calificación:</strong> ⭐ {trainer.rating.toFixed(1)} {/* toFixed: Formatea a 1 decimal */}
                      </Card.Text>

                      {/* Card.Text: Descripción (solo primera parte) */}
                      <Card.Text className="text-muted">
                        {trainer.description.split('\n')[0].substring(0, 100)}
                        {trainer.description.split('\n')[0].length > 100 ? '...' : ''}
                      </Card.Text>

                      {/* Información del precio y botón */}
                      <div className="mt-auto">
                        {/* Precio por hora */}
                        <h5 style={{ color: COLORS.COLOR_3 }} className="mb-3">
                          ${trainer.price}/hora
                        </h5>

                        {/* Button: Botón para contratar */}
                        {/* variant: Estilo del botón */}
                        {/* className: Clase CSS (w-100 = width 100%) */}
                        {/* onClick: Ejecuta la función de contratar */}
                        {/* disabled: Desactiva si no está disponible o no es usuario */}
                        <Button
                          variant="primary"
                          className="w-100"
                          onClick={() => handleHireClick(trainer)}
                          disabled={!trainer.available || !authData.isAuthenticated || authData.user?.role !== UserRole.USER}
                          style={{ backgroundColor: COLORS.COLOR_3, borderColor: COLORS.COLOR_3 }}
                        >
                          {/* Condicional: Si no está disponible muestra "No Disponible", sino "Contratar" */}
                          {trainer.available ? 'Contratar' : 'No Disponible'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Mensaje si no hay entrenadores */}
            {trainers.length === 0 && (
              <Alert variant="info" className="mt-4">
                No hay entrenadores disponibles.
              </Alert>
            )}
          </Col>
        </Row>

      {/* Modal: Componente de Bootstrap para mostrar diálogos */}
      <Modal show={showHireModal} onHide={() => setShowHireModal(false)}>
        {/* Modal.Header: Encabezado del modal */}
        <Modal.Header closeButton>
          {/* closeButton: Muestra un botón de cerrar */}
          <Modal.Title>Confirmar Contratación</Modal.Title>
        </Modal.Header>
        
        {/* Modal.Body: Cuerpo del modal */}
        <Modal.Body>
          {selectedTrainer && (
            <>
              {/* Información del entrenador seleccionado */}
              <p>
                ¿Estás seguro de que deseas contratar a <strong>{selectedTrainer.name}</strong>?
              </p>
              <p>
                <strong>Especialización:</strong> {selectedTrainer.specialization}
              </p>
              <p>
                <strong>Precio:</strong> ${selectedTrainer.price}/hora
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
    </Container>
  );
};

