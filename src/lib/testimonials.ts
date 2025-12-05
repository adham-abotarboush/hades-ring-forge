import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
    id: string;
    name: string;
    location: string;
    rating: number;
    text: string;
    product_name: string | null;
}

// Fallback testimonials in case Supabase is unavailable
const fallbackTestimonials: Testimonial[] = [
    {
        id: "1",
        name: "Ahmed Hassan",
        location: "Cairo, Egypt",
        rating: 5,
        text: "The craftsmanship is absolutely stunning. I ordered the Obsidian Serpent ring and it exceeded all my expectations.",
        product_name: "Obsidian Serpent Ring"
    },
    {
        id: "2",
        name: "Sarah Mitchell",
        location: "Dubai, UAE",
        rating: 5,
        text: "I've never seen rings with such unique designs. The Greek mythology inspiration really shows in every piece.",
        product_name: "Hades Crown Ring"
    }
];

export async function fetchTestimonials(): Promise<Testimonial[]> {
    try {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('featured', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching testimonials:', error);
            return fallbackTestimonials;
        }

        return data || fallbackTestimonials;
    } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        return fallbackTestimonials;
    }
}
