import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCartStore } from '@/stores/cartStore';

export const useCartSync = () => {
  const { syncWithDatabase, saveToDatabase, addItem, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    // Initial sync on mount
    const initializeCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await syncWithDatabase(user.id);
      }
    };

    initializeCart();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in - sync cart
        await syncWithDatabase(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        // User signed out - keep guest cart in localStorage
        // No action needed as Zustand persist handles this
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncWithDatabase]);

  // Save cart to database whenever items change (for authenticated users)
  useEffect(() => {
    const saveCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await saveToDatabase(user.id);
      }
    };

    // Debounce save operations - increased to 1500ms for better stability
    const timeoutId = setTimeout(saveCart, 1500);
    return () => clearTimeout(timeoutId);
  }, [useCartStore.getState().items, saveToDatabase]);
};
