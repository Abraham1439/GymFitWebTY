// Página de tienda donde los usuarios pueden ver y comprar productos
// Functional Component: Componente de React definido como función
import { useState, useEffect } from 'react';
// useNavigate: Hook de react-router-dom para navegación programática
import { useNavigate } from 'react-router-dom';
// Importación de componentes de Bootstrap
import { Container, Row, Col, Card, Button, Badge, Alert, Form, InputGroup } from 'react-bootstrap';

// Importación de hooks y helpers
import { useCart } from '../../contexts/CartContext';
import { getFromLocalStorage, saveToLocalStorage, generateId } from '../../helpers';
// Importación de URLs de imágenes
import { PRODUCT_IMAGES } from '../../mockData';
// Importación de constantes de colores
import { COLORS } from '../../constants';
// Importación de tipos e interfaces
import type { Product } from '../../interfaces/gym.interfaces';
// Importación del servicio API
import { productoAPI, mapProductoToProduct } from '../../services/api';

// Constantes para las claves de localStorage
const STORAGE_KEY_PRODUCTS = 'gymProducts';    // Clave para almacenar productos

// Componente de página de tienda
// Functional Component: Componente funcional de React
export const StorePage = () => {
  // useNavigate: Hook que retorna una función para navegar programáticamente
  // Se utiliza para redirigir al usuario al carrito después de agregar un producto
  const navigate = useNavigate();

  // useCart: Hook personalizado que retorna las funciones del carrito
  // Se utiliza para agregar productos al carrito desde la tienda
  const { addToCart } = useCart();

  // useState: Hook de React para gestionar estado local
  // Estado para almacenar los productos disponibles
  const [products, setProducts] = useState<Product[]>([]); // Array vacío inicialmente

  // Estado para mensajes de éxito/error
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null); // null = sin mensaje

  // Estado para filtro de categoría
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'accessory' | 'supplement'>('all'); // 'all' = todas las categorías

  // Estado para búsqueda por texto
  const [searchQuery, setSearchQuery] = useState<string>(''); // String vacío = sin búsqueda

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Efecto que se ejecuta al montar el componente para cargar productos
  useEffect(() => {
    // Carga los productos desde la API o localStorage
    loadProducts();
  }, []); // Array de dependencias vacío: se ejecuta solo al montar

  /**
   * Función helper para obtener la imagen correcta basada en el nombre del producto
   * @param productName - Nombre del producto
   * @returns URL de la imagen correspondiente
   */
  const getProductImageUrl = (productName: string): string => {
    const name = productName.toLowerCase();
    
    if (name.includes('cinturón') || name.includes('cinturon')) {
      return PRODUCT_IMAGES.CINTURON;
    }
    if (name.includes('guantes')) {
      return PRODUCT_IMAGES.GUANTES;
    }
    if (name.includes('bandas')) {
      return PRODUCT_IMAGES.BANDAS;
    }
    if (name.includes('proteína') || name.includes('proteina') || name.includes('whey')) {
      return PRODUCT_IMAGES.PROTEINA;
    }
    if (name.includes('creatina')) {
      return PRODUCT_IMAGES.CREATINA;
    }
    if (name.includes('bcaa')) {
      return PRODUCT_IMAGES.BCAA;
    }
    
    return PRODUCT_IMAGES.DEFAULT;
  };

  /**
   * Carga los productos desde la API o localStorage como fallback
   * void: Tipo que indica que la función no retorna valor
   */
  const loadProducts = async (): Promise<void> => {
    try {
      // Intenta cargar productos desde la API del microservicio
      const productosBackend = await productoAPI.getActivos();
      
      if (productosBackend && productosBackend.length > 0) {
        // Mapea los productos del backend al formato del frontend
        const productosMapeados = productosBackend.map((producto) => {
          const product = mapProductoToProduct(producto);
          // Actualiza la imagen si es necesario
          return {
            ...product,
            image: getProductImageUrl(product.name) || product.image
          };
        });
        
        // Guarda en localStorage como cache
        saveToLocalStorage(STORAGE_KEY_PRODUCTS, productosMapeados);
        // Actualiza el estado
        setProducts(productosMapeados);
        return;
      }
    } catch (error) {
      // Si la API falla, usa localStorage como fallback
      console.warn('API no disponible, usando localStorage:', error);
    }

    // Fallback: Obtiene los productos guardados en localStorage
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
          image: PRODUCT_IMAGES.CINTURON,      // URL de imagen desde mockData
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
          image: PRODUCT_IMAGES.GUANTES,       // URL de imagen desde mockData
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
          image: PRODUCT_IMAGES.PROTEINA,      // URL de imagen desde mockData
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
          image: PRODUCT_IMAGES.CREATINA,      // URL de imagen desde mockData
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
          image: PRODUCT_IMAGES.BANDAS,        // URL de imagen desde mockData
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
          image: PRODUCT_IMAGES.BCAA,          // URL de imagen desde mockData
          stock: 12,
          createdAt: new Date().toISOString()
        }
      ];

      // Guarda los productos iniciales en localStorage
      saveToLocalStorage(STORAGE_KEY_PRODUCTS, initialProducts);
      // Actualiza el estado con los productos iniciales
      setProducts(initialProducts);
    } else {
      // Si ya hay productos, actualiza las imágenes si tienen URLs de placeholder
      const updatedProducts = savedProducts.map((product) => {
        // Si la imagen es un placeholder o no coincide con las nuevas URLs, actualízala
        const isPlaceholder = product.image.includes('placeholder.com') || 
                             product.image.includes('via.placeholder');
        
        if (isPlaceholder) {
          return {
            ...product,
            image: getProductImageUrl(product.name)
          };
        }
        return product;
      });
      
      // Guarda los productos actualizados en localStorage
      saveToLocalStorage(STORAGE_KEY_PRODUCTS, updatedProducts);
      // Actualiza el estado con los productos actualizados
      setProducts(updatedProducts);
    }
  };

  /**
   * Maneja el botón "Comprar" - agrega el producto al carrito y redirige al carrito
   * @param product - Producto a agregar al carrito
   */
  const handlePurchase = (product: Product): void => {
    // Verifica que haya stock disponible
    if (product.stock <= 0) {
      setMessage({ type: 'danger', text: 'Producto agotado' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Agrega el producto al carrito
    addToCart(product, 1);
    
    // Muestra mensaje de éxito
    setMessage({ type: 'success', text: `${product.name} agregado al carrito` });
    
    // Redirige a la página del carrito después de un breve delay
    setTimeout(() => {
      navigate('/cart');
    }, 500); // 500ms de delay para que el usuario vea el mensaje
  };

  /**
   * Normaliza una cadena removiendo acentos y convirtiendo a minúsculas
   * @param str - Cadena a normalizar
   * @returns Cadena normalizada sin acentos y en minúsculas
   */
  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD') // Normaliza a Forma de Descomposición (NFD)
      .replace(/[\u0300-\u036f]/g, ''); // Elimina los caracteres diacríticos (acentos)
  };

  /**
   * Filtra los productos por múltiples criterios: categoría y búsqueda de texto
   * @returns Array de productos filtrados
   */
  const filteredProducts = (): Product[] => {
    let filtered = [...products];

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Filtro por búsqueda de texto (nombre o descripción) - ignora acentos
    if (searchQuery.trim() !== '') {
      const normalizedQuery = normalizeString(searchQuery.trim());
      filtered = filtered.filter((p) => {
        const normalizedName = normalizeString(p.name);
        const normalizedDescription = normalizeString(p.description);
        return (
          normalizedName.includes(normalizedQuery) ||
          normalizedDescription.includes(normalizedQuery)
        );
      });
    }

    return filtered;
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
          
          {/* Búsqueda por texto */}
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fa-solid fa-search me-2"></i>
              Buscar productos:
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o descripcion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar busqueda"
                >
                  <i className="fa-solid fa-times"></i>
                </Button>
              )}
            </InputGroup>
          </Form.Group>

          {/* Filtro: Categoría */}
          <Form.Group className="mb-4">
            <Form.Label>Filtrar por categoria:</Form.Label>
            <Form.Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'accessory' | 'supplement')}
            >
              <option value="all">Todas las categorias</option>
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
                  {/* Card.Img: Imagen clickeable para ver detalles */}
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

                    {/* Card.Title: Título clickeable para ver detalles */}
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

                    {/* Card.Text: Texto de la tarjeta */}
                    <Card.Text>{product.description}</Card.Text>

                    {/* Información del producto */}
                    <div className="mt-auto">
                      {/* Precio del producto */}
                      <h5 style={{ color: COLORS.COLOR_3 }} className="mb-2">
                        ${product.price.toFixed(2)} {/* toFixed: Formatea el número a 2 decimales */}
                      </h5>

                      {/* Stock disponible */}
                      <p className="text-muted mb-2">
                        Stock: {product.stock} {/* Muestra la cantidad disponible */}
                      </p>

                      {/* Button: Botón para comprar - agrega al carrito y redirige */}
                      {/* variant: Estilo del botón */}
                      {/* className: Clase CSS (w-100 = width 100%) */}
                      {/* onClick: Ejecuta la función que agrega al carrito y redirige */}
                      {/* disabled: Desactiva si no hay stock */}
                      <Button
                        variant="primary"
                        className="w-100 mb-2"
                        onClick={() => handlePurchase(product)}
                        disabled={product.stock <= 0}
                        style={{ backgroundColor: COLORS.COLOR_3, borderColor: COLORS.COLOR_3 }}
                      >
                        {/* Condicional: Si no hay stock muestra "Agotado", sino "Comprar" */}
                        {product.stock <= 0 ? 'Agotado' : 'Comprar'}
                      </Button>

                      {/* Button: Botón para agregar al carrito */}
                      {/* variant: Estilo del botón (outline-primary = borde azul) */}
                      {/* onClick: Ejecuta la función de agregar al carrito */}
                      {/* disabled: Desactiva si no hay stock */}
                      <Button
                        variant="outline"
                        className="w-100"
                        onClick={() => {
                          if (product.stock <= 0) {
                            setMessage({ type: 'danger', text: 'Producto agotado' });
                            setTimeout(() => setMessage(null), 3000);
                            return;
                          }
                          addToCart(product, 1);
                          setMessage({ type: 'success', text: `${product.name} agregado al carrito` });
                          setTimeout(() => setMessage(null), 3000);
                        }}
                        disabled={product.stock <= 0}
                        style={{ borderColor: COLORS.COLOR_3, color: COLORS.COLOR_3 }}
                      >
                        <i className="fa-solid fa-cart-plus me-2"></i>
                        Agregar al carrito
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

