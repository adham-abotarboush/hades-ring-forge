import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct, storefrontApiRequest } from '@/lib/shopify';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<void>;
  syncWithDatabase: (userId: string) => Promise<void>;
  loadFromDatabase: (userId: string) => Promise<void>;
  saveToDatabase: (userId: string) => Promise<void>;
}

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl } = get();
        if (items.length === 0) return;

        setLoading(true);
        try {
          const lines = items.map(item => ({
            quantity: item.quantity,
            merchandiseId: item.variantId,
          }));

          const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, {
            input: { lines },
          });

          if (cartData.data.cartCreate.userErrors.length > 0) {
            throw new Error(`Cart creation failed: ${cartData.data.cartCreate.userErrors.map((e: any) => e.message).join(', ')}`);
          }

          const cart = cartData.data.cartCreate.cart;
          
          if (!cart.checkoutUrl) {
            throw new Error('No checkout URL returned from Shopify');
          }

          const url = new URL(cart.checkoutUrl);
          url.searchParams.set('channel', 'online_store');
          const checkoutUrl = url.toString();
          setCheckoutUrl(checkoutUrl);
        } catch (error) {
          console.error('Failed to create checkout:', error);
          throw error;
        } finally {
          setLoading(false);
        }
      },

      syncWithDatabase: async (userId: string) => {
        try {
          const { items } = get();
          
          // Check if user has saved cart in database
          const { data: savedCartItems } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId);

          if (savedCartItems && savedCartItems.length > 0) {
            // User has saved cart - load it and discard guest cart
            const dbItems: CartItem[] = savedCartItems.map(dbItem => {
              const productData = dbItem.product_data as any;
              return {
                product: productData.product,
                variantId: dbItem.variant_id,
                variantTitle: productData.variantTitle,
                price: productData.price,
                quantity: dbItem.quantity,
                selectedOptions: productData.selectedOptions,
              };
            });
            
            set({ items: dbItems });
          } else if (items.length > 0) {
            // User has no saved cart but has guest cart - save guest cart to database
            await get().saveToDatabase(userId);
          }
        } catch (error) {
          console.error('Failed to sync cart with database:', error);
        }
      },

      loadFromDatabase: async (userId: string) => {
        try {
          const { data: savedCartItems } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId);

          if (savedCartItems && savedCartItems.length > 0) {
            const dbItems: CartItem[] = savedCartItems.map(dbItem => {
              const productData = dbItem.product_data as any;
              return {
                product: productData.product,
                variantId: dbItem.variant_id,
                variantTitle: productData.variantTitle,
                price: productData.price,
                quantity: dbItem.quantity,
                selectedOptions: productData.selectedOptions,
              };
            });
            
            set({ items: dbItems });
          }
        } catch (error) {
          console.error('Failed to load cart from database:', error);
        }
      },

      saveToDatabase: async (userId: string) => {
        try {
          const { items } = get();
          
          // Delete existing cart items
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

          // Insert current cart items
          if (items.length > 0) {
            const cartItemsToInsert = items.map(item => ({
              user_id: userId,
              variant_id: item.variantId,
              product_id: item.product.node.id,
              quantity: item.quantity,
              product_data: {
                product: item.product,
                variantTitle: item.variantTitle,
                price: item.price,
                selectedOptions: item.selectedOptions,
              } as any,
            }));

            await supabase
              .from('cart_items')
              .insert(cartItemsToInsert);
          }
        } catch (error) {
          console.error('Failed to save cart to database:', error);
        }
      },
    }),
    {
      name: 'hades-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
