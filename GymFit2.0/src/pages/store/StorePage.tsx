// Página de tienda donde los usuarios pueden ver y comprar productos
// Functional Component: Componente de React definido como función
import { useState, useEffect } from 'react';
// Importación de componentes de Bootstrap
import { Container, Row, Col, Card, Button, Badge, Alert, Form } from 'react-bootstrap';

// Importación de hooks y helpers
import { useAuth } from '../../contexts/AuthContext';
import { getFromLocalStorage, saveToLocalStorage, generateId } from '../../helpers';
// Importación de tipos e interfaces
import type { Product, Purchase } from '../../interfaces/gym.interfaces';
import { UserRole } from '../../interfaces/gym.interfaces';

// Constantes para las claves de localStorage
const STORAGE_KEY_PRODUCTS = 'gymProducts';    // Clave para almacenar productos
const STORAGE_KEY_PURCHASES = 'gymPurchases';  // Clave para almacenar compras

// Componente de página de tienda
// Functional Component: Componente funcional de React
export const StorePage = () => {
  // useAuth: Hook personalizado que retorna los datos de autenticación
  const { authData } = useAuth();

  // useState: Hook de React para gestionar estado local
  // Estado para almacenar los productos disponibles
  const [products, setProducts] = useState<Product[]>([]); // Array vacío inicialmente

  // Estado para mensajes de éxito/error
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null); // null = sin mensaje

  // Estado para filtro de categoría
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'accessory' | 'supplement'>('all'); // 'all' = todas las categorías

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Efecto que se ejecuta al montar el componente para cargar productos
  useEffect(() => {
    // Carga los productos desde localStorage
    loadProducts();
  }, []); // Array de dependencias vacío: se ejecuta solo al montar

  /**
   * Carga los productos desde localStorage
   * void: Tipo que indica que la función no retorna valor
   */
  const loadProducts = (): void => {
    // Obtiene los productos guardados en localStorage
    const savedProducts = getFromLocalStorage<Product[]>(STORAGE_KEY_PRODUCTS);

    // Si no hay productos guardados, inicializa con productos de ejemplo
    if (!savedProducts || savedProducts.length === 0) {
      // Array de productos de ejemplo
      const initialProducts: Product[] = [
        // Producto 1: Accesorio
        {
          id: generateId(),                    // Genera un ID único
          name: 'Cinturón de Pesas',           // Nombre del producto
          description: 'Cinturón de cuero resistente para levantamiento de pesas', // Descripción
          price: 29.99,                        // Precio en dólares
          category: 'accessory',               // Categoría: accesorio
          image: 'https://via.placeholder.com/300x200?text=Cinturon', // URL de imagen placeholder
          stock: 15,                          // Stock disponible
          createdAt: new Date().toISOString()  // Fecha de creación
        },
        // Producto 2: Accesorio
        {
          id: generateId(),
          name: 'Guantes de Gimnasio',
          description: 'Guantes acolchados para protección de manos',
          price: 19.99,
          category: 'accessory',
          image: 'https://via.placeholder.com/300x200?text=Guantes',
          stock: 25,
          createdAt: new Date().toISOString()
        },
        // Producto 3: Suplemento
        {
          id: generateId(),
          name: 'Proteína Whey',
          description: 'Proteína de suero de leche para recuperación muscular',
          price: 49.99,
          category: 'supplement',
          image: 'https://via.placeholder.com/300x200?text=Proteina',
          stock: 10,
          createdAt: new Date().toISOString()
        },
        // Producto 4: Suplemento
        {
          id: generateId(),
          name: 'Creatina Monohidratada',
          description: 'Creatina pura para aumentar fuerza y masa muscular',
          price: 24.99,
          category: 'supplement',
          image: 'https://via.placeholder.com/300x200?text=Creatina',
          stock: 18,
          createdAt: new Date().toISOString()
        },
        // Producto 5: Accesorio
        {
          id: generateId(),
          name: 'Bandas de Resistencia',
          description: 'Set de bandas elásticas de diferentes resistencias',
          price: 15.99,
          category: 'accessory',
          image: 'https://via.placeholder.com/300x200?text=Bandas',
          stock: 30,
          createdAt: new Date().toISOString()
        },
        // Producto 6: Suplemento
        {
          id: generateId(),
          name: 'BCAA en Polvo',
          description: 'Aminoácidos de cadena ramificada para recuperación',
          price: 34.99,
          category: 'supplement',
          image: 'https://via.placeholder.com/300x200?text=BCAA',
          stock: 12,
          createdAt: new Date().toISOString()
        }
      ];

      // Guarda los productos iniciales en localStorage
      saveToLocalStorage(STORAGE_KEY_PRODUCTS, initialProducts);
      // Actualiza el estado con los productos iniciales
      setProducts(initialProducts);
    } else {
      // Si ya hay productos, los carga desde localStorage
      setProducts(savedProducts);
    }
  };

  /**
   * Maneja la compra de un producto
   * @param product - Producto a comprar
   */
  const handlePurchase = (product: Product): void => {
    // Verifica que el usuario esté autenticado
    if (!authData.isAuthenticated || !authData.user) {
      setMessage({ type: 'danger', text: 'Debes iniciar sesión para comprar productos' });
      // setTimeout: Función que ejecuta código después de un tiempo
      setTimeout(() => setMessage(null), 3000); // Limpia el mensaje después de 3 segundos
      return;                     // Sale de la función si no está autenticado
    }

    // Verifica que el usuario tenga rol USER (no admin ni trainer)
    if (authData.user.role !== UserRole.USER) {
      setMessage({ type: 'danger', text: 'Solo los usuarios pueden comprar productos' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Verifica que haya stock disponible
    if (product.stock <= 0) {
      setMessage({ type: 'danger', text: 'Producto agotado' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      // Obtiene las compras existentes
      const purchases = getFromLocalStorage<Purchase[]>(STORAGE_KEY_PURCHASES) || [];

      // Crea una nueva compra
      const newPurchase: Purchase = {
        id: generateId(),                    // Genera un ID único
        userId: authData.user.id,            // ID del usuario que compra
        productId: product.id,               // ID del producto comprado
        quantity: 1,                         // Cantidad: 1 producto
        total: product.price,                // Total: precio del producto
        date: new Date().toISOString(),      // Fecha de compra
        status: 'completed'                  // Estado: completada (simulación)
      };

      // Agrega la nueva compra al array
      purchases.push(newPurchase);

      // Guarda las compras actualizadas en localStorage
      saveToLocalStorage(STORAGE_KEY_PURCHASES, purchases);

      // Actualiza el stock del producto
      const updatedProducts = products.map((p) => {
        // map: Método de array que crea un nuevo array transformando cada elemento
        if (p.id === product.id) {
          // Si es el producto comprado, reduce el stock
          return { ...p, stock: p.stock - 1 }; // Spread operator: copia el objeto y actualiza stock
        }
        return p;                              // Retorna el producto sin cambios
      });

      // Actualiza el estado de productos con el stock actualizado
      setProducts(updatedProducts);

      // Guarda los productos actualizados en localStorage
      saveToLocalStorage(STORAGE_KEY_PRODUCTS, updatedProducts);

      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: `¡Compra realizada! Has comprado ${product.name}` });
      setTimeout(() => setMessage(null), 3000);

    } catch (error) {
      // Manejo de errores
      console.error('Error al realizar compra:', error);
      setMessage({ type: 'danger', text: 'Error al realizar la compra' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  /**
   * Filtra los productos por categoría
   * @returns Array de productos filtrados
   */
  const filteredProducts = (): Product[] => {
    // Si el filtro es 'all', retorna todos los productos
    if (categoryFilter === 'all') {
      return products;
    }
    // Si no, filtra por categoría
    // filter: Método de array que retorna elementos que cumplen una condición
    return products.filter((p) => p.category === categoryFilter);
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
          backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80)',
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
            Tienda de Productos
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

          {/* Form.Group: Componente de Bootstrap para agrupar elementos del formulario */}
          <Form.Group className="mb-4">
            <Form.Label>Filtrar por categoría:</Form.Label>
            {/* Form.Select: Componente de Bootstrap para select (dropdown) */}
            {/* value: Valor controlado del select */}
            {/* onChange: Actualiza el filtro */}
            <Form.Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'accessory' | 'supplement')}
            >
              <option value="all">Todas las categorías</option>
              <option value="accessory">Accesorios</option>
              <option value="supplement">Suplementos</option>
            </Form.Select>
          </Form.Group>

          {/* Row: Fila para mostrar los productos */}
          <Row>
            {/* map: Método de array que itera sobre los productos filtrados */}
            {/* Col: Columna para cada producto (responsive: 3 columnas en desktop, 1 en móvil) */}
            {filteredProducts().map((product) => (
              <Col key={product.id} xs={12} md={6} lg={4} className="mb-4">
                {/* Card: Componente de Bootstrap para crear tarjetas */}
                <Card className="h-100">
                  {/* Imagen del producto */}
                  {/* variant: Posición de la imagen (top = arriba) */}
                  {/* src: URL de la imagen */}
                  {/* alt: Texto alternativo para accesibilidad */}
                  {/* style: Estilos inline */}
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  
                  {/* Card.Body: Cuerpo de la tarjeta */}
                  <Card.Body className="d-flex flex-column">
                    {/* Badge: Componente de Bootstrap para etiquetas */}
                    {/* bg: Color de fondo según categoría */}
                    <Badge
                      bg={product.category === 'accessory' ? 'primary' : 'success'}
                      className="mb-2"
                    >
                      {/* capitalizeFirst: Helper para capitalizar primera letra */}
                      {product.category === 'accessory' ? 'Accesorio' : 'Suplemento'}
                    </Badge>

                    {/* Card.Title: Título de la tarjeta */}
                    <Card.Title>{product.name}</Card.Title>

                    {/* Card.Text: Texto de la tarjeta */}
                    <Card.Text>{product.description}</Card.Text>

                    {/* Información del producto */}
                    <div className="mt-auto">
                      {/* Precio del producto */}
                      <h5 className="text-primary mb-2">
                        ${product.price.toFixed(2)} {/* toFixed: Formatea el número a 2 decimales */}
                      </h5>

                      {/* Stock disponible */}
                      <p className="text-muted mb-2">
                        Stock: {product.stock} {/* Muestra la cantidad disponible */}
                      </p>

                      {/* Button: Botón para comprar */}
                      {/* variant: Estilo del botón */}
                      {/* className: Clase CSS (w-100 = width 100%) */}
                      {/* onClick: Ejecuta la función de compra */}
                      {/* disabled: Desactiva si no hay stock o no es usuario */}
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => handlePurchase(product)}
                        disabled={product.stock <= 0 || !authData.isAuthenticated || authData.user?.role !== UserRole.USER}
                      >
                        {/* Condicional: Si no hay stock muestra "Agotado", sino "Comprar" */}
                        {product.stock <= 0 ? 'Agotado' : 'Comprar'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Mensaje si no hay productos */}
          {filteredProducts().length === 0 && (
            <Alert variant="info" className="mt-4">
              No hay productos disponibles en esta categoría.
            </Alert>
          )}
        </Col>
      </Row>
      </Container>
    </Container>
  );
};

