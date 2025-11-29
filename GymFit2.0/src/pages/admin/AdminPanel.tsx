// Panel de administrador donde puede gestionar usuarios (editar y borrar)
// Functional Component: Componente de React definido como función
import { useState, useEffect } from 'react';
// Importación de componentes de Bootstrap
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';

// Importación de hooks y helpers
import { useAuth } from '../../contexts/AuthContext';
import { getFromLocalStorage, saveToLocalStorage, formatDate, generateId } from '../../helpers';
// Importación de servicios API
import { productosService } from '../../services/productosService';
// Importación de tipos e interfaces
import type { User, Trainer, Product } from '../../interfaces/gym.interfaces';
import { UserRole } from '../../interfaces/gym.interfaces';

// Constantes para las claves de localStorage
const STORAGE_KEY_USERS = 'gymUsers';          // Clave para almacenar usuarios
const STORAGE_KEY_TRAINERS = 'gymTrainers';    // Clave para almacenar entrenadores
// NOTA: Los productos ahora se guardan en el microservicio de Productos, no en localStorage

// Componente de panel de administrador
// Functional Component: Componente funcional de React
export const AdminPanel = () => {
  // useAuth: Hook personalizado que retorna los datos de autenticación
  // Se utiliza para verificar que el usuario esté autenticado y sea administrador
  // También se usa para prevenir que el admin elimine su propia cuenta
  const { authData } = useAuth();

  // useState: Hook de React para gestionar estado local
  // Estado para almacenar todos los usuarios
  const [users, setUsers] = useState<User[]>([]); // Array vacío inicialmente

  // Estado para almacenar todos los productos
  const [products, setProducts] = useState<Product[]>([]); // Array vacío inicialmente

  // Estado para el modal de edición de usuario
  const [showEditModal, setShowEditModal] = useState<boolean>(false); // false = modal cerrado

  // Estado para el modal de eliminación de usuario
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // false = modal cerrado

  // Estado para el modal de creación de producto
  const [showCreateProductModal, setShowCreateProductModal] = useState<boolean>(false); // false = modal cerrado

  // Estado para el modal de edición de stock
  const [showEditStockModal, setShowEditStockModal] = useState<boolean>(false); // false = modal cerrado

  // Estado para el modal de eliminación de producto
  const [showDeleteProductModal, setShowDeleteProductModal] = useState<boolean>(false); // false = modal cerrado

  // Estado para el usuario seleccionado para editar o eliminar
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // null = ninguno seleccionado

  // Estado para el producto seleccionado para editar stock o eliminar
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // null = ninguno seleccionado

  // Estado para los datos del formulario de edición de usuario
  const [editFormData, setEditFormData] = useState<Partial<User>>({}); // Objeto vacío inicialmente

  // Estado para los datos del formulario de creación de producto
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'accessory',
    image: 'https://via.placeholder.com/150x150?text=Producto'
  }); // Objeto con valores iniciales

  // Estado para el stock a editar
  const [stockValue, setStockValue] = useState<number>(0); // Número inicialmente 0

  // Estado para mensajes de éxito/error
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null); // null = sin mensaje

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Efecto que se ejecuta al montar el componente para cargar datos iniciales
  // Carga todos los usuarios y productos que el administrador puede gestionar
  useEffect(() => {
    // Carga los usuarios desde localStorage
    loadUsers();
    // Carga los productos desde el microservicio
    loadProducts();
  }, []); // Array de dependencias vacío: se ejecuta solo al montar

  /**
   * Carga todos los usuarios desde localStorage
   * void: Tipo que indica que la función no retorna valor
   */
  const loadUsers = (): void => {
    // Obtiene todos los usuarios guardados en localStorage
    const savedUsers = getFromLocalStorage<User[]>(STORAGE_KEY_USERS) || [];
    // Actualiza el estado con los usuarios
    setUsers(savedUsers);
  };

  /**
   * Carga todos los productos desde el microservicio de Productos
   */
  const loadProducts = async (): Promise<void> => {
    try {
      // Carga los productos desde el microservicio
      const productos = await productosService.getAll();
      
      // Convierte los productos del API al formato del frontend
      const convertedProducts: Product[] = productos.map(producto => ({
        id: producto.id.toString(),
        name: producto.nombre,
        description: producto.descripcion,
        price: producto.precio,
        category: producto.categoria as 'accessory' | 'supplement',
        image: producto.imagen || 'https://via.placeholder.com/150x150?text=Producto',
        stock: producto.stock,
        createdAt: new Date().toISOString()
      }));
      
      // Actualiza el estado con los productos del microservicio
      setProducts(convertedProducts);
    } catch (error) {
      console.error('Error loading products from API:', error);
      setProducts([]);
    }
  };

  /**
   * Abre el modal para editar un usuario
   * @param user - Usuario a editar
   */
  const handleEditClick = (user: User): void => {
    // Establece el usuario seleccionado
    setSelectedUser(user);
    // Inicializa el formulario con los datos del usuario
    setEditFormData({
      name: user.name,              // Nombre del usuario
      email: user.email,             // Email del usuario
      role: user.role,               // Rol del usuario
      phone: user.phone || '',       // Teléfono (vacío si no existe)
      address: user.address || ''    // Dirección (vacía si no existe)
    });
    // Abre el modal
    setShowEditModal(true);
  };

  /**
   * Abre el modal para eliminar un usuario
   * @param user - Usuario a eliminar
   */
  const handleDeleteClick = (user: User): void => {
    // Establece el usuario seleccionado
    setSelectedUser(user);
    // Abre el modal
    setShowDeleteModal(true);
  };

  /**
   * Maneja el cambio en los campos del formulario de edición
   * @param e - Evento de cambio del input
   * Event: Tipo de evento de React
   */
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    // Obtiene el nombre y valor del campo que cambió
    const { name, value } = e.target;
    
    // Actualiza el estado del formulario con el nuevo valor
    // setState con función: Actualiza el estado basado en el estado anterior
    setEditFormData((prev) => ({
      ...prev,                    // Spread operator: Copia todas las propiedades anteriores
      [name]: value               // Computed property name: Actualiza solo el campo que cambió
    }));
  };

  /**
   * Guarda los cambios del usuario editado
   */
  const saveEdit = (): void => {
    // Verifica que haya un usuario seleccionado y datos del formulario
    if (!selectedUser || !editFormData.name || !editFormData.email) {
      setMessage({ type: 'danger', text: 'Por favor completa todos los campos requeridos' });
      // setTimeout: Función que ejecuta código después de un tiempo
      setTimeout(() => setMessage(null), 3000); // Limpia el mensaje después de 3 segundos
      return;                     // Sale de la función si faltan datos
    }

    try {
      // Obtiene todos los usuarios
      const allUsers = getFromLocalStorage<User[]>(STORAGE_KEY_USERS) || [];

      // Actualiza el usuario seleccionado
      // map: Método de array que crea un nuevo array transformando cada elemento
      const updatedUsers = allUsers.map((u) => {
        if (u.id === selectedUser.id) {
          // Si es el usuario seleccionado, actualiza sus datos
          return {
            ...u,                              // Spread operator: copia todas las propiedades
            name: editFormData.name!,          // Actualiza el nombre (non-null assertion: !)
            email: editFormData.email!,        // Actualiza el email
            role: editFormData.role || u.role, // Actualiza el rol (o mantiene el anterior)
            phone: editFormData.phone,         // Actualiza el teléfono
            address: editFormData.address      // Actualiza la dirección
          };
        }
        return u;                              // Retorna el usuario sin cambios
      });

      // Guarda los usuarios actualizados en localStorage
      saveToLocalStorage(STORAGE_KEY_USERS, updatedUsers);

      // Si el rol cambió a TRAINER, crea el perfil de entrenador
      const updatedUser = updatedUsers.find((u) => u.id === selectedUser.id);
      if (updatedUser && editFormData.role === UserRole.TRAINER && selectedUser.role !== UserRole.TRAINER) {
        // Obtiene todos los entrenadores
        const trainers = getFromLocalStorage<Trainer[]>(STORAGE_KEY_TRAINERS) || [];
        
        // Verifica si ya existe un perfil de entrenador para este usuario
        const existingTrainer = trainers.find((t) => t.userId === updatedUser.id);
        
        // Si no existe, crea un nuevo perfil de entrenador
        if (!existingTrainer) {
          const newTrainer: Trainer = {
            id: generateId(),                    // Genera un ID único
            userId: updatedUser.id,              // ID del usuario entrenador
            name: updatedUser.name,              // Nombre del entrenador
            specialization: 'General',           // Especialización por defecto
            experience: 0,                       // Años de experiencia (0 por defecto)
            price: 0,                            // Precio por hora (0 por defecto)
            description: 'Entrenador asignado por administrador', // Descripción
            rating: 0,                          // Calificación inicial (0)
            image: 'https://via.placeholder.com/300x300?text=Trainer', // Imagen placeholder
            available: true                      // Disponible por defecto
          };
          
          // Agrega el nuevo entrenador al array
          trainers.push(newTrainer);
          
          // Guarda los entrenadores actualizados en localStorage
          saveToLocalStorage(STORAGE_KEY_TRAINERS, trainers);
        }
      }

      // Actualiza el estado local
      setUsers(updatedUsers);

      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: 'Usuario actualizado correctamente' });
      setTimeout(() => setMessage(null), 3000);

      // Cierra el modal
      setShowEditModal(false);
      // Limpia el usuario seleccionado
      setSelectedUser(null);
      // Limpia el formulario
      setEditFormData({});

    } catch (error) {
      // Manejo de errores
      console.error('Error al actualizar usuario:', error);
      setMessage({ type: 'danger', text: 'Error al actualizar el usuario' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  /**
   * Elimina un usuario
   */
  const confirmDelete = (): void => {
    // Verifica que haya un usuario seleccionado
    if (!selectedUser) {
      return;                     // Sale de la función si no hay usuario
    }

    // Previene la eliminación del propio usuario administrador
    if (selectedUser.id === authData.user?.id) {
      setMessage({ type: 'danger', text: 'No puedes eliminar tu propia cuenta' });
      setTimeout(() => setMessage(null), 3000);
      setShowDeleteModal(false); // Cierra el modal
      return;
    }

    try {
      // Obtiene todos los usuarios
      const allUsers = getFromLocalStorage<User[]>(STORAGE_KEY_USERS) || [];

      // Filtra el usuario eliminado
      // filter: Método de array que retorna elementos que cumplen una condición
      const updatedUsers = allUsers.filter((u) => u.id !== selectedUser.id);

      // Guarda los usuarios actualizados en localStorage
      saveToLocalStorage(STORAGE_KEY_USERS, updatedUsers);

      // Actualiza el estado local
      setUsers(updatedUsers);

      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: 'Usuario eliminado correctamente' });
      setTimeout(() => setMessage(null), 3000);

      // Cierra el modal
      setShowDeleteModal(false);
      // Limpia el usuario seleccionado
      setSelectedUser(null);

    } catch (error) {
      // Manejo de errores
      console.error('Error al eliminar usuario:', error);
      setMessage({ type: 'danger', text: 'Error al eliminar el usuario' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  /**
   * Obtiene el texto del rol en español
   * @param role - Rol del usuario
   * @returns Texto del rol en español
   */
  const getRoleText = (role: UserRole): string => {
    // switch: Estructura de control para múltiples condiciones
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.USER:
        return 'Usuario';
      case UserRole.TRAINER:
        return 'Entrenador';
      default:
        return 'Desconocido';
    }
  };

  /**
   * Abre el modal para crear un nuevo producto
   */
  const handleCreateProduct = (): void => {
    // Limpia el formulario con valores iniciales
    setProductFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'accessory',
      image: 'https://via.placeholder.com/150x150?text=Producto'
    });
    // Abre el modal
    setShowCreateProductModal(true);
  };

  /**
   * Maneja el cambio en los campos del formulario de producto
   * @param e - Evento de cambio del input
   */
  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    // Obtiene el nombre y valor del campo que cambió
    const { name, value } = e.target;
    
    // Actualiza el estado del formulario con el nuevo valor
    setProductFormData((prev) => ({
      ...prev,                    // Spread operator: Copia todas las propiedades anteriores
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value // Convierte a número si es price o stock
    }));
  };

  /**
   * Guarda el nuevo producto en el microservicio de Productos
   */
  const saveProduct = async (): Promise<void> => {
    // Valida que todos los campos requeridos estén completos
    if (!productFormData.name || !productFormData.description || !productFormData.price || productFormData.stock === undefined) {
      setMessage({ type: 'danger', text: 'Por favor completa todos los campos requeridos' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      // Crea el producto en el microservicio
      const nuevoProducto = await productosService.create({
        nombre: productFormData.name!,
        descripcion: productFormData.description!,
        precio: productFormData.price!,
        categoria: productFormData.category!,
        imagen: productFormData.image || undefined,
        stock: productFormData.stock!
      });

      if (!nuevoProducto) {
        throw new Error('No se pudo crear el producto');
      }

      // Recarga los productos desde el microservicio para actualizar la lista
      await loadProducts();

      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: 'Producto creado correctamente' });
      setTimeout(() => setMessage(null), 3000);

      // Cierra el modal
      setShowCreateProductModal(false);
      // Limpia el formulario
      setProductFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'accessory',
        image: 'https://via.placeholder.com/150x150?text=Producto'
      });

    } catch (error) {
      // Manejo de errores
      console.error('Error al crear producto:', error);
      setMessage({ type: 'danger', text: 'Error al crear el producto. Verifica que el microservicio esté disponible.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  /**
   * Abre el modal para editar el stock de un producto
   * @param product - Producto a editar stock
   */
  const handleEditStockClick = (product: Product): void => {
    // Establece el producto seleccionado
    setSelectedProduct(product);
    // Inicializa el valor del stock con el stock actual
    setStockValue(product.stock);
    // Abre el modal
    setShowEditStockModal(true);
  };

  /**
   * Guarda el stock editado en el microservicio
   */
  const saveStock = async (): Promise<void> => {
    // Verifica que haya un producto seleccionado y un valor de stock válido
    if (!selectedProduct || stockValue < 0) {
      setMessage({ type: 'danger', text: 'Por favor ingresa un stock válido (mayor o igual a 0)' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      // Actualiza el stock en el microservicio
      const productoId = parseInt(selectedProduct.id);
      const diferenciaStock = stockValue - selectedProduct.stock; // Diferencia entre el nuevo stock y el actual
      
      const productoActualizado = await productosService.updateStock(productoId, diferenciaStock);

      if (!productoActualizado) {
        throw new Error('No se pudo actualizar el stock');
      }

      // Recarga los productos desde el microservicio para actualizar la lista
      await loadProducts();

      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: 'Stock actualizado correctamente' });
      setTimeout(() => setMessage(null), 3000);

      // Cierra el modal
      setShowEditStockModal(false);
      // Limpia el producto seleccionado
      setSelectedProduct(null);
      // Limpia el valor del stock
      setStockValue(0);

    } catch (error) {
      // Manejo de errores
      console.error('Error al actualizar stock:', error);
      setMessage({ type: 'danger', text: 'Error al actualizar el stock. Verifica que el microservicio esté disponible.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  /**
   * Abre el modal para eliminar un producto
   * @param product - Producto a eliminar
   */
  const handleDeleteProductClick = (product: Product): void => {
    // Establece el producto seleccionado
    setSelectedProduct(product);
    // Abre el modal
    setShowDeleteProductModal(true);
  };

  /**
   * Elimina un producto del microservicio
   */
  const confirmDeleteProduct = async (): Promise<void> => {
    // Verifica que haya un producto seleccionado
    if (!selectedProduct) {
      return;                     // Sale de la función si no hay producto
    }

    try {
      // Elimina el producto del microservicio
      const productoId = parseInt(selectedProduct.id);
      const eliminado = await productosService.delete(productoId);

      if (!eliminado) {
        throw new Error('No se pudo eliminar el producto');
      }

      // Recarga los productos desde el microservicio para actualizar la lista
      await loadProducts();

      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: 'Producto eliminado correctamente' });
      setTimeout(() => setMessage(null), 3000);

      // Cierra el modal
      setShowDeleteProductModal(false);
      // Limpia el producto seleccionado
      setSelectedProduct(null);

    } catch (error) {
      // Manejo de errores
      console.error('Error al eliminar producto:', error);
      setMessage({ type: 'danger', text: 'Error al eliminar el producto' });
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
            Panel de Administración
          </h1>
        </div>
      </div>

      {/* Container: Contenedor principal del contenido */}
      <Container className="pt-1 pb-4">
        {/* Row: Componente de Bootstrap para crear filas */}
        <Row>
          {/* Col: Componente de Bootstrap para crear columnas */}
          <Col>

          {/* Información del administrador */}
          {/* mb-1: Margin-bottom mínimo (1 = margin muy pequeño abajo) */}
          <Card className="mb-1">
            <Card.Body>
              <h5>Bienvenido, {authData.user?.name}</h5>
              <p className="text-muted mb-0">
                Aquí puedes gestionar todos los usuarios del sistema (editar y eliminar).
              </p>
            </Card.Body>
          </Card>

          {/* Alert: Componente de Bootstrap para mostrar mensajes */}
          {message && (
            <Alert variant={message.type} className="mb-3">
              {message.text}
            </Alert>
          )}

          {/* Card: Componente de Bootstrap para crear tarjetas */}
          <Card className="mb-4">
            {/* Card.Header: Encabezado de la tarjeta */}
            <Card.Header>
              <h4>Lista de Usuarios</h4>
            </Card.Header>
            
            {/* Card.Body: Cuerpo de la tarjeta */}
            <Card.Body>
              {/* Table: Componente de Bootstrap para tablas */}
              <Table striped bordered hover responsive>
                {/* thead: Encabezado de la tabla */}
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Teléfono</th>
                    <th>Fecha de Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                
                {/* tbody: Cuerpo de la tabla */}
                <tbody>
                  {/* map: Método de array que itera sobre los usuarios */}
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          {/* Badge: Componente de Bootstrap para etiquetas */}
                          <Badge
                            bg={
                              user.role === UserRole.ADMIN
                                ? 'danger'
                                : user.role === UserRole.TRAINER
                                ? 'primary'
                                : 'success'
                            }
                          >
                            {getRoleText(user.role)}
                          </Badge>
                        </td>
                        <td>{user.phone || 'N/A'}</td>
                        {/* Condicional: Muestra teléfono o "N/A" si no existe */}
                        <td>{formatDate(user.createdAt)}</td>
                        {/* formatDate: Helper para formatear fecha */}
                        <td>
                          {/* Button: Botón para editar */}
                          {/* onClick: Ejecuta la función de editar */}
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditClick(user)}
                          >
                            Editar
                          </Button>
                          {/* Button: Botón para eliminar */}
                          {/* onClick: Ejecuta la función de eliminar */}
                          {/* disabled: Desactiva si es el propio usuario */}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            disabled={user.id === authData.user?.id}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Si no hay usuarios, muestra un mensaje
                    // Fragment: React Fragment para agrupar elementos sin agregar nodo DOM
                    <tr key="no-users">
                      <td colSpan={6} className="text-center text-muted">
                        No hay usuarios registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Card: Componente de Bootstrap para crear tarjetas - Productos */}
          <Card>
            {/* Card.Header: Encabezado de la tarjeta */}
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Lista de Productos</h4>
              {/* Button: Botón para crear nuevo producto */}
              <Button variant="success" onClick={handleCreateProduct}>
                <i className="fa-solid fa-plus me-2"></i>
                Agregar Producto
              </Button>
            </Card.Header>
            
            {/* Card.Body: Cuerpo de la tarjeta */}
            <Card.Body>
              {/* Table: Componente de Bootstrap para tablas */}
              <Table striped bordered hover responsive>
                {/* thead: Encabezado de la tabla */}
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                
                {/* tbody: Cuerpo de la tabla */}
                <tbody>
                  {/* map: Método de array que itera sobre los productos */}
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>${product.price.toFixed(2)}</td>
                        {/* toFixed: Formatea el número a 2 decimales */}
                        <td>
                          {/* Badge: Componente de Bootstrap para etiquetas de stock */}
                          <Badge
                            bg={product.stock > 0 ? 'success' : 'danger'}
                          >
                            {product.stock}
                          </Badge>
                        </td>
                        <td>
                          {/* Badge: Componente de Bootstrap para etiquetas de categoría */}
                          <Badge
                            bg={product.category === 'accessory' ? 'primary' : 'info'}
                          >
                            {product.category === 'accessory' ? 'Accesorio' : 'Suplemento'}
                          </Badge>
                        </td>
                        <td>
                          {/* Button: Botón para editar stock */}
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditStockClick(product)}
                          >
                            Editar Stock
                          </Button>
                          {/* Button: Botón para eliminar producto */}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteProductClick(product)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Si no hay productos, muestra un mensaje
                    <tr key="no-products">
                      <td colSpan={6} className="text-center text-muted">
                        No hay productos registrados. Haz clic en "Agregar Producto" para crear uno.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal: Componente de Bootstrap para mostrar diálogos - Crear Producto */}
      <Modal show={showCreateProductModal} onHide={() => setShowCreateProductModal(false)}>
        {/* Modal.Header: Encabezado del modal */}
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Producto</Modal.Title>
        </Modal.Header>
        
        {/* Modal.Body: Cuerpo del modal */}
        <Modal.Body>
          {/* Form: Componente de Bootstrap para formularios */}
          <Form>
            {/* Form.Group: Componente de Bootstrap para agrupar elementos del formulario */}
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={productFormData.name || ''}
                onChange={handleProductFormChange}
                placeholder="Ej: Proteína Whey"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={productFormData.description || ''}
                onChange={handleProductFormChange}
                placeholder="Descripción del producto"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={productFormData.price || 0}
                onChange={handleProductFormChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock Inicial</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={productFormData.stock || 0}
                onChange={handleProductFormChange}
                min="0"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="category"
                value={productFormData.category || 'accessory'}
                onChange={handleProductFormChange}
              >
                <option value="accessory">Accesorio</option>
                <option value="supplement">Suplemento</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={productFormData.image || ''}
                onChange={handleProductFormChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        
        {/* Modal.Footer: Pie del modal */}
        <Modal.Footer>
          {/* Button: Botón para cancelar */}
          <Button variant="secondary" onClick={() => setShowCreateProductModal(false)}>
            Cancelar
          </Button>
          {/* Button: Botón para guardar */}
          <Button variant="success" onClick={saveProduct}>
            Crear Producto
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Componente de Bootstrap para mostrar diálogos - Editar Stock */}
      <Modal show={showEditStockModal} onHide={() => setShowEditStockModal(false)}>
        {/* Modal.Header: Encabezado del modal */}
        <Modal.Header closeButton>
          <Modal.Title>Editar Stock</Modal.Title>
        </Modal.Header>
        
        {/* Modal.Body: Cuerpo del modal */}
        <Modal.Body>
          {selectedProduct && (
            <>
              {/* Información del producto */}
              <p>
                Producto: <strong>{selectedProduct.name}</strong>
              </p>
              <p>
                Stock actual: <strong>{selectedProduct.stock}</strong>
              </p>

              {/* Form.Group: Componente de Bootstrap para agrupar elementos del formulario */}
              <Form.Group className="mt-3">
                <Form.Label>Nuevo Stock</Form.Label>
                <Form.Control
                  type="number"
                  value={stockValue}
                  onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
                  min="0"
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        
        {/* Modal.Footer: Pie del modal */}
        <Modal.Footer>
          {/* Button: Botón para cancelar */}
          <Button variant="secondary" onClick={() => setShowEditStockModal(false)}>
            Cancelar
          </Button>
          {/* Button: Botón para guardar */}
          <Button variant="primary" onClick={saveStock}>
            Guardar Stock
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Componente de Bootstrap para mostrar diálogos - Eliminar Producto */}
      <Modal show={showDeleteProductModal} onHide={() => setShowDeleteProductModal(false)}>
        {/* Modal.Header: Encabezado del modal */}
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        
        {/* Modal.Body: Cuerpo del modal */}
        <Modal.Body>
          {selectedProduct && (
            <>
              {/* Mensaje de confirmación */}
              <p>
                ¿Estás seguro de que deseas eliminar el producto <strong>{selectedProduct.name}</strong>?
              </p>
              <p className="text-danger">
                Esta acción no se puede deshacer.
              </p>
            </>
          )}
        </Modal.Body>
        
        {/* Modal.Footer: Pie del modal */}
        <Modal.Footer>
          {/* Button: Botón para cancelar */}
          <Button variant="secondary" onClick={() => setShowDeleteProductModal(false)}>
            Cancelar
          </Button>
          {/* Button: Botón para confirmar eliminación */}
          <Button variant="danger" onClick={confirmDeleteProduct}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Componente de Bootstrap para mostrar diálogos - Edición de Usuario */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        {/* Modal.Header: Encabezado del modal */}
        <Modal.Header closeButton>
          {/* closeButton: Muestra un botón de cerrar */}
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        
        {/* Modal.Body: Cuerpo del modal */}
        <Modal.Body>
          {selectedUser && (
            <>
              {/* Form: Componente de Bootstrap para formularios */}
              <Form>
                {/* Form.Group: Componente de Bootstrap para agrupar elementos del formulario */}
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  {/* Form.Control: Campo de entrada de Bootstrap */}
                  {/* type: Tipo de input HTML5 (texto) */}
                  {/* name: Nombre del campo */}
                  {/* value: Valor controlado del input */}
                  {/* onChange: Evento que se ejecuta al cambiar */}
                  {/* required: Atributo HTML5 para validación */}
                  <Form.Control
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  {/* type: Tipo de input HTML5 (email) */}
                  {/* name: Nombre del campo */}
                  {/* value: Valor controlado del input */}
                  {/* onChange: Evento que se ejecuta al cambiar */}
                  {/* required: Atributo HTML5 para validación */}
                  <Form.Control
                    type="email"
                    name="email"
                    value={editFormData.email || ''}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  {/* Form.Select: Componente de Bootstrap para select (dropdown) */}
                  {/* name: Nombre del campo */}
                  {/* value: Valor controlado del select */}
                  {/* onChange: Evento que se ejecuta al cambiar */}
                  <Form.Select
                    name="role"
                    value={editFormData.role || UserRole.USER}
                    onChange={handleEditChange}
                  >
                    {/* option: Elemento HTML para opciones del select */}
                    <option value={UserRole.USER}>Usuario</option>
                    <option value={UserRole.TRAINER}>Entrenador</option>
                    <option value={UserRole.ADMIN}>Administrador</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono (Opcional)</Form.Label>
                  {/* type: Tipo de input HTML5 (teléfono) */}
                  {/* name: Nombre del campo */}
                  {/* value: Valor controlado del input */}
                  {/* onChange: Evento que se ejecuta al cambiar */}
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={editFormData.phone || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección (Opcional)</Form.Label>
                  {/* type: Tipo de input HTML5 (texto) */}
                  {/* name: Nombre del campo */}
                  {/* value: Valor controlado del input */}
                  {/* onChange: Evento que se ejecuta al cambiar */}
                  <Form.Control
                    type="text"
                    name="address"
                    value={editFormData.address || ''}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        
        {/* Modal.Footer: Pie del modal */}
        <Modal.Footer>
          {/* Button: Botón para cancelar */}
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          {/* Button: Botón para guardar */}
          <Button variant="primary" onClick={saveEdit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Componente de Bootstrap para mostrar diálogos - Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        {/* Modal.Header: Encabezado del modal */}
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        
        {/* Modal.Body: Cuerpo del modal */}
        <Modal.Body>
          {selectedUser && (
            <>
              {/* Mensaje de confirmación */}
              <p>
                ¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-danger">
                Esta acción no se puede deshacer.
              </p>
            </>
          )}
        </Modal.Body>
        
        {/* Modal.Footer: Pie del modal */}
        <Modal.Footer>
          {/* Button: Botón para cancelar */}
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          {/* Button: Botón para confirmar eliminación */}
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </Container>
  );
};

