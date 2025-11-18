import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct, createStorefrontCheckout, CartItem as ShopifyCartItem } from '@/lib/shopify';
import { supabase } from '@/integrations/supabase/client';

export type CartItem = ShopifyCartItem;

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isCartOpen: boolean;
  
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  setCartOpen: (open: boolean) => void;
  createCheckout: () => Promise<void>;
  syncWithDatabase: (userId: string) => Promise<void>;
  loadFromDatabase: (userId: string) => Promise<void>;
  saveToDatabase: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isCartOpen: false,
      
      setCartOpen: (open) => set({ isCartOpen: open }),

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
          const checkoutUrl = await createStorefrontCheckout(items);
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
          
          if (items.length === 0) {
            // If cart is empty, delete all items
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', userId);
            return;
          }

          // Fetch existing cart items from database
          const { data: existingItems, error: fetchError } = await supabase
            .from('cart_items')
            .select('variant_id')
            .eq('user_id', userId);

          if (fetchError) throw fetchError;

          const existingVariantIds = new Set(existingItems?.map(item => item.variant_id) || []);
          const currentVariantIds = new Set(items.map(item => item.variantId));

          // Delete items that are no longer in cart
          const itemsToDelete = Array.from(existingVariantIds).filter(id => !currentVariantIds.has(id));
          if (itemsToDelete.length > 0) {
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', userId)
              .in('variant_id', itemsToDelete);
          }

          // Upsert current cart items (insert new or update existing)
          const cartItemsToUpsert = items.map(item => ({
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

          const { error: upsertError } = await supabase
            .from('cart_items')
            .upsert(cartItemsToUpsert, {
              onConflict: 'user_id,variant_id',
              ignoreDuplicates: false
            });

          if (upsertError) throw upsertError;
          
        } catch (error) {
          console.error('Failed to save cart to database:', error);
          // Error recovery: cart data remains in localStorage and will retry on next change
        }
      },
    }),
    {
      name: 'hades-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
