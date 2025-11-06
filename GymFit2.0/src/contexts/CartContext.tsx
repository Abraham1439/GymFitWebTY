// Contexto de React para manejar el carrito de compras globalmente
// Context: API de React que permite compartir datos sin pasar props manualmente
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Importación de interfaces y tipos
import type { CartItem, Product } from '../interfaces/gym.interfaces';

// Importación de helpers para localStorage
import { saveToLocalStorage, getFromLocalStorage } from '../helpers';

// Constante para la clave de localStorage
const STORAGE_KEY_CART = 'gymCart';

// Interfaz que define la forma del contexto del carrito
interface CartContextType {
  cartItems: CartItem[];                    // Array de artículos en el carrito
  addToCart: (product: Product, quantity?: number) => void; // Función para agregar producto al carrito
  removeFromCart: (productId: string) => void; // Función para eliminar producto del carrito
  updateQuantity: (productId: string, quantity: number) => void; // Función para actualizar cantidad
  clearCart: () => void;                     // Función para vaciar el carrito
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // useEffect: Hook de React que ejecuta efectos secundarios
  // Carga el carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = getFromLocalStorage<CartItem[]>(STORAGE_KEY_CART);
    if (savedCart) {
      setCartItems(savedCart);
    }
  }, []);

  // useEffect: Guarda el carrito en localStorage cuando cambia
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY_CART, cartItems);
  }, [cartItems]);

  /**
   * Agrega un producto al carrito
   * @param product - Producto a agregar
   * @param quantity - Cantidad a agregar (por defecto 1)
   */
  const addToCart = (product: Product, quantity: number = 1): void => {
    setCartItems((prevItems) => {
      // Busca si el producto ya está en el carrito
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Si ya existe, actualiza la cantidad
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agrega el nuevo artículo
        return [...prevItems, { product, quantity }];
      }
    });
  };

  /**
   * Elimina un producto del carrito
   * @param productId - ID del producto a eliminar
   */
  const removeFromCart = (productId: string): void => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  /**
   * Actualiza la cantidad de un producto en el carrito
   * @param productId - ID del producto
   * @param quantity - Nueva cantidad (si es 0 o menos, se elimina)
   */
  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Vacía el carrito completamente
   */
  const clearCart = (): void => {
    setCartItems([]);
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
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

