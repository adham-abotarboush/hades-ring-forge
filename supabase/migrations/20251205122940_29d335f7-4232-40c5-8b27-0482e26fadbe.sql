-- Create a public view for reviews that hides user_id but shows reviewer name
-- and includes a computed field for whether the review belongs to the current user
CREATE OR REPLACE VIEW public.public_reviews AS
SELECT 
  r.id,
  r.product_handle,
  r.rating,
  r.review_text,
  r.created_at,
  r.updated_at,
  COALESCE(p.full_name, 'Anonymous') as reviewer_name,
  (auth.uid() = r.user_id) as is_own_review
FROM public.reviews r
LEFT JOIN public.profiles p ON p.user_id = r.user_id;

-- Grant access to the view
GRANT SELECT ON public.public_reviews TO anon, authenticated;