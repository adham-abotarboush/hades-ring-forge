import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct, createStorefrontCheckout, CartItem as ShopifyCartItem, fetchProductsByIds } from '@/lib/shopify';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CartItem = ShopifyCartItem;

// Track pending operations for optimistic UI
type PendingOperation = {
  type: 'add' | 'update' | 'remove';
  variantId: string;
  timestamp: number;
};

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isCartOpen: boolean;
  pendingOperations: PendingOperation[];

  addItem: (item: CartItem) => boolean;
  updateQuantity: (variantId: string, quantity: number) => boolean;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  setCartOpen: (open: boolean) => void;
  createCheckout: () => Promise<void>;
  validateCartInventory: () => Promise<boolean>;
  validateAndAddItem: (item: CartItem) => Promise<{ success: boolean; message?: string; type?: 'error' | 'warning' }>;
  validateAndUpdateQuantity: (variantId: string, quantity: number) => Promise<{ success: boolean; message?: string; type?: 'error' | 'warning'; maxQuantity?: number }>;
  getItemInventory: (productId: string) => Promise<number | null>;
  syncWithDatabase: (userId: string) => Promise<void>;
  loadFromDatabase: (userId: string) => Promise<void>;
  saveToDatabase: (userId: string) => Promise<void>;
  // Optimistic UI helpers
  isItemPending: (variantId: string) => boolean;
  addPendingOperation: (op: Omit<PendingOperation, 'timestamp'>) => void;
  removePendingOperation: (variantId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isCartOpen: false,
      pendingOperations: [],

      setCartOpen: (open) => set({ isCartOpen: open }),

      // Optimistic UI helpers
      isItemPending: (variantId) => {
        return get().pendingOperations.some(op => op.variantId === variantId);
      },

      addPendingOperation: (op) => {
        set({
          pendingOperations: [...get().pendingOperations, { ...op, timestamp: Date.now() }]
        });
      },

      removePendingOperation: (variantId) => {
        set({
          pendingOperations: get().pendingOperations.filter(op => op.variantId !== variantId)
        });
      },

      // Get current inventory for a product
      getItemInventory: async (productId: string) => {
        try {
          const products = await fetchProductsByIds([productId]);
          if (products.length === 0) return null;
          return products[0].node.totalInventory ?? null;
        } catch (error) {
          console.error('Failed to fetch inventory:', error);
          return null;
        }
      },

      // Validate inventory before adding item
      validateAndAddItem: async (item: CartItem) => {
        const { items, addItem, getItemInventory } = get();
        
        try {
          const inventory = await getItemInventory(item.product.node.id);
          
          if (inventory === null) {
            // Can't verify - allow optimistically
            addItem(item);
            return { success: true };
          }
          
          if (inventory === 0) {
            return { 
              success: false, 
              message: "Sorry, this item is sold out", 
              type: 'error' as const 
            };
          }
          
          // Check total quantity including existing cart items
          const existingItem = items.find(i => i.product.node.id === item.product.node.id);
          const existingQuantity = existingItem?.quantity || 0;
          const requestedTotal = existingQuantity + item.quantity;
          
          if (requestedTotal > inventory) {
            if (existingQuantity >= inventory) {
              return { 
                success: false, 
                message: `Maximum reached! Only ${inventory} available`, 
                type: 'error' as const 
              };
            }
            
            const canAdd = inventory - existingQuantity;
            addItem({ ...item, quantity: canAdd });
            return { 
              success: true, 
              message: `Only ${canAdd} added (limited stock)`, 
              type: 'warning' as const 
            };
          }
          
          addItem(item);
          return { success: true };
        } catch (error) {
          console.error('Inventory validation failed:', error);
          // Allow on error - will be caught at checkout
          addItem(item);
          return { success: true };
        }
      },

      // Validate inventory before updating quantity
      validateAndUpdateQuantity: async (variantId: string, quantity: number) => {
        const { items, updateQuantity, removeItem, getItemInventory } = get();
        
        if (quantity <= 0) {
          removeItem(variantId);
          return { success: true };
        }
        
        const item = items.find(i => i.variantId === variantId);
        if (!item) return { success: false };
        
        try {
          const inventory = await getItemInventory(item.product.node.id);
          
          if (inventory === null) {
            // Can't verify - allow optimistically
            updateQuantity(variantId, quantity);
            return { success: true };
          }
          
          if (inventory === 0) {
            removeItem(variantId);
            return { 
              success: false, 
              message: "Sold out! Removed from cart", 
              type: 'error' as const 
            };
          }
          
          if (quantity > inventory) {
            updateQuantity(variantId, inventory);
            return { 
              success: true, 
              message: inventory === 1 
                ? "Only 1 left in stock!" 
                : `Only ${inventory} available`,
              type: 'warning' as const,
              maxQuantity: inventory
            };
          }
          
          updateQuantity(variantId, quantity);
          return { success: true };
        } catch (error) {
          console.error('Inventory validation failed:', error);
          updateQuantity(variantId, quantity);
          return { success: true };
        }
      },

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
        return true;
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return true;
        }

        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
        return true;
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

      validateCartInventory: async () => {
        const { items } = get();
        if (items.length === 0) return true;

        try {
          // Fetch fresh product data
          const productIds = [...new Set(items.map(item => item.product.node.id))];
          const freshProducts = await fetchProductsByIds(productIds);

          const unavailableItems: string[] = [];
          const updatedItems: CartItem[] = [];

          for (const item of items) {
            const freshProduct = freshProducts.find(p => p.node.id === item.product.node.id);
            if (!freshProduct) {
              unavailableItems.push(item.product.node.title);
              continue;
            }

            // Find the specific variant
            const variant = freshProduct.node.variants.edges.find(
              v => v.node.id === item.variantId
            );

            if (!variant || !variant.node.availableForSale) {
              unavailableItems.push(`${item.product.node.title} (${item.variantTitle})`);
              continue;
            }

            // Product is available, keep in cart
            updatedItems.push(item);
          }

          if (unavailableItems.length > 0) {
            toast.error("Items unavailable", {
              description: `The following items are no longer available: ${unavailableItems.join(', ')}`
            });
            set({ items: updatedItems });
            return false;
          }

          if (updatedItems.length !== items.length) {
            set({ items: updatedItems });
          }

          return true;
        } catch (error) {
          console.error('Failed to validate cart inventory:', error);
          toast.error("Validation failed", {
            description: "Unable to verify product availability"
          });
          return false;
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
