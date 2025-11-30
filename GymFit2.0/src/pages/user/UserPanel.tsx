// Panel de usuario donde puede ver sus compras y contrataciones
// Functional Component: Componente de React definido como función
import { useState, useEffect } from 'react';
// Importación de componentes de Bootstrap
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';

// Importación de hooks y helpers
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../helpers';
import { ordenesService } from '../../services/ordenesService';
import { productosService } from '../../services/productosService';
// Importación de tipos e interfaces
import type { Purchase, Product } from '../../interfaces/gym.interfaces';

// Componente de panel de usuario
// Functional Component: Componente funcional de React
export const UserPanel = () => {
  // useAuth: Hook personalizado que retorna los datos de autenticación
  // Se utiliza para obtener el ID del usuario autenticado y cargar sus compras y contrataciones
  const { authData } = useAuth();

  // useState: Hook de React para gestionar estado local
  // Estado para almacenar las compras del usuario
  const [purchases, setPurchases] = useState<Purchase[]>([]); // Array vacío inicialmente

  // Estado para almacenar productos (para mostrar detalles de compras)
  const [products, setProducts] = useState<Product[]>([]); // Array vacío inicialmente

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Efecto que se ejecuta al montar el componente para cargar datos del usuario
  // También se ejecuta cuando cambia el usuario autenticado para actualizar la información
  useEffect(() => {
    // Carga los datos del usuario (compras y contrataciones)
    loadUserData();
  }, [authData.user]); // Se ejecuta cuando cambia el usuario autenticado

  /**
   * Carga los datos del usuario (compras)
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

          {/* Row: Fila para las secciones */}
          <Row>
            {/* Col: Columna para compras */}
            <Col md={12} className="mb-4">
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
          </Row>
        </Col>
      </Row>
      </Container>
    </Container>
  );
};

