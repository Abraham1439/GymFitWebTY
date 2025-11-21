# Servicio API - Integración con Microservicios

Este servicio proporciona funciones para comunicarse con los microservicios de QualifyGym.

## Configuración

Las URLs base de los microservicios están definidas en `api.ts`:

```typescript
const API_BASE_URL = {
  usuarios: 'http://localhost:8081/api/v1/usuarios',
  productos: 'http://localhost:8082/api/v1/productos',
  ordenes: 'http://localhost:8083/api/v1/ordenes',
  pagos: 'http://localhost:8084/api/v1/pagos'
};
```

Si necesitas cambiar los puertos o URLs, modifica estas constantes.

## Uso

### Usuarios

```typescript
import { usuarioAPI } from '../services/api';

// Login
const usuario = await usuarioAPI.login('email@example.com', 'password');

// Registro
const nuevoUsuario = await usuarioAPI.register({
  username: 'Juan',
  email: 'juan@example.com',
  phone: '+56912345678',
  password: 'password123',
  rolId: 2 // 1=Admin, 2=Usuario, 3=Vendedor
});
```

### Productos

```typescript
import { productoAPI } from '../services/api';

// Obtener productos activos
const productos = await productoAPI.getActivos();

// Crear producto
const producto = await productoAPI.create({
  nombre: 'Proteína Whey',
  descripcion: 'Proteína de suero',
  precio: 29990.00,
  stock: 50,
  categoriaId: 1,
  activo: true
});
```

### Órdenes

```typescript
import { ordenAPI } from '../services/api';

// Crear orden
const orden = await ordenAPI.create({
  usuarioId: 1,
  total: 59980.00,
  estado: 'PENDIENTE'
});
```

### Pagos

```typescript
import { pagoAPI } from '../services/api';

// Crear pago
const pago = await pagoAPI.create({
  ordenId: 1,
  usuarioId: 1,
  monto: 59980.00,
  metodoPago: 'TARJETA',
  estado: 'COMPLETADO'
});
```

## Manejo de Errores

El servicio incluye manejo de errores automático. Si un microservicio no está disponible, las funciones que usan el servicio API tienen fallback a localStorage.

## Mapeo de Datos

El servicio incluye funciones helper para mapear datos del backend al formato del frontend:

- `mapUsuarioToUser()` - Convierte UsuarioBackend a User
- `mapProductoToProduct()` - Convierte ProductoBackend a Product

