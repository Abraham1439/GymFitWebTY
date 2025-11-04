// Panel de entrenador donde puede ver sus clientes y responder mensajes
// Functional Component: Componente de React definido como función
import { useState, useEffect } from 'react';
// Importación de componentes de Bootstrap
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';

// Importación de hooks y helpers
import { useAuth } from '../../contexts/AuthContext';
import { getFromLocalStorage, saveToLocalStorage, generateId, formatDate } from '../../helpers';
// Importación de tipos e interfaces
import type { TrainerHire, User, Message, Trainer } from '../../interfaces/gym.interfaces';
import { UserRole } from '../../interfaces/gym.interfaces';

// Constantes para las claves de localStorage
const STORAGE_KEY_HIRES = 'gymHires';          // Clave para almacenar contrataciones
const STORAGE_KEY_USERS = 'gymUsers';          // Clave para almacenar usuarios
const STORAGE_KEY_TRAINERS = 'gymTrainers';    // Clave para almacenar entrenadores

// Componente de panel de entrenador
// Functional Component: Componente funcional de React
export const TrainerPanel = () => {
  // useAuth: Hook personalizado que retorna los datos de autenticación
  const { authData } = useAuth();

  // useState: Hook de React para gestionar estado local
  // Estado para almacenar las contrataciones donde el entrenador está involucrado
  const [hires, setHires] = useState<TrainerHire[]>([]); // Array vacío inicialmente

  // Estado para almacenar todos los usuarios (para mostrar nombres)
  const [users, setUsers] = useState<User[]>([]); // Array vacío inicialmente

  // Estado para el modal de respuesta de mensaje
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false); // false = modal cerrado

  // Estado para la contratación seleccionada para responder
  const [selectedHire, setSelectedHire] = useState<TrainerHire | null>(null); // null = ninguno seleccionado

  // Estado para el mensaje de respuesta
  const [responseText, setResponseText] = useState<string>(''); // String vacío inicialmente

  // Estado para mensajes de éxito/error
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null); // null = sin mensaje

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Efecto que se ejecuta al montar el componente para cargar datos
  useEffect(() => {
    // Carga los datos del entrenador
    loadTrainerData();
  }, [authData.user]); // Se ejecuta cuando cambia el usuario autenticado

  /**
   * Carga los datos del entrenador (clientes contratados)
   * void: Tipo que indica que la función no retorna valor
   */
  const loadTrainerData = (): void => {
    // Verifica que el usuario esté autenticado y sea entrenador
    if (!authData.user || authData.user.role !== UserRole.TRAINER) {
      return;                     // Sale de la función si no hay usuario o no es entrenador
    }

    // Obtiene el ID del entrenador desde su perfil de entrenador
    // Primero obtiene todos los entrenadores para encontrar el que corresponde al usuario
    const allTrainers = getFromLocalStorage<Trainer[]>(STORAGE_KEY_TRAINERS) || [];
    let trainer = allTrainers.find((t) => t.userId === authData.user!.id);

    // Si no se encuentra el perfil de entrenador, lo crea automáticamente
    if (!trainer) {
      // Crea un nuevo perfil de entrenador para el usuario
      const newTrainer: Trainer = {
        id: generateId(),                    // ID único del perfil de entrenador
        userId: authData.user.id,            // ID del usuario entrenador
        name: authData.user.name,            // Nombre del entrenador
        specialization: 'General',           // Especialización por defecto
        experience: 0,                        // Años de experiencia (0 por defecto)
        price: 0,                            // Precio por hora (0 por defecto)
        description: 'Entrenador disponible', // Descripción
        rating: 0,                          // Calificación inicial (0)
        image: 'https://via.placeholder.com/300x300?text=Trainer', // Imagen placeholder
        available: true                       // Disponible por defecto
      };
      
      // Agrega el nuevo entrenador al array
      allTrainers.push(newTrainer);
      
      // Guarda los entrenadores actualizados en localStorage
      saveToLocalStorage(STORAGE_KEY_TRAINERS, allTrainers);
      
      // Usa el entrenador recién creado
      trainer = newTrainer;
    }

    // Obtiene todas las contrataciones desde localStorage
    const allHires = getFromLocalStorage<TrainerHire[]>(STORAGE_KEY_HIRES) || [];
    // Filtra solo las contrataciones donde este entrenador está involucrado
    // filter: Método de array que retorna elementos que cumplen una condición
    const trainerHires = allHires.filter((h) => h.trainerId === trainer.id);
    // Actualiza el estado con las contrataciones del entrenador
    setHires(trainerHires);

    // Carga todos los usuarios para mostrar nombres
    const allUsers = getFromLocalStorage<User[]>(STORAGE_KEY_USERS) || [];
    setUsers(allUsers);
  };

  /**
   * Obtiene el nombre de un usuario por su ID
   * @param userId - ID del usuario
   * @returns Nombre del usuario o "Usuario no encontrado"
   */
  const getUserName = (userId: string): string => {
    // find: Método de array que retorna el primer elemento que cumple la condición
    const user = users.find((u) => u.id === userId);
    // Retorna el nombre del usuario o un mensaje por defecto
    return user ? user.name : 'Usuario no encontrado';
  };

  /**
   * Abre el modal para responder a un mensaje de un cliente
   * @param hire - Contratación del cliente
   */
  const handleRespondMessage = (hire: TrainerHire): void => {
    // Establece la contratación seleccionada
    setSelectedHire(hire);
    // Limpia el texto de la respuesta
    setResponseText('');
    // Abre el modal
    setShowResponseModal(true);
  };

  /**
   * Envía una respuesta al cliente
   */
  const sendResponse = (): void => {
    // Verifica que haya una contratación seleccionada, usuario autenticado y texto de respuesta
    if (!selectedHire || !authData.user || !responseText.trim()) {
      return;                     // Sale de la función si faltan datos
    }

    try {
      // Obtiene todas las contrataciones
      const allHires = getFromLocalStorage<TrainerHire[]>(STORAGE_KEY_HIRES) || [];

      // Crea un nuevo mensaje
      const newMessage: Message = {
        id: generateId(),                    // Genera un ID único
        senderId: authData.user.id,         // ID del remitente (entrenador)
        senderName: authData.user.name,     // Nombre del remitente
        content: responseText.trim(),        // Contenido del mensaje (sin espacios al inicio/final)
        timestamp: new Date().toISOString() // Fecha y hora del mensaje
      };

      // Actualiza la contratación agregando el nuevo mensaje
      // map: Método de array que crea un nuevo array transformando cada elemento
      const updatedHires = allHires.map((h) => {
        if (h.id === selectedHire.id) {
          // Si es la contratación seleccionada, agrega el mensaje
          return {
            ...h,                              // Spread operator: copia todas las propiedades
            messages: [...h.messages, newMessage] // Agrega el nuevo mensaje al array
          };
        }
        return h;                              // Retorna la contratación sin cambios
      });

      // Guarda las contrataciones actualizadas en localStorage
      saveToLocalStorage(STORAGE_KEY_HIRES, updatedHires);

      // Actualiza el estado local
      const allTrainers = getFromLocalStorage<Trainer[]>(STORAGE_KEY_TRAINERS) || [];
      const trainer = allTrainers.find((t) => t.userId === authData.user!.id);
      if (trainer) {
        setHires(updatedHires.filter((h) => h.trainerId === trainer.id));
      }

      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: 'Respuesta enviada correctamente' });
      // setTimeout: Función que ejecuta código después de un tiempo
      setTimeout(() => setMessage(null), 3000); // Limpia el mensaje después de 3 segundos

      // Cierra el modal
      setShowResponseModal(false);
      // Limpia la contratación seleccionada
      setSelectedHire(null);
      // Limpia el texto de la respuesta
      setResponseText('');

    } catch (error) {
      // Manejo de errores
      console.error('Error al enviar respuesta:', error);
      setMessage({ type: 'danger', text: 'Error al enviar la respuesta' });
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
          height: '200px',
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
            Mi Panel de Entrenador
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

          {/* Información del entrenador */}
          {/* mb-1: Margin-bottom mínimo (1 = margin muy pequeño abajo) */}
          <Card className="mb-1">
            <Card.Body>
              <h5>Bienvenido, {authData.user?.name}</h5>
              <p className="text-muted mb-0">
                Aquí puedes ver a tus clientes y responder sus mensajes.
              </p>
            </Card.Body>
          </Card>

          {/* Lista de clientes */}
          {/* mb-1: Margin-bottom mínimo (1 = margin muy pequeño abajo) */}
          <h3 className="mb-1">Mis Clientes</h3>
          
          {/* map: Método de array que itera sobre las contrataciones */}
          {hires.length > 0 ? (
            <Row>
              {hires.map((hire) => (
                // Col: Columna para cada cliente
                <Col key={hire.id} md={6} className="mb-4">
                  {/* Card: Componente de Bootstrap para crear tarjetas */}
                  <Card>
                    <Card.Body>
                      {/* Nombre del cliente */}
                      <h5>{getUserName(hire.userId)}</h5>
                      
                      {/* Fecha de inicio */}
                      <p className="text-muted mb-2">
                        <strong>Contratado desde:</strong> {formatDate(hire.startDate)}
                        {/* formatDate: Helper para formatear fecha */}
                      </p>

                      {/* Estado */}
                      <Badge
                        bg={
                          hire.status === 'active'
                            ? 'success'
                            : hire.status === 'completed'
                            ? 'info'
                            : 'danger'
                        }
                        className="mb-3"
                      >
                        {/* Condicional: Muestra el estado según el valor */}
                        {hire.status === 'active'
                          ? 'Activo'
                          : hire.status === 'completed'
                          ? 'Completado'
                          : 'Cancelado'}
                      </Badge>

                      {/* Mensajes */}
                      {hire.messages.length > 0 ? (
                        <div className="mt-3">
                          <strong>Conversación ({hire.messages.length} mensajes):</strong>
                          {/* map: Método de array que itera sobre los mensajes */}
                          {hire.messages.map((msg) => {
                            // Determina si el mensaje es del entrenador o del usuario
                            const isTrainerMessage = msg.senderId === authData.user?.id;
                            return (
                              <div
                                key={msg.id}
                                className={`border p-3 mb-2 mt-2 rounded ${
                                  isTrainerMessage
                                    ? 'bg-primary bg-opacity-10 border-primary'
                                    : 'bg-light border-secondary'
                                }`}
                              >
                                {/* Condicional: Estilo diferente si el mensaje es del entrenador */}
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <small className={`fw-bold ${isTrainerMessage ? 'text-primary' : 'text-secondary'}`}>
                                    {isTrainerMessage ? '👤 Tú (Entrenador)' : `👤 ${msg.senderName} (Cliente)`}
                                  </small>
                                  <small className="text-muted">
                                    {formatDate(msg.timestamp)}
                                  </small>
                                </div>
                                <p className="mb-0">{msg.content}</p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // Si no hay mensajes, muestra un mensaje informativo
                        <div className="mt-3">
                          <p className="text-muted mb-0">
                            <i className="fa-solid fa-comment-dots me-2"></i>
                            No hay mensajes aún. El cliente puede enviarte mensajes desde su panel.
                          </p>
                        </div>
                      )}

                      {/* Button: Botón para responder (solo si está activo) */}
                      {hire.status === 'active' && (
                        <Button
                          variant="primary"
                          onClick={() => handleRespondMessage(hire)}
                          className="mt-2"
                        >
                          Responder
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            // Si no hay clientes, muestra un mensaje
            <Alert variant="info">
              Aún no tienes clientes contratados.
            </Alert>
          )}
        </Col>
      </Row>

      {/* Modal: Componente de Bootstrap para mostrar diálogos */}
      <Modal show={showResponseModal} onHide={() => setShowResponseModal(false)}>
        {/* Modal.Header: Encabezado del modal */}
        <Modal.Header closeButton>
          {/* closeButton: Muestra un botón de cerrar */}
          <Modal.Title>Responder a Cliente</Modal.Title>
        </Modal.Header>
        
        {/* Modal.Body: Cuerpo del modal */}
        <Modal.Body>
          {selectedHire && (
            <>
              {/* Información del cliente */}
              <p>
                Responder a: <strong>{getUserName(selectedHire.userId)}</strong>
              </p>

              {/* Mensajes anteriores */}
              {selectedHire.messages.length > 0 && (
                <div className="mb-3">
                  <strong>Historial de mensajes:</strong>
                  {selectedHire.messages.map((msg) => (
                    <div key={msg.id} className="border p-2 mb-2 mt-2">
                      <small className="text-muted">
                        {msg.senderName} - {formatDate(msg.timestamp)}
                      </small>
                      <p className="mb-0">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Form.Group: Componente de Bootstrap para agrupar elementos del formulario */}
              <Form.Group>
                <Form.Label>Tu Respuesta</Form.Label>
                {/* Form.Control: Campo de texto multilínea */}
                {/* as: Renderiza como textarea */}
                {/* rows: Número de filas visibles */}
                {/* value: Valor controlado del textarea */}
                {/* onChange: Actualiza el texto */}
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        
        {/* Modal.Footer: Pie del modal */}
        <Modal.Footer>
          {/* Button: Botón para cancelar */}
          <Button variant="secondary" onClick={() => setShowResponseModal(false)}>
            Cancelar
          </Button>
          {/* Button: Botón para enviar */}
          {/* disabled: Desactiva si no hay texto */}
          <Button
            variant="primary"
            onClick={sendResponse}
            disabled={!responseText.trim()}
          >
            Enviar Respuesta
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </Container>
  );
};

