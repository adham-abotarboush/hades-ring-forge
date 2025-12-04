import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';

interface WishlistStore {
    items: ShopifyProduct[];
    addItem: (product: ShopifyProduct) => void;
    removeItem: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const items = get().items;
                if (items.some((item) => item.node.id === product.node.id)) {
                    return;
                }
                set({ items: [...items, product] });
                toast.success("Added to wishlist");
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.node.id !== productId) });
                toast.success("Removed from wishlist");
            },
            isInWishlist: (productId) => {
                return get().items.some((item) => item.node.id === productId);
            },
            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
