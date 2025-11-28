// Página del carrito de compras
// Functional Component: Componente de React definido como función
import { useState } from 'react';
// Importación de componentes de Bootstrap
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Table,
  Form,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Importación de hooks y helpers
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { getFromLocalStorage, saveToLocalStorage, generateId } from '../../helpers';
// Importación de constantes de colores
import { COLORS } from '../../constants';
// Importación de tipos e interfaces
import type { Purchase } from '../../interfaces/gym.interfaces';
import { UserRole } from '../../interfaces/gym.interfaces';

// Constantes para las claves de localStorage
const STORAGE_KEY_PURCHASES = 'gymPurchases';
const STORAGE_KEY_PRODUCTS = 'gymProducts';

// Componente de página del carrito
export const CartPage = () => {
  // useNavigate: Hook que retorna una función para navegar programáticamente
  // Se utiliza para redirigir al usuario después de finalizar la compra
  const navigate = useNavigate();
  
  // useAuth: Hook personalizado que retorna los datos de autenticación
  // Se utiliza para verificar si el usuario está autenticado antes de permitir la compra
  const { authData } = useAuth();
  
  // useCart: Hook personalizado que retorna las funciones y datos del carrito
  // Se utiliza para acceder a los items del carrito y las funciones para gestionarlos
  const {
    cartItems,        // Array de productos en el carrito
    removeFromCart,   // Función para eliminar un producto del carrito
    updateQuantity,   // Función para actualizar la cantidad de un producto
    clearCart,        // Función para vaciar completamente el carrito
    getTotalItems,    // Función para obtener el total de items en el carrito
    getTotalPrice,    // Función para obtener el precio total del carrito
  } = useCart();

  // useState: Hook de React para gestionar estado local
  // Estado para mensajes de éxito/error que se muestran al usuario
  const [message, setMessage] = useState<{
    type: 'success' | 'danger';
    text: string;
  } | null>(null);

  /**
   * Maneja la compra de todos los productos del carrito
   */
  const handleCheckout = async (): Promise<void> => {
    // Verifica que el usuario esté autenticado
    if (!authData.isAuthenticated || !authData.user) {
      setMessage({
        type: 'danger',
        text: 'Debes iniciar sesión para realizar compras',
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Verifica que el usuario tenga rol USER
    if (authData.user.role !== UserRole.USER) {
      setMessage({
        type: 'danger',
        text: 'Solo los usuarios pueden comprar productos',
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Verifica que haya productos en el carrito
    if (cartItems.length === 0) {
      setMessage({ type: 'danger', text: 'El carrito está vacío' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const userId = parseInt(authData.user.id);
      const total = getTotalPrice();

      // Procesa la compra usando localStorage
      const purchases = getFromLocalStorage<Purchase[]>(STORAGE_KEY_PURCHASES) || [];
      const products = getFromLocalStorage<any[]>(STORAGE_KEY_PRODUCTS) || [];

      const newPurchases: Purchase[] = cartItems.map((item) => ({
        id: generateId(),
        userId: authData.user!.id,
        productId: item.product.id,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
        date: new Date().toISOString(),
        status: 'completed',
      }));

      purchases.push(...newPurchases);
      saveToLocalStorage(STORAGE_KEY_PURCHASES, purchases);

      // Actualiza el stock
      const updatedProducts = products.map((product) => {
        const cartItem = cartItems.find((item) => item.product.id === product.id);
        if (cartItem) {
          return {
            ...product,
            stock: product.stock - cartItem.quantity,
          };
        }
        return product;
      });

      saveToLocalStorage(STORAGE_KEY_PRODUCTS, updatedProducts);
      clearCart();

      setMessage({
        type: 'success',
        text: `¡Compra realizada! Se compraron ${getTotalItems()} artículo(s)`,
      });
      setTimeout(() => {
        setMessage(null);
        navigate('/user-panel');
      }, 2000);
    } catch (error) {
      console.error('Error al realizar compra:', error);
      setMessage({ type: 'danger', text: 'Error al realizar la compra' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // JSX: Sintaxis de JavaScript que permite escribir HTML en JavaScript
  return (
    <Container fluid className="p-0" style={{ marginTop: 0, paddingTop: 0 }}>
      {/* Hero Image: Imagen de banner */}
      <div
        style={{
          width: '100%',
          height: '200px',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          marginTop: 0,
          marginBottom: 0,
        }}
      >
        {/* Overlay oscuro sobre la imagen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <h1 className="text-white display-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Carrito de Compras
          </h1>
        </div>
      </div>

      {/* Container: Contenedor principal del contenido */}
      <Container className="pt-4 pb-4">
        <Row>
          <Col>
            {/* Alert: Mensaje de éxito/error */}
            {message && (
              <Alert variant={message.type} className="mb-3">
                {message.text}
              </Alert>
            )}

            {/* Condicional: Si el carrito está vacío, muestra mensaje */}
            {cartItems.length === 0 ? (
              <Card className="text-center py-5">
                <Card.Body>
                  <i className="fa-solid fa-cart-shopping fa-4x text-muted mb-3"></i>
                  <h3 className="mb-3">Tu carrito está vacío</h3>
                  <p className="text-muted mb-4">
                    Agrega productos desde la tienda para comenzar a comprar
                  </p>
                  <Button variant="primary" onClick={() => navigate('/store')}>
                    <i className="fa-solid fa-store me-2"></i>
                    Ir a la Tienda
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <>
                {/* Table: Tabla para mostrar los productos del carrito */}
                <Card className="mb-4">
                  <Card.Header>
                    <h4 className="mb-0">
                      <i className="fa-solid fa-cart-shopping me-2"></i>
                      Productos en el carrito ({getTotalItems()} artículo
                      {getTotalItems() !== 1 ? 's' : ''})
                    </h4>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Producto</th>
                          <th>Precio Unitario</th>
                          <th>Cantidad</th>
                          <th>Subtotal</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.product.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginRight: '15px',
                                  }}
                                />
                                <div>
                                  <strong>{item.product.name}</strong>
                                  <br />
                                  <Badge
                                    bg={
                                      item.product.category === 'accessory'
                                        ? 'primary'
                                        : 'success'
                                    }
                                    className="mt-1"
                                  >
                                    {item.product.category === 'accessory'
                                      ? 'Accesorio'
                                      : 'Suplemento'}
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td>${item.product.price.toFixed(2)}</td>
                            <td>
                              <Form.Group className="d-flex align-items-center">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  <i className="fa-solid fa-minus"></i>
                                </Button>
                                <Form.Control
                                  type="number"
                                  min="1"
                                  max={item.product.stock}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value) || 1;
                                    if (newQuantity > 0 && newQuantity <= item.product.stock) {
                                      updateQuantity(item.product.id, newQuantity);
                                    }
                                  }}
                                  style={{
                                    width: '80px',
                                    textAlign: 'center',
                                    margin: '0 10px',
                                  }}
                                />
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={item.quantity >= item.product.stock}
                                >
                                  <i className="fa-solid fa-plus"></i>
                                </Button>
                              </Form.Group>
                              <small className="text-muted d-block mt-1">
                                Stock disponible: {item.product.stock}
                              </small>
                            </td>
                            <td>
                              <strong style={{ color: COLORS.COLOR_3 }}>
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </strong>
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <i className="fa-solid fa-trash me-1"></i>
                                Eliminar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>

                {/* Resumen del pedido */}
                <Row>
                  <Col md={6}></Col>
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h5 className="mb-0">Resumen del Pedido</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Subtotal ({getTotalItems()} artículo{getTotalItems() !== 1 ? 's' : ''}):</span>
                          <strong>${getTotalPrice().toFixed(2)}</strong>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-3">
                          <h5>Total:</h5>
                          <h5 style={{ color: COLORS.COLOR_3 }}>${getTotalPrice().toFixed(2)}</h5>
                        </div>
                        <Button
                          variant="primary"
                          size="lg"
                          className="w-100 mb-2"
                          onClick={handleCheckout}
                          disabled={
                            !authData.isAuthenticated ||
                            authData.user?.role !== UserRole.USER
                          }
                          style={{ backgroundColor: COLORS.COLOR_3, borderColor: COLORS.COLOR_3 }}
                        >
                          <i className="fa-solid fa-credit-card me-2"></i>
                          Finalizar Compra
                        </Button>
                        {(!authData.isAuthenticated ||
                          authData.user?.role !== UserRole.USER) && (
                          <Alert variant="warning" className="mb-0">
                            <small>
                              Debes iniciar sesión como usuario para realizar compras
                            </small>
                          </Alert>
                        )}
                        <Button
                          variant="outline-secondary"
                          className="w-100 mt-2"
                          onClick={() => navigate('/store')}
                        >
                          <i className="fa-solid fa-arrow-left me-2"></i>
                          Continuar Comprando
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="w-100 mt-2"
                          onClick={clearCart}
                        >
                          <i className="fa-solid fa-trash me-2"></i>
                          Vaciar Carrito
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

