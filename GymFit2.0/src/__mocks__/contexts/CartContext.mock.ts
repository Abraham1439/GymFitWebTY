// Mock para CartContext
import { Producto } from '../../interfaces/gym.interfaces';

const mockCartItems = [
  {
    product: {
      id: '1',
      name: 'Proteína Whey',
      description: 'Proteína de suero de leche',
      price: 50000,
      stock: 15,
      category: 'supplement',
      image: 'https://example.com/whey.jpg'
    } as Producto,
    quantity: 2
  }
];

export const mockCartContext = {
  cartItems: mockCartItems,
  addToCart: async (product: Producto, quantity: number = 1): Promise<void> => {
    // Mock add to cart
  },
  removeFromCart: async (productId: string): Promise<void> => {
    // Mock remove from cart
  },
  updateQuantity: async (productId: string, quantity: number): Promise<void> => {
    // Mock update quantity
  },
  clearCart: async (): Promise<void> => {
    // Mock clear cart
  },
  getTotalItems: (): number => {
    return mockCartItems.reduce((total, item) => total + item.quantity, 0);
  },
  getTotalPrice: (): number => {
    return mockCartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
};

