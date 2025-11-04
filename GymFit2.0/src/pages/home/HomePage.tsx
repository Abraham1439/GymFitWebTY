// Página principal de la aplicación
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();

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
            Bienvenido a GymWeb 2.0
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
            <Row className="mb-3 mt-3">
              <Col md={4} className="mb-4">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <i className="fa-solid fa-shopping-cart fa-3x text-primary mb-3"></i>
                    <Card.Title>Tienda de Productos</Card.Title>
                    <Card.Text>
                      Encuentra los mejores accesorios y suplementos para tu entrenamiento.
                      Tenemos una amplia variedad de productos de calidad.
                    </Card.Text>
                    <Button variant="primary" onClick={() => navigate('/store')}>
                      Ver Tienda
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4} className="mb-4">
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
