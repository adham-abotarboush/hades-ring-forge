-- Add shopify_customer_id to profiles table
ALTER TABLE public.profiles 
ADD COLUMN shopify_customer_id text;

-- Add index for faster lookups
CREATE INDEX idx_profiles_shopify_customer_id ON public.profiles(shopify_customer_id);