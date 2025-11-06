// Página principal de la aplicación
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { getFromLocalStorage } from '../../helpers';
// Importación de constantes de colores
import { COLORS } from '../../constants';
import type { Product } from '../../interfaces/gym.interfaces';

const STORAGE_KEY_PRODUCTS = 'gymProducts';

export const HomePage = () => {
  // useNavigate: Hook que retorna una función para navegar programáticamente
  // Se utiliza para navegar a diferentes secciones de la aplicación (tienda, entrenadores, registro)
  const navigate = useNavigate();
  
  // useAuth: Hook personalizado que retorna los datos de autenticación
  // Se utiliza para verificar si el usuario está autenticado y mostrar/ocultar secciones según corresponda
  const { authData } = useAuth();
  
  // useCart: Hook personalizado que retorna las funciones del carrito
  // Se utiliza para agregar productos destacados al carrito directamente desde la página principal
  const { addToCart } = useCart();
  
  // useState: Hook de React para gestionar estado local
  // Estado para almacenar los productos destacados que se muestran en la página principal
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Carga los primeros 3 productos como destacados al montar el componente
  useEffect(() => {
    const products = getFromLocalStorage<Product[]>(STORAGE_KEY_PRODUCTS) || [];
    // Toma los primeros 3 productos
    setFeaturedProducts(products.slice(0, 3));
  }, []); // Array de dependencias vacío: se ejecuta solo al montar

  return (
    // Eliminamos cualquier padding/margin extra del contenedor principal
    <Container
      fluid
      className="p-0"
      style={{
        margin: 0,
        padding: 0,
      }}
    >
      {/* Hero Image: Imagen de banner */}
      <div
        style={{
          width: '100%',
          height: '300px',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          // 🔹 Ajuste clave: eliminamos cualquier espacio superior
          marginTop: '0px',
        }}
      >
        {/* Overlay oscuro sobre la imagen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '20px',
          }}
        >
          <h1
            className="text-white display-4 mb-2"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)', marginTop: '0px' }}
          >
            Bienvenido a GymFitWeb
          </h1>
          <p
            className="text-white lead"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
          >
            Tu plataforma completa para productos de gimnasio y entrenamiento personalizado
          </p>
        </div>
      </div>

      {/* Contenido principal debajo del banner */}
      <Container className="pt-1 pb-4">
        <Row>
          <Col>
            {/* Sección de Productos Destacados - Primero */}
            {featuredProducts.length > 0 && (
              <Row className="mb-5 mt-3">
                <Col>
                  <h2 className="text-center mb-4">Productos Destacados</h2>
                  <Row>
                    {featuredProducts.map((product) => (
                      <Col key={product.id} xs={12} md={4} className="mb-4">
                        <Card className="h-100">
                          <div
                            onClick={() => navigate(`/product/${product.id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Card.Img
                              variant="top"
                              src={product.image}
                              alt={product.name}
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                          </div>
                          <Card.Body className="d-flex flex-column">
                            <Badge
                              bg={product.category === 'accessory' ? 'primary' : 'success'}
                              className="mb-2"
                              style={{ width: 'fit-content' }}
                            >
                              {product.category === 'accessory' ? 'Accesorio' : 'Suplemento'}
                            </Badge>
                            <Card.Title
                              onClick={() => navigate(`/product/${product.id}`)}
                              style={{
                                cursor: 'pointer',
                                color: COLORS.COLOR_3,
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.COLOR_2)}
                              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.COLOR_3)}
                            >
                              {product.name}
                            </Card.Title>
                            <Card.Text>{product.description}</Card.Text>
                            <div className="mt-auto">
                              <h5 style={{ color: COLORS.COLOR_3 }} className="mb-2">
                                ${product.price.toFixed(2)}
                              </h5>
                              <p className="text-muted mb-2 small">
                                Stock: {product.stock}
                              </p>
                              <Button
                                variant="primary"
                                className="w-100"
                                onClick={() => {
                                  if (product.stock <= 0) return;
                                  addToCart(product, 1);
                                }}
                                disabled={product.stock <= 0}
                                style={{ backgroundColor: COLORS.COLOR_3, borderColor: COLORS.COLOR_3 }}
                              >
                                {product.stock <= 0 ? 'Agotado' : 'Agregar al Carrito'}
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
            )}

            {/* Tarjetas de Servicios - Después de Productos Destacados */}
            <Row className="mb-3 mt-3">
              <Col md={authData.isAuthenticated ? 6 : 4} className="mb-4">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <i className="fa-solid fa-shopping-cart fa-3x mb-3" style={{ color: COLORS.COLOR_3 }}></i>
                    <Card.Title>Tienda de Productos</Card.Title>
                    <Card.Text>
                      Encuentra los mejores accesorios y suplementos para tu entrenamiento.
                      Tenemos una amplia variedad de productos de calidad.
                    </Card.Text>
                    <Button 
                      variant="primary" 
                      onClick={() => navigate('/store')}
                      style={{ backgroundColor: COLORS.COLOR_3, borderColor: COLORS.COLOR_3 }}
                    >
                      Ver Tienda
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={authData.isAuthenticated ? 6 : 4} className="mb-4">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <i className="fa-solid fa-user-tie fa-3x text-success mb-3"></i>
                    <Card.Title>Entrenadores Profesionales</Card.Title>
                    <Card.Text>
                      Contrata a nuestros entrenadores certificados y personaliza tu rutina.
                      Obtén asesoramiento profesional para alcanzar tus objetivos.
                    </Card.Text>
                    <Button variant="success" onClick={() => navigate('/trainers')}>
                      Ver Entrenadores
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* Solo mostrar "Únete a Nosotros" si el usuario NO está autenticado */}
              {!authData.isAuthenticated && (
                <Col md={4} className="mb-4">
                  <Card className="h-100 text-center">
                    <Card.Body>
                      <i className="fa-solid fa-user-plus fa-3x text-info mb-3"></i>
                      <Card.Title>Únete a Nosotros</Card.Title>
                      <Card.Text>
                        Regístrate como usuario o entrenador y comienza a disfrutar
                        de todos los beneficios que ofrecemos.
                      </Card.Text>
                      <Button variant="info" onClick={() => navigate('/register')}>
                        Registrarse
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>

            <Row className="mt-1">
              <Col>
                <Card className="bg-light">
                  <Card.Body>
                    <h3 className="mb-3">¿Qué ofrecemos?</h3>
                    <Row>
                      <Col md={6}>
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <i className="fa-solid fa-check text-success me-2"></i>
                            Productos de calidad (accesorios y suplementos)
                          </li>
                          <li className="mb-2">
                            <i className="fa-solid fa-check text-success me-2"></i>
                            Entrenadores certificados y profesionales
                          </li>
                          <li className="mb-2">
                            <i className="fa-solid fa-check text-success me-2"></i>
                            Comunicación directa con entrenadores
                          </li>
                        </ul>
                      </Col>
                      <Col md={6}>
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <i className="fa-solid fa-check text-success me-2"></i>
                            Sistema de compras simple y seguro
                          </li>
                          <li className="mb-2">
                            <i className="fa-solid fa-check text-success me-2"></i>
                            Panel personalizado según tu rol
                          </li>
                          <li className="mb-2">
                            <i className="fa-solid fa-check text-success me-2"></i>
                            Gestión completa de usuarios y productos
                          </li>
                        </ul>
                      </Col>
                    </Row>
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
