// Contexto de React para manejar el carrito de compras globalmente
// Context: API de React que permite compartir datos sin pasar props manualmente
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Importación de interfaces y tipos
import type { CartItem, Product } from '../interfaces/gym.interfaces';

// Importación de servicios API
import { carritoService, ItemCarrito } from '../services/carritoService';
import { productosService } from '../services/productosService';
import { useAuth } from './AuthContext';

// Interfaz que define la forma del contexto del carrito
interface CartContextType {
  cartItems: CartItem[];                    // Array de artículos en el carrito
  addToCart: (product: Product, quantity?: number) => Promise<void>; // Función para agregar producto al carrito
  removeFromCart: (productId: string) => Promise<void>; // Función para eliminar producto del carrito
  updateQuantity: (productId: string, quantity: number) => Promise<void>; // Función para actualizar cantidad
  clearCart: () => Promise<void>;                     // Función para vaciar el carrito
  getTotalItems: () => number;              // Función para obtener el total de artículos
  getTotalPrice: () => number;              // Función para obtener el precio total
}

// Creación del contexto del carrito
const CartContext = createContext<CartContextType | undefined>(undefined);

// Interfaz para las props del proveedor del contexto
interface CartProviderProps {
  children: ReactNode;
}

// Componente proveedor del contexto del carrito
export const CartProvider = ({ children }: CartProviderProps) => {
  // useState: Hook de React para gestionar estado local
  // Estado global que almacena todos los productos agregados al carrito de compras
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // Mapa para almacenar los IDs de los items del carrito (itemId -> CartItem)
  const [cartItemIds, setCartItemIds] = useState<Map<string, number>>(new Map());
  // Estado para rastrear el ID del usuario actual del carrito
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const { authData } = useAuth();

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Carga el carrito desde el microservicio cuando el usuario inicia sesión
  // Limpia el carrito cuando el usuario cierra sesión o cambia de usuario
  useEffect(() => {
    const loadCart = async () => {
      // Si el usuario no está autenticado, limpiar el carrito
      if (!authData.isAuthenticated || !authData.user) {
        setCartItems([]);
        setCartItemIds(new Map());
        setCurrentUserId(null);
        return;
      }

      const usuarioId = parseInt(authData.user.id);

      // Si cambió el usuario, limpiar el carrito antes de cargar el nuevo
      if (currentUserId !== null && currentUserId !== usuarioId) {
        setCartItems([]);
        setCartItemIds(new Map());
      }

      // Cargar el carrito del usuario actual
      try {
        const items = await carritoService.getCarritoByUsuario(usuarioId);
        
        // Cargar productos para obtener información completa
        const productos = await productosService.getAll();
        
        // Convertir items del API al formato del frontend
        const convertedItems: CartItem[] = [];
        const itemIdsMap = new Map<string, number>();
        
        for (const item of items) {
          const producto = productos.find(p => p.id === item.productoId);
          if (producto) {
            convertedItems.push({
              product: {
                id: producto.id.toString(),
                name: producto.nombre,
                price: producto.precio,
                description: producto.descripcion,
                category: producto.categoria,
                image: producto.imagen || '',
                stock: producto.stock
              },
              quantity: item.cantidad
            });
            // Guardar el itemId del carrito para poder actualizarlo después
            itemIdsMap.set(producto.id.toString(), item.id);
          }
        }
        
        setCartItems(convertedItems);
        setCartItemIds(itemIdsMap);
        setCurrentUserId(usuarioId);
      } catch (error) {
        console.error('Error loading cart from API:', error);
        // En caso de error, limpiar el carrito
        setCartItems([]);
        setCartItemIds(new Map());
        setCurrentUserId(null);
      }
    };
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData.isAuthenticated, authData.user?.id]); // Se ejecuta cuando cambia la autenticación o el ID del usuario

  /**
   * Agrega un producto al carrito
   * @param product - Producto a agregar
   * @param quantity - Cantidad a agregar (por defecto 1)
   */
  const addToCart = async (product: Product, quantity: number = 1): Promise<void> => {
    if (!authData.isAuthenticated || !authData.user) {
      console.error('User must be authenticated to add items to cart');
      return;
    }

    try {
      const usuarioId = parseInt(authData.user.id);
      const productoId = parseInt(product.id);
      
      // Busca si el producto ya está en el carrito
      const existingItem = cartItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Si ya existe, actualiza la cantidad en la BD
        const newQuantity = existingItem.quantity + quantity;
        const itemId = cartItemIds.get(product.id);
        
        if (itemId) {
          // Actualiza en la BD usando el itemId del carrito
          await carritoService.updateQuantity(itemId, newQuantity);
        } else {
          // Si no tiene itemId, agrega como nuevo item
          const newItem = await carritoService.addItem({
            usuarioId,
            productoId,
            cantidad: quantity,
            precioUnitario: product.price
          });
          if (newItem) {
            setCartItemIds(prev => new Map(prev).set(product.id, newItem.id));
          }
        }
        
        // Actualiza el estado local
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        // Si no existe, agrega el nuevo artículo al microservicio
        const newItem = await carritoService.addItem({
          usuarioId,
          productoId,
          cantidad: quantity,
          precioUnitario: product.price
        });
        
        if (newItem) {
          // Guarda el itemId para futuras actualizaciones
          setCartItemIds(prev => new Map(prev).set(product.id, newItem.id));
          
          // Actualiza el estado local
          setCartItems((prevItems) => [...prevItems, { product, quantity }]);
        }
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  /**
   * Elimina un producto del carrito
   * @param productId - ID del producto a eliminar
   */
  const removeFromCart = async (productId: string): Promise<void> => {
    if (!authData.isAuthenticated || !authData.user) {
      console.error('User must be authenticated to remove items from cart');
      return;
    }

    try {
      const usuarioId = parseInt(authData.user.id);
      const productoIdNum = parseInt(productId);
      
      // Elimina del microservicio
      await carritoService.deleteItemByProducto(usuarioId, productoIdNum);
      
      // Actualiza el estado local
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product.id !== productId)
      );
      
      // Elimina el itemId del mapa
      setCartItemIds(prev => {
        const newMap = new Map(prev);
        newMap.delete(productId);
        return newMap;
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  /**
   * Actualiza la cantidad de un producto en el carrito
   * @param productId - ID del producto
   * @param quantity - Nueva cantidad (si es 0 o menos, se elimina)
   */
  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (!authData.isAuthenticated || !authData.user) {
      console.error('User must be authenticated to update cart');
      return;
    }

    try {
      // Buscar el item en el carrito para obtener su ID
      const cartItem = cartItems.find(item => item.product.id === productId);
      if (cartItem) {
        const itemId = cartItemIds.get(productId);
        
        if (itemId) {
          // Actualiza en la BD usando el itemId del carrito
          await carritoService.updateQuantity(itemId, quantity);
        }
        
        // Actualiza el estado local
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  /**
   * Vacía el carrito completamente
   */
  const clearCart = async (): Promise<void> => {
    if (!authData.isAuthenticated || !authData.user) {
      console.error('User must be authenticated to clear cart');
      return;
    }

    try {
      const usuarioId = parseInt(authData.user.id);
      await carritoService.vaciarCarrito(usuarioId);
      setCartItems([]);
      setCartItemIds(new Map()); // Limpia también el mapa de IDs
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  /**
   * Calcula el total de artículos en el carrito
   * @returns Total de artículos
   */
  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Calcula el precio total del carrito
   * @returns Precio total
   */
  const getTotalPrice = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  // Valor del contexto
  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Hook personalizado para usar el contexto del carrito
 * @returns Contexto del carrito
 * 
 * Este hook utiliza useContext internamente para acceder al CartContext
 * Permite a cualquier componente acceder a los items del carrito y funciones
 * (addToCart, removeFromCart, updateQuantity, etc.) sin necesidad de pasar props manualmente
 */
export const useCart = (): CartContextType => {
  // useContext: Hook de React que permite acceder a un contexto
  // Lee el valor del CartContext más cercano en el árbol de componentes
  // Este hook es la forma de acceder al estado global del carrito de compras
  const context = useContext(CartContext);
  
  // Si el contexto no está definido (se usa fuera del Provider), lanza un error
  // Esto previene errores silenciosos y ayuda a identificar problemas de configuración
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  
  // Retorna el contexto con todos los datos y funciones del carrito
  return context;
};

