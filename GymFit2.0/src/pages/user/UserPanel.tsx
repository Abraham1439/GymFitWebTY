// Panel de usuario donde puede ver sus compras y contrataciones
// Functional Component: Componente de React definido como función
import { useState, useEffect } from 'react';
// Importación de componentes de Bootstrap
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';

// Importación de hooks y helpers
import { useAuth } from '../../contexts/AuthContext';
import { getFromLocalStorage, saveToLocalStorage, generateId, formatDate } from '../../helpers';
import { ordenesService, ItemOrden } from '../../services/ordenesService';
import { productosService } from '../../services/productosService';
// Importación de tipos e interfaces
import type { Purchase, TrainerHire, Product, Trainer, Message } from '../../interfaces/gym.interfaces';

// Constantes para las claves de localStorage
const STORAGE_KEY_PURCHASES = 'gymPurchases';  // Clave para almacenar compras
const STORAGE_KEY_HIRES = 'gymHires';            // Clave para almacenar contrataciones
const STORAGE_KEY_PRODUCTS = 'gymProducts';    // Clave para almacenar productos
const STORAGE_KEY_TRAINERS = 'gymTrainers';    // Clave para almacenar entrenadores

// Componente de panel de usuario
// Functional Component: Componente funcional de React
export const UserPanel = () => {
  // useAuth: Hook personalizado que retorna los datos de autenticación
  // Se utiliza para obtener el ID del usuario autenticado y cargar sus compras y contrataciones
  const { authData } = useAuth();

  // useState: Hook de React para gestionar estado local
  // Estado para almacenar las compras del usuario
  const [purchases, setPurchases] = useState<Purchase[]>([]); // Array vacío inicialmente

  // Estado para almacenar las contrataciones del usuario
  const [hires, setHires] = useState<TrainerHire[]>([]); // Array vacío inicialmente

  // Estado para almacenar productos (para mostrar detalles de compras)
  const [products, setProducts] = useState<Product[]>([]); // Array vacío inicialmente

  // Estado para almacenar entrenadores (para mostrar detalles de contrataciones)
  const [trainers, setTrainers] = useState<Trainer[]>([]); // Array vacío inicialmente

  // Estado para el modal de mensajes
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false); // false = modal cerrado

  // Estado para la contratación seleccionada para enviar mensaje
  const [selectedHire, setSelectedHire] = useState<TrainerHire | null>(null); // null = ninguno seleccionado

  // Estado para el mensaje a enviar
  const [messageText, setMessageText] = useState<string>(''); // String vacío inicialmente

  // Estado para mensajes de éxito/error
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null); // null = sin mensaje

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Efecto que se ejecuta al montar el componente para cargar datos del usuario
  // También se ejecuta cuando cambia el usuario autenticado para actualizar la información
  useEffect(() => {
    // Carga los datos del usuario (compras y contrataciones)
    loadUserData();
  }, [authData.user]); // Se ejecuta cuando cambia el usuario autenticado

  /**
   * Carga los datos del usuario (compras y contrataciones)
   * void: Tipo que indica que la función no retorna valor
   */
  const loadUserData = async (): Promise<void> => {
    // Verifica que el usuario esté autenticado
    if (!authData.user) {
      return;                     // Sale de la función si no hay usuario
    }

    try {
      const userId = parseInt(authData.user.id);
      
      // Carga las órdenes del usuario desde el microservicio
      const ordenes = await ordenesService.getByUsuario(userId);
      
      // Convierte las órdenes a formato Purchase
      const purchasesList: Purchase[] = [];
      
      for (const orden of ordenes) {
        // Obtiene los items de cada orden
        const items = await ordenesService.getItemsByOrden(orden.id);
        
        // Convierte cada item a una Purchase
        for (const item of items) {
          // Convierte el estado de la orden al formato del frontend
          // El backend usa: "pendiente", "completada", "cancelada" (minúsculas)
          let status: 'pending' | 'completed' | 'cancelled' = 'pending';
          const estadoLower = orden.estado.toLowerCase();
          if (estadoLower === 'completada' || estadoLower === 'completado') {
            status = 'completed';
          } else if (estadoLower === 'cancelada' || estadoLower === 'cancelado') {
            status = 'cancelled';
          } else {
            status = 'pending';
          }
          
          purchasesList.push({
            id: `orden-${orden.id}-item-${item.id}`,
            userId: authData.user.id,
            productId: item.productoId.toString(),
            quantity: item.cantidad,
            total: item.subtotal,
            date: orden.fechaCreacion,
            status: status
          });
        }
      }
      
      // Actualiza el estado con las compras del usuario
      setPurchases(purchasesList);
      
      // Carga productos para mostrar detalles
      const productos = await productosService.getAll();
      const productosFormateados: Product[] = productos.map(p => ({
        id: p.id.toString(),
        name: p.nombre,
        description: p.descripcion,
        price: p.precio,
        category: p.categoria,
        image: p.imagen || '',
        stock: p.stock
      }));
      setProducts(productosFormateados);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }

    // Obtiene todas las contrataciones desde localStorage
    const allHires = getFromLocalStorage<TrainerHire[]>(STORAGE_KEY_HIRES) || [];
    // Filtra solo las contrataciones del usuario actual
    const userHires = allHires.filter((h) => h.userId === authData.user!.id);
    // Actualiza el estado con las contrataciones del usuario
    setHires(userHires);

    // Carga entrenadores para mostrar detalles
    const allTrainers = getFromLocalStorage<Trainer[]>(STORAGE_KEY_TRAINERS) || [];
    setTrainers(allTrainers);
  };

  /**
   * Obtiene el nombre de un producto por su ID
   * @param productId - ID del producto
   * @returns Nombre del producto o "Producto no encontrado"
   */
  const getProductName = (productId: string): string => {
    // find: Método de array que retorna el primer elemento que cumple la condición
    const product = products.find((p) => p.id === productId);
    // Retorna el nombre del producto o un mensaje por defecto
    return product ? product.name : 'Producto no encontrado';
  };

  /**
   * Obtiene el nombre de un entrenador por su ID
   * @param trainerId - ID del entrenador
   * @returns Nombre del entrenador o "Entrenador no encontrado"
   */
  const getTrainerName = (trainerId: string): string => {
    // find: Método de array que retorna el primer elemento que cumple la condición
    const trainer = trainers.find((t) => t.id === trainerId);
    // Retorna el nombre del entrenador o un mensaje por defecto
    return trainer ? trainer.name : 'Entrenador no encontrado';
  };

  /**
   * Abre el modal para enviar mensaje a un entrenador
   * @param hire - Contratación del entrenador
   */
  const handleSendMessage = (hire: TrainerHire): void => {
    // Establece la contratación seleccionada
    setSelectedHire(hire);
    // Limpia el texto del mensaje
    setMessageText('');
    // Abre el modal
    setShowMessageModal(true);
  };

  /**
   * Envía un mensaje al entrenador
   */
  const sendMessage = (): void => {
    // Verifica que haya una contratación seleccionada, usuario autenticado y texto de mensaje
    if (!selectedHire || !authData.user || !messageText.trim()) {
      return;                     // Sale de la función si faltan datos
    }

    try {
      // Obtiene todas las contrataciones
      const allHires = getFromLocalStorage<TrainerHire[]>(STORAGE_KEY_HIRES) || [];

      // Crea un nuevo mensaje
      const newMessage: Message = {
        id: generateId(),                    // Genera un ID único
        senderId: authData.user.id,          // ID del remitente (usuario)
        senderName: authData.user.name,      // Nombre del remitente
        content: messageText.trim(),         // Contenido del mensaje (sin espacios al inicio/final)
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
      setHires(updatedHires.filter((h) => h.userId === authData.user!.id));

      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: 'Mensaje enviado correctamente' });
      // setTimeout: Función que ejecuta código después de un tiempo
      setTimeout(() => setMessage(null), 3000); // Limpia el mensaje después de 3 segundos

      // Cierra el modal
      setShowMessageModal(false);
      // Limpia la contratación seleccionada
      setSelectedHire(null);
      // Limpia el texto del mensaje
      setMessageText('');

    } catch (error) {
      // Manejo de errores
      console.error('Error al enviar mensaje:', error);
      setMessage({ type: 'danger', text: 'Error al enviar el mensaje' });
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
          backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80)',
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
            Mi Panel de Usuario
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

          {/* Row: Fila para las secciones */}
          <Row>
            {/* Col: Columna para compras */}
            <Col md={6} className="mb-4">
              {/* Card: Componente de Bootstrap para crear tarjetas */}
              <Card>
                {/* Card.Header: Encabezado de la tarjeta */}
                <Card.Header>
                  <h4>Mis Compras</h4>
                </Card.Header>
                
                {/* Card.Body: Cuerpo de la tarjeta */}
                <Card.Body>
                  {/* Table: Componente de Bootstrap para tablas */}
                  <Table striped bordered hover>
                    {/* thead: Encabezado de la tabla */}
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    
                    {/* tbody: Cuerpo de la tabla */}
                    <tbody>
                      {/* map: Método de array que itera sobre las compras */}
                      {purchases.length > 0 ? (
                        purchases.map((purchase) => (
                          <tr key={purchase.id}>
                            <td>{getProductName(purchase.productId)}</td>
                            <td>{purchase.quantity}</td>
                            <td>${purchase.total.toFixed(2)}</td>
                            {/* toFixed: Formatea el número a 2 decimales */}
                            <td>{formatDate(purchase.date)}</td>
                            {/* formatDate: Helper para formatear fecha */}
                            <td>
                              {/* Badge: Componente de Bootstrap para etiquetas */}
                              <Badge
                                bg={
                                  purchase.status === 'completed'
                                    ? 'success'
                                    : purchase.status === 'pending'
                                    ? 'warning'
                                    : 'danger'
                                }
                              >
                                {/* Condicional: Muestra el estado según el valor */}
                                {purchase.status === 'completed'
                                  ? 'Completada'
                                  : purchase.status === 'pending'
                                  ? 'Pendiente'
                                  : 'Cancelada'}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        // Si no hay compras, muestra un mensaje
                        // Fragment: React Fragment para agrupar elementos sin agregar nodo DOM
                        <tr key="no-purchases">
                          <td colSpan={5} className="text-center text-muted">
                            No tienes compras realizadas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* Col: Columna para contrataciones */}
            <Col md={6} className="mb-4">
              {/* Card: Componente de Bootstrap para crear tarjetas */}
              <Card>
                {/* Card.Header: Encabezado de la tarjeta */}
                <Card.Header>
                  <h4>Mis Entrenadores Contratados</h4>
                </Card.Header>
                
                {/* Card.Body: Cuerpo de la tarjeta */}
                <Card.Body>
                  {/* map: Método de array que itera sobre las contrataciones */}
                  {hires.length > 0 ? (
                    hires.map((hire) => (
                      // Card: Tarjeta para cada contratación
                      <Card key={hire.id} className="mb-3">
                        <Card.Body>
                          {/* Nombre del entrenador */}
                          <h5>{getTrainerName(hire.trainerId)}</h5>
                          
                          {/* Fecha de inicio */}
                          <p className="text-muted mb-2">
                            <strong>Inicio:</strong> {formatDate(hire.startDate)}
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
                            className="mb-2"
                          >
                            {hire.status === 'active'
                              ? 'Activo'
                              : hire.status === 'completed'
                              ? 'Completado'
                              : 'Cancelado'}
                          </Badge>

                          {/* Mensajes */}
                          {hire.messages.length > 0 && (
                            <div className="mt-2">
                              <strong>Mensajes:</strong>
                              {/* map: Método de array que itera sobre los mensajes */}
                              {hire.messages.map((msg) => (
                                <div key={msg.id} className="border p-2 mb-2 mt-2">
                                  <small className="text-muted">
                                    {msg.senderName} - {formatDate(msg.timestamp)}
                                  </small>
                                  <p className="mb-0">{msg.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Button: Botón para enviar mensaje (solo si está activo) */}
                          {hire.status === 'active' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSendMessage(hire)}
                              className="mt-2"
                            >
                              Enviar Mensaje
                            </Button>
                          )}
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    // Si no hay contrataciones, muestra un mensaje
                    // Fragment: React Fragment para agrupar elementos sin agregar nodo DOM
                    <p key="no-hires" className="text-center text-muted">
                      No has contratado entrenadores
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Modal: Componente de Bootstrap para mostrar diálogos */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
        {/* Modal.Header: Encabezado del modal */}
        <Modal.Header closeButton>
          {/* closeButton: Muestra un botón de cerrar */}
          <Modal.Title>Enviar Mensaje al Entrenador</Modal.Title>
        </Modal.Header>
        
        {/* Modal.Body: Cuerpo del modal */}
        <Modal.Body>
          {selectedHire && (
            <>
              {/* Información del entrenador */}
              <p>
                Enviar mensaje a: <strong>{getTrainerName(selectedHire.trainerId)}</strong>
              </p>

              {/* Form.Group: Componente de Bootstrap para agrupar elementos del formulario */}
              <Form.Group>
                <Form.Label>Mensaje</Form.Label>
                {/* Form.Control: Campo de texto multilínea */}
                {/* as: Renderiza como textarea */}
                {/* rows: Número de filas visibles */}
                {/* value: Valor controlado del textarea */}
                {/* onChange: Actualiza el texto */}
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        
        {/* Modal.Footer: Pie del modal */}
        <Modal.Footer>
          {/* Button: Botón para cancelar */}
          <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
            Cancelar
          </Button>
          {/* Button: Botón para enviar */}
          {/* disabled: Desactiva si no hay texto */}
          <Button
            variant="primary"
            onClick={sendMessage}
            disabled={!messageText.trim()}
          >
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </Container>
  );
};

