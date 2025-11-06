-- Add unique constraint to cart_items for user_id and variant_id combination
-- This enables UPSERT operations to work correctly

ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_user_variant_unique 
UNIQUE (user_id, variant_id);