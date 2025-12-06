import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCollections, ShopifyProduct, ShopifyCollection } from "@/lib/shopify";

interface ProductsContextType {
  products: ShopifyProduct[];
  collections: ShopifyCollection[];
  isLoading: boolean;
  error: Error | null;
  getProductByHandle: (handle: string) => ShopifyProduct | undefined;
  getRelatedProducts: (excludeId: string, count?: number) => ShopifyProduct[];
  getFeaturedProducts: (count?: number) => ShopifyProduct[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Preload images in background
function preloadImages(products: ShopifyProduct[], count: number = 12) {
  products.slice(0, count).forEach((product) => {
    const imageUrl = product.node.images?.edges?.[0]?.node?.url;
    if (imageUrl) {
      const img = new Image();
      // Request optimized size for thumbnails
      img.src = imageUrl + "&width=400&quality=80";
    }
  });
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Fetch all products in background - don't block initial render
  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => fetchProducts(50, true), // Randomized daily
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Fetch collections with lower priority (after products)
  const {
    data: collections = [],
    isLoading: collectionsLoading,
  } = useQuery({
    queryKey: ["all-collections"],
    queryFn: () => fetchCollections(20),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: products.length > 0, // Only fetch after products are loaded
  });

  // Preload images after products are loaded
  useEffect(() => {
    if (products.length > 0 && !imagesPreloaded) {
      preloadImages(products, 12);
      setImagesPreloaded(true);
    }
  }, [products, imagesPreloaded]);

  // Helper to find product by handle
  const getProductByHandle = (handle: string) => {
    return products.find((p) => p.node.handle === handle);
  };

  // Helper to get related products (excluding current)
  const getRelatedProducts = (excludeId: string, count: number = 4) => {
    return products
      .filter((p) => p.node.id !== excludeId)
      .slice(0, count);
  };

  // Helper to get featured products
  const getFeaturedProducts = (count: number = 6) => {
    return products.slice(0, count);
  };

  // Only show loading for products, not collections
  const isLoading = productsLoading;

  return (
    <ProductsContext.Provider
      value={{
        products,
        collections,
        isLoading,
        error: productsError as Error | null,
        getProductByHandle,
        getRelatedProducts,
        getFeaturedProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
