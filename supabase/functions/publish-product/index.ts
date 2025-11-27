import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SHOPIFY_API_VERSION = '2025-01';
    const SHOPIFY_STORE_PERMANENT_DOMAIN = 'hades-ring-forge-fu4e8.myshopify.com';
    const SHOPIFY_ADMIN_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
    const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN');

    if (!SHOPIFY_ACCESS_TOKEN) {
      throw new Error('SHOPIFY_ACCESS_TOKEN is not configured');
    }

    const { productId } = await req.json();

    if (!productId) {
      throw new Error('Product ID is required');
    }

    console.log('Publishing product to Online Store:', productId);

    // First, get the publications (sales channels)
    const publicationsQuery = `
      {
        publications(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `;

    const publicationsResponse = await fetch(SHOPIFY_ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: publicationsQuery }),
    });

    if (!publicationsResponse.ok) {
      throw new Error(`HTTP error! status: ${publicationsResponse.status}`);
    }

    const publicationsData = await publicationsResponse.json();
    
    if (publicationsData.errors) {
      throw new Error(`Shopify API error: ${publicationsData.errors.map((e: any) => e.message).join(', ')}`);
    }

    console.log('Publications:', JSON.stringify(publicationsData.data.publications));

    // Find the Online Store publication
    const onlineStorePublication = publicationsData.data.publications.edges.find(
      (edge: any) => edge.node.name === 'Online Store'
    );

    if (!onlineStorePublication) {
      throw new Error('Online Store publication not found');
    }

    const publicationId = onlineStorePublication.node.id;
    console.log('Online Store publication ID:', publicationId);

    // Now publish the product to the Online Store
    const publishMutation = `
      mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          publishable {
            ... on Product {
              id
              title
            }
          }
          shop {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const publishResponse = await fetch(SHOPIFY_ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: publishMutation,
        variables: {
          id: productId,
          input: [{ publicationId }],
        },
      }),
    });

    if (!publishResponse.ok) {
      throw new Error(`HTTP error! status: ${publishResponse.status}`);
    }

    const publishData = await publishResponse.json();
    
    if (publishData.errors) {
      throw new Error(`Shopify API error: ${publishData.errors.map((e: any) => e.message).join(', ')}`);
    }

    if (publishData.data.publishablePublish.userErrors.length > 0) {
      throw new Error(
        `Publish failed: ${publishData.data.publishablePublish.userErrors.map((e: any) => e.message).join(', ')}`
      );
    }

    console.log('Successfully published product');

    return new Response(JSON.stringify({ 
      success: true,
      data: publishData.data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error publishing product:', error);
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
