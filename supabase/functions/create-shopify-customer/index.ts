import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email, fullName, phoneNumber } = await req.json();

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId and email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const shopifyAccessToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
    const shopifyStoreDomain = 'hades-ring-forge-fu4e8.myshopify.com';
    const apiVersion = '2025-07';

    if (!shopifyAccessToken) {
      console.error('SHOPIFY_ACCESS_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Shopify integration not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Shopify customer using Admin API
    const createCustomerMutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
            phone
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const [firstName, ...lastNameParts] = (fullName || '').split(' ');
    const lastName = lastNameParts.join(' ');

    const shopifyResponse = await fetch(
      `https://${shopifyStoreDomain}/admin/api/${apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAccessToken,
        },
        body: JSON.stringify({
          query: createCustomerMutation,
          variables: {
            input: {
              email,
              firstName: firstName || email.split('@')[0],
              lastName: lastName || '',
              phone: phoneNumber || null,
            },
          },
        }),
      }
    );

    if (!shopifyResponse.ok) {
      console.error('Shopify API error:', shopifyResponse.status, await shopifyResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to create Shopify customer' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await shopifyResponse.json();

    if (data.data?.customerCreate?.userErrors?.length > 0) {
      console.error('Shopify customer creation errors:', data.data.customerCreate.userErrors);
      return new Response(
        JSON.stringify({ 
          error: 'Shopify customer creation failed',
          details: data.data.customerCreate.userErrors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const shopifyCustomerId = data.data?.customerCreate?.customer?.id;

    if (!shopifyCustomerId) {
      console.error('No customer ID returned from Shopify');
      return new Response(
        JSON.stringify({ error: 'Failed to get Shopify customer ID' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update Supabase profile with Shopify customer ID
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ shopify_customer_id: shopifyCustomerId })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Failed to update profile with Shopify customer ID:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update profile', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully created Shopify customer ${shopifyCustomerId} for user ${userId}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        shopifyCustomerId,
        customer: data.data.customerCreate.customer
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-shopify-customer function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
