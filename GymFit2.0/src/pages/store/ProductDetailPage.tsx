// Página de detalles de un producto específico
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
} from 'react-bootstrap';

// Importación de hooks y helpers
import { useCart } from '../../contexts/CartContext';
import { getFromLocalStorage } from '../../helpers';
// Importación de constantes de colores
import { COLORS } from '../../constants';
// Importación de tipos e interfaces
import type { Product } from '../../interfaces/gym.interfaces';

// Constante para la clave de localStorage
const STORAGE_KEY_PRODUCTS = 'gymProducts';

// Componente de página de detalles de producto
export const ProductDetailPage = () => {
  // useParams: Hook que obtiene los parámetros de la URL
  // Se utiliza para extraer el ID del producto desde la ruta /product/:id
  const { id } = useParams<{ id: string }>();
  
  // useNavigate: Hook que retorna una función para navegar programáticamente
  // Se utiliza para redirigir al usuario de vuelta a la tienda o al carrito
  const navigate = useNavigate();
  
  // useCart: Hook personalizado que retorna las funciones del carrito
  // Se utiliza para agregar el producto al carrito con la cantidad seleccionada
  const { addToCart } = useCart();

  // useState: Hook de React para gestionar estado local
  // Estado para almacenar el producto actual que se está mostrando
  const [product, setProduct] = useState<Product | null>(null);
  
  // Estado para controlar si se está cargando el producto (muestra pantalla de carga)
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado para mensajes de éxito/error que se muestran al usuario
  const [message, setMessage] = useState<{
    type: 'success' | 'danger';
    text: string;
  } | null>(null);
  
  // Estado para la cantidad de productos que el usuario quiere comprar
  const [quantity, setQuantity] = useState<number>(1);

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Carga el producto cuando cambia el ID de la URL (cuando el usuario navega entre productos)
  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]); // Se ejecuta cada vez que el parámetro 'id' cambia

  /**
   * Carga un producto específico desde localStorage
   * @param productId - ID del producto a cargar
   */
  const loadProduct = (productId: string): void => {
    setLoading(true);
    
    // Simula un pequeño delay para mostrar la pantalla de carga
    setTimeout(() => {
      // Obtiene todos los productos desde localStorage
      const products = getFromLocalStorage<Product[]>(STORAGE_KEY_PRODUCTS) || [];
      
      // Busca el producto por ID
      const foundProduct = products.find((p) => p.id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setMessage({
          type: 'danger',
          text: 'Producto no encontrado',
        });
      }
      
      setLoading(false);
    }, 800); // 800ms de delay para mostrar la pantalla de carga
  };

  /**
   * Maneja la adición del producto al carrito
   */
  const handleAddToCart = (): void => {
    if (!product) return;

    if (product.stock <= 0) {
      setMessage({ type: 'danger', text: 'Producto agotado' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (quantity > product.stock) {
      setMessage({
        type: 'danger',
        text: `Solo hay ${product.stock} unidades disponibles`,
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Agrega la cantidad especificada al carrito
    addToCart(product, quantity);
    setMessage({
      type: 'success',
      text: `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product.name} agregada${quantity === 1 ? '' : 's'} al carrito`,
    });
    setTimeout(() => setMessage(null), 3000);
  };

  /**
   * Maneja el botón "Comprar" - agrega al carrito y redirige
   */
  const handlePurchase = (): void => {
    if (!product) return;

    if (product.stock <= 0) {
      setMessage({ type: 'danger', text: 'Producto agotado' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (quantity > product.stock) {
      setMessage({
        type: 'danger',
        text: `Solo hay ${product.stock} unidades disponibles`,
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Agrega al carrito y redirige
    addToCart(product, quantity);
    setTimeout(() => {
      navigate('/cart');
    }, 500);
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
            <i className="fa-solid fa-box" style={{ color: COLORS.COLOR_2, fontSize: '1.2rem' }}></i>
            <h4 style={{ color: COLORS.COLOR_2, fontWeight: 'bold', margin: 0 }}>
              Cargando producto...
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

  // Si no se encontró el producto, muestra mensaje de error
  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Producto no encontrado</Alert.Heading>
          <p>El producto que buscas no existe o ha sido eliminado.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/store')}
            style={{ backgroundColor: COLORS.COLOR_3, borderColor: COLORS.COLOR_3 }}
          >
            Volver a la Tienda
          </Button>
        </Alert>
      </Container>
    );
  }


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
              {/* Columna izquierda: Imagen del producto */}
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    style={{
                      height: '500px',
                      objectFit: 'cover',
                      width: '100%',
                    }}
                  />
                </Card>
              </Col>

              {/* Columna derecha: Información del producto */}
              <Col md={6}>
                <Card>
                  <Card.Body>
                    {/* Badge: Etiqueta de categoría */}
                    <Badge
                      bg={product.category === 'accessory' ? 'primary' : 'success'}
                      className="mb-3"
                      style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                    >
                      {product.category === 'accessory' ? 'Accesorio' : 'Suplemento'}
                    </Badge>

                    {/* Título del producto */}
                    <Card.Title className="display-5 mb-3">{product.name}</Card.Title>

                    {/* Precio */}
                    <div className="mb-4">
                      <h2 style={{ color: COLORS.COLOR_3 }} className="mb-2">
                        ${product.price.toFixed(2)}
                      </h2>
                      <p className="text-muted">
                        {product.stock > 0 ? (
                          <span className="text-success">
                            <i className="fa-solid fa-check-circle me-1"></i>
                            En stock: {product.stock} unidades disponibles
                          </span>
                        ) : (
                          <span className="text-danger">
                            <i className="fa-solid fa-times-circle me-1"></i>
                            Agotado
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Descripción */}
                    <div className="mb-4">
                      <h5>Descripción</h5>
                      <p className="text-muted" style={{ lineHeight: '1.8' }}>
                        {product.description}
                      </p>
                    </div>

                    {/* Selector de cantidad */}
                    {product.stock > 0 && (
                      <div className="mb-4">
                        <label htmlFor="quantity" className="form-label">
                          <strong>Cantidad:</strong>
                        </label>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                          >
                            <i className="fa-solid fa-minus"></i>
                          </Button>
                          <input
                            type="number"
                            id="quantity"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              if (newQuantity >= 1 && newQuantity <= product.stock) {
                                setQuantity(newQuantity);
                              }
                            }}
                            className="form-control mx-2"
                            style={{ width: '100px', textAlign: 'center' }}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() =>
                              setQuantity(Math.min(product.stock, quantity + 1))
                            }
                            disabled={quantity >= product.stock}
                          >
                            <i className="fa-solid fa-plus"></i>
                          </Button>
                          <span className="ms-3 text-muted">
                            (Máximo: {product.stock})
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Subtotal */}
                    {product.stock > 0 && (
                      <div className="mb-4 p-3 bg-light rounded">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            <strong>Subtotal ({quantity} {quantity === 1 ? 'unidad' : 'unidades'}):</strong>
                          </span>
                          <h4 style={{ color: COLORS.COLOR_3 }} className="mb-0">
                            ${(product.price * quantity).toFixed(2)}
                          </h4>
                        </div>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handlePurchase}
                        disabled={product.stock <= 0}
                        className="mb-2"
                        style={{ backgroundColor: COLORS.COLOR_3, borderColor: COLORS.COLOR_3 }}
                      >
                        <i className="fa-solid fa-credit-card me-2"></i>
                        Comprar Ahora
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        style={{ borderColor: COLORS.COLOR_3, color: COLORS.COLOR_3 }}
                      >
                        <i className="fa-solid fa-cart-plus me-2"></i>
                        Agregar al Carrito
                      </Button>

                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate('/store')}
                        style={{ borderColor: COLORS.COLOR_2, color: COLORS.COLOR_2 }}
                      >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Volver a la Tienda
                      </Button>
                    </div>

                    {/* Información adicional */}
                    <hr className="my-4" />
                    <div className="text-muted small">
                      <p className="mb-1">
                        <i className="fa-solid fa-shield-alt me-2"></i>
                        Compra segura y protegida
                      </p>
                      <p className="mb-1">
                        <i className="fa-solid fa-truck me-2"></i>
                        Envío disponible
                      </p>
                      <p className="mb-0">
                        <i className="fa-solid fa-undo me-2"></i>
                        Devoluciones dentro de 30 días
                      </p>
                    </div>
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

