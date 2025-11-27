import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Whitelisted GraphQL queries
const ALLOWED_QUERIES = {
  'getProducts': `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            totalInventory
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
            metafields(identifiers: [{namespace: "shopify", key: "ring-size"}]) {
              namespace
              key
              value
            }
            variants(first: 25) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
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
  `,
  'cartCreate': `
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
  `
} as const;

// Validation schemas for query variables
const getProductsVariablesSchema = z.object({
  first: z.number().min(1).max(250)
});

const cartCreateVariablesSchema = z.object({
  input: z.object({
    lines: z.array(z.object({
      quantity: z.number().min(1).max(100),
      merchandiseId: z.string()
    })).min(1).max(50)
  })
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SHOPIFY_API_VERSION = '2025-07';
    const SHOPIFY_STORE_PERMANENT_DOMAIN = 'hades-ring-forge-fu4e8.myshopify.com';
    const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
    const SHOPIFY_STOREFRONT_TOKEN = Deno.env.get('SHOPIFY_STOREFRONT_ACCESS_TOKEN');

    if (!SHOPIFY_STOREFRONT_TOKEN) {
      throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured');
    }

    const { queryName, variables } = await req.json();

    if (!queryName) {
      throw new Error('Query name is required');
    }

    // Validate query name
    const query = ALLOWED_QUERIES[queryName as keyof typeof ALLOWED_QUERIES];
    if (!query) {
      throw new Error(`Invalid query name: ${queryName}. Allowed queries: ${Object.keys(ALLOWED_QUERIES).join(', ')}`);
    }

    // Validate variables based on query type
    let validatedVariables = variables;
    try {
      if (queryName === 'getProducts') {
        validatedVariables = getProductsVariablesSchema.parse(variables);
      } else if (queryName === 'cartCreate') {
        validatedVariables = cartCreateVariablesSchema.parse(variables);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid variables: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      throw error;
    }

    console.log('Fetching from Shopify...', { queryName, variables: validatedVariables });

    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({
        query,
        variables: validatedVariables,
      }),
    });

    if (response.status === 402) {
      return new Response(
        JSON.stringify({
          error: 'Payment required',
          message: 'Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.'
        }),
        {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`Shopify API error: ${data.errors.map((e: any) => e.message).join(', ')}`);
    }

    console.log('Successfully fetched from Shopify');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in shopify-products function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});