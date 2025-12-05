-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    author TEXT NOT NULL DEFAULT 'Hades Team',
    category TEXT NOT NULL DEFAULT 'story' CHECK (category IN ('story', 'guide', 'news')),
    read_time TEXT NOT NULL DEFAULT '5 min read',
    published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    product_name TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access for published blog posts
CREATE POLICY "Public can read published blog posts" ON public.blog_posts
    FOR SELECT USING (published = true);

-- Public read access for testimonials
CREATE POLICY "Public can read testimonials" ON public.testimonials
    FOR SELECT USING (true);

-- Seed blog posts with existing data
INSERT INTO public.blog_posts (slug, title, excerpt, content, author, category, read_time, published, published_at) VALUES
(
    'the-art-of-forging-darkness',
    'The Art of Forging Darkness',
    'Discover the ancient techniques we use to craft each ring, from molten metal to mythological masterpiece.',
    '# The Art of Forging Darkness

Every ring at Hades Ring Forge begins its journey in fire. Like the ancient Greek smiths who crafted weapons for the gods, we use time-honored techniques combined with modern precision.

## The Process

Our artisans start with raw materials carefully selected for their quality and durability. Each piece is:

1. **Designed** - Every ring starts with a detailed sketch inspired by Greek mythology
2. **Cast** - The metal is heated to precise temperatures and poured into custom molds
3. **Refined** - Each ring is hand-finished to ensure perfect details
4. **Treated** - Special coating processes ensure lasting durability

## The Inspiration

The underworld of Greek mythology offers endless inspiration. From the three-headed Cerberus to the flames of Tartarus, each design tells a story.

## Quality Commitment

Every ring undergoes rigorous quality checks before it reaches your hands. We stand behind our craftsmanship with our satisfaction guarantee.',
    'The Forge Master',
    'story',
    '5 min read',
    true,
    '2024-11-15'
),
(
    'how-to-find-your-ring-size',
    'How to Find Your Perfect Ring Size',
    'A complete guide to measuring your finger and finding the ring size that fits you perfectly.',
    '# How to Find Your Perfect Ring Size

Finding the right ring size is crucial for comfort and security. Here''s our comprehensive guide.

## Method 1: Use an Existing Ring

If you have a ring that fits well:
- Place it on a ruler
- Measure the inside diameter in millimeters
- Use our size chart to find your size

## Method 2: Paper Strip Method

1. Cut a thin strip of paper
2. Wrap it around your finger
3. Mark where it overlaps
4. Measure the length in millimeters

## Method 3: Professional Measurement

Visit any local jeweler for a professional measurement. This is the most accurate method.

## Tips for Best Results

- Measure at the end of the day when fingers are slightly larger
- Measure multiple times for accuracy
- Consider the ring width - wider rings need a slightly larger size',
    'Hades Team',
    'guide',
    '3 min read',
    true,
    '2024-11-10'
),
(
    'myths-behind-the-rings',
    'The Myths Behind Our Rings',
    'Explore the Greek mythology that inspires each of our unique ring collections.',
    '# The Myths Behind Our Rings

Greek mythology is rich with stories of gods, heroes, and monsters. Each of our rings draws from these ancient tales.

## Hades Collection

Named after the god of the underworld, these rings feature dark metals and subtle flame motifs.

## Cerberus Collection

Inspired by the three-headed guardian of the underworld. Bold, protective, and unmistakably powerful.

## Phoenix Collection

The mythical bird rises from flames, symbolizing rebirth and transformation.

## Styx Collection

Named for the river that separates the living from the dead. Fluid designs with a mysterious edge.

Each ring is more than jewelry—it''s a connection to ancient stories that have captivated humanity for millennia.',
    'The Forge Master',
    'story',
    '4 min read',
    true,
    '2024-11-05'
),
(
    'caring-for-your-rings',
    'Ring Care: Keep Your Forge Pieces Perfect',
    'Essential tips for maintaining and caring for your Hades rings to keep them looking their best.',
    '# Ring Care Guide

Your Hades ring is built to last, but proper care will keep it looking its best for years to come.

## Daily Care

- Remove rings before washing hands with harsh soaps
- Avoid contact with chemicals, lotions, and perfumes
- Store separately to prevent scratching

## Cleaning

1. Mix mild soap with warm water
2. Soak the ring for 15-20 minutes
3. Gently brush with a soft toothbrush
4. Rinse thoroughly and pat dry

## Storage

- Use the provided ring box or a soft pouch
- Keep away from humidity
- Store each ring separately

## When to Remove

- Swimming (chlorine can damage finishes)
- Heavy exercise
- Manual labor
- Applying cosmetics',
    'Hades Team',
    'guide',
    '3 min read',
    true,
    '2024-10-28'
);

-- Seed testimonials with existing data
INSERT INTO public.testimonials (name, location, rating, text, product_name, featured) VALUES
('Ahmed Hassan', 'Cairo, Egypt', 5, 'The craftsmanship is absolutely stunning. I ordered the Obsidian Serpent ring and it exceeded all my expectations. The detail work is incredible!', 'Obsidian Serpent Ring', true),
('Sarah Mitchell', 'Dubai, UAE', 5, 'I''ve never seen rings with such unique designs. The Greek mythology inspiration really shows in every piece. Worth every pound!', 'Hades Crown Ring', true),
('Omar Khalil', 'Alexandria, Egypt', 5, 'Fast delivery and amazing quality. The ring looks even better in person than in the photos. My friends keep asking where I got it!', 'Cerberus Guardian Ring', true),
('Layla Mansour', 'Giza, Egypt', 5, 'Bought this as a gift for my husband and he absolutely loves it. The attention to detail is remarkable. Will definitely order again!', 'Phoenix Flame Ring', true),
('Karim Farouk', 'Mansoura, Egypt', 5, 'The underworld aesthetic is perfectly captured. Heavy, solid, and beautifully dark. Exactly what I was looking for.', 'Styx River Band', true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
