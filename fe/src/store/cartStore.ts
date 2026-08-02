import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi, CartItemResponse } from '../api/cart';
import { productsApi } from '../api/products';
import { useAuthStore } from './authStore';

export interface CartItem {
  cartItemId?: number; // Needed for backend delete/update
  productId: number;
  quantity: number;
  productName: string;
  price: number;
  greenPoints: number;
  carbonIndex: number;
  category: string;
  mainImage: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => void;
  syncGuestCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      syncGuestCart: async () => {
        const { isAuthenticated, user } = useAuthStore.getState();
        if (isAuthenticated && user) {
          const guestItems = get().items.filter(i => !i.cartItemId); // items without backend IDs
          if (guestItems.length === 0) return;
          
          set({ loading: true });
          try {
            for (const item of guestItems) {
              await cartApi.createOrUpdateCartItem({
                productId: item.productId,
                quantity: item.quantity,
                userId: user.id
              });
            }
          } catch (e) {
            console.error('Failed to sync guest cart', e);
          } finally {
            set({ loading: false });
          }
        }
      },

      fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          set({ loading: true });
          try {
            const data = await cartApi.getCartItems();
            const mappedItems: CartItem[] = data.map(be => ({
              cartItemId: be.id,
              productId: be.productId,
              quantity: be.quantity,
              productName: be.productName,
              price: be.price,
              greenPoints: be.greenPoints || 0,
              carbonIndex: (be as any).carbonIndex || 0,
              category: (be as any).category || 'N/A',
              mainImage: be.mainImage || "https://via.placeholder.com/150",
              stock: (be as any).stock || 0,
            }));
            set({ items: mappedItems });
          } catch (e) {
            console.error('Failed to fetch cart', e);
          } finally {
            set({ loading: false });
          }
        }
      },

      addToCart: async (item: CartItem) => {
        const { isAuthenticated, user } = useAuthStore.getState();
        const currentItems = get().items;
        
        const existing = currentItems.find(i => i.productId === item.productId);
        const newQty = existing ? existing.quantity + item.quantity : item.quantity;

        if (isAuthenticated && user) {
          try {
            await cartApi.createOrUpdateCartItem({
              productId: item.productId,
              quantity: newQty,
              userId: user.id
            }, existing?.cartItemId);
            // Re-fetch from BE to ensure sync
            await get().fetchCart();
          } catch (e) {
            console.error('Failed to add to cart', e);
            throw e;
          }
        } else {
          // Local update
          if (existing) {
            set({ items: currentItems.map(i => i.productId === item.productId ? { ...i, quantity: newQty } : i) });
          } else {
            set({ items: [...currentItems, item] });
          }
        }
      },

      updateQuantity: async (productId: number, quantity: number) => {
        const { isAuthenticated, user } = useAuthStore.getState();
        
        if (quantity <= 0) {
          await get().removeFromCart(productId);
          return;
        }

        if (isAuthenticated && user) {
          try {
            const existing = get().items.find(i => i.productId === productId);
            await cartApi.createOrUpdateCartItem({
              productId: productId,
              quantity: quantity,
              userId: user.id
            }, existing?.cartItemId);
            await get().fetchCart();
          } catch (e) {
            console.error('Failed to update cart', e);
          }
        } else {
          set({ items: get().items.map(i => i.productId === productId ? { ...i, quantity } : i) });
        }
      },

      removeFromCart: async (productId: number) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            const existing = get().items.find(i => i.productId === productId);
            if (existing && existing.cartItemId) {
              await cartApi.deleteCartItem(existing.cartItemId);
              await get().fetchCart();
            }
          } catch (e) {
            console.error('Failed to remove from cart', e);
          }
        } else {
          set({ items: get().items.filter(i => i.productId !== productId) });
        }
      },

      clearCart: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'cart-storage',
      // only persist items for guest cart. When logged in, it will be fetched from BE.
    }
  )
);
