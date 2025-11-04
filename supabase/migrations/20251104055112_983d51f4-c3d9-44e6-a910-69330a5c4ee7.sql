-- Add INSERT policy for orders table
-- Users can only insert orders for themselves
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);