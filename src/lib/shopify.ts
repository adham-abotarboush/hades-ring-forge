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

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export async function storefrontApiRequest(query: string, variables: any = {}) {
  try {
    const { data, error } = await supabase.functions.invoke('shopify-products', {
      body: { query, variables },
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

export async function fetchProducts(count: number = 20): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: count });
  return data?.data?.products?.edges || [];
}
