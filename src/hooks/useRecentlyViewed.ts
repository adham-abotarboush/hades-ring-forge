import { useState, useEffect, useCallback } from "react";
import { ShopifyProduct } from "@/lib/shopify";

const STORAGE_KEY = "hades_recently_viewed";
const MAX_ITEMS = 8;

interface RecentlyViewedItem {
    id: string;
    handle: string;
    title: string;
    price: string;
    currencyCode: string;
    imageUrl: string;
    imageAlt: string;
    viewedAt: number;
}

export function useRecentlyViewed() {
    const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const items = JSON.parse(stored) as RecentlyViewedItem[];
                // Sort by most recent and limit
                setRecentlyViewed(
                    items.sort((a, b) => b.viewedAt - a.viewedAt).slice(0, MAX_ITEMS)
                );
            }
        } catch (error) {
            console.error("Error loading recently viewed:", error);
        }
    }, []);

    const addProduct = useCallback((product: ShopifyProduct) => {
        const { node } = product;
        const newItem: RecentlyViewedItem = {
            id: node.id,
            handle: node.handle,
            title: node.title,
            price: node.priceRange.minVariantPrice.amount,
            currencyCode: node.priceRange.minVariantPrice.currencyCode,
            imageUrl: node.images.edges[0]?.node.url || "",
            imageAlt: node.images.edges[0]?.node.altText || node.title,
            viewedAt: Date.now(),
        };

        setRecentlyViewed((prev) => {
            // Remove if already exists
            const filtered = prev.filter((item) => item.id !== node.id);
            // Add to beginning and limit
            const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);

            // Persist to localStorage
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (error) {
                console.error("Error saving recently viewed:", error);
            }

            return updated;
        });
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        setRecentlyViewed([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error("Error clearing recently viewed:", error);
        }
    }, []);

    return {
        recentlyViewed,
        addProduct,
        clearRecentlyViewed,
    };
}
