import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { query, variables } = await req.json();

    if (!query) {
      throw new Error('GraphQL query is required');
    }

    console.log('Fetching products from Shopify...', { variables });

    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({
        query,
        variables,
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

    console.log('Successfully fetched products from Shopify');

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