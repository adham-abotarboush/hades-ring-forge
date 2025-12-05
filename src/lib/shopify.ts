import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'hades-ring-forge-fu4e8.myshopify.com';

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    totalInventory: number;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    metafields: Array<{
      namespace: string;
      key: string;
      value: string;
    }>;
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          quantityAvailable: number;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export interface ShopifyCollection {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
    products: {
      edges: ShopifyProduct[];
    };
  };
}

export async function storefrontApiRequest(queryName: string, variables: any = {}) {
  try {
    const { data, error } = await supabase.functions.invoke('shopify-products', {
      body: { queryName, variables },
    });

    if (error) throw error;

    if (data?.error) {
      if (data.error === 'Payment required') {
        toast.error("Shopify: Payment required", {
          description: data.message
        });
        return null;
      }
      throw new Error(data.error);
    }

    return data;
  } catch (error: any) {
    console.error('Error calling Shopify via edge function:', error);
    throw error;
  }
}

// Daily seed randomization - same order for everyone, changes at midnight
function getDailySeed(): number {
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  const random = seededRandom(getDailySeed());
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function fetchProducts(count: number = 50, randomize: boolean = false): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest('getProducts', { first: count });
  const products = data?.data?.products?.edges || [];
  return randomize ? shuffleArray(products) : products;
}

// Fetch products by IDs for inventory validation
export async function fetchProductsByIds(productIds: string[]): Promise<ShopifyProduct[]> {
  const products = await Promise.all(
    productIds.map(async (id) => {
      const data = await storefrontApiRequest('getProductById', { id });
      return data?.data?.product ? { node: data.data.product } : null;
    })
  );
  return products.filter((p): p is ShopifyProduct => p !== null);
}

// Fetch all collections
export async function fetchCollections(count: number = 20): Promise<ShopifyCollection[]> {
  const data = await storefrontApiRequest('getCollections', { first: count });
  return data?.data?.collections?.edges || [];
}

// Fetch a single collection by handle
export async function fetchCollectionByHandle(handle: string, productCount: number = 50): Promise<ShopifyCollection | null> {
  const data = await storefrontApiRequest('getCollectionByHandle', { handle, first: productCount });
  return data?.data?.collection ? { node: data.data.collection } : null;
}

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

// Create checkout function
export async function createStorefrontCheckout(items: CartItem[]): Promise<string> {
  try {
    // Get current user to associate with Shopify customer
    const { data: { user } } = await supabase.auth.getUser();
    let buyerIdentity = undefined;

    // If user is logged in, try to get their Shopify customer ID
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('shopify_customer_id')
        .eq('user_id', user.id)
        .single();

      if (profile?.shopify_customer_id) {
        buyerIdentity = {
          customerAccessToken: profile.shopify_customer_id,
        };
      }
    }

    // Format cart lines for Shopify
    const lines = items.map(item => ({
      quantity: item.quantity,
      merchandiseId: item.variantId,
    }));

    // Create cart with initial items and buyer identity
    const cartData = await storefrontApiRequest('cartCreate', {
      input: {
        lines,
        buyerIdentity,
      },
    });

    if (cartData.data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${cartData.data.cartCreate.userErrors.map(e => e.message).join(', ')}`);
    }

    const cart = cartData.data.cartCreate.cart;

    if (!cart.checkoutUrl) {
      throw new Error('No checkout URL returned from Shopify');
    }

    const url = new URL(cart.checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    const checkoutUrl = url.toString();
    return checkoutUrl;
  } catch (error: any) {
    console.error('Error creating storefront checkout:', error);
    throw error;
  }
}
