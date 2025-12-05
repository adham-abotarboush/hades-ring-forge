export interface Testimonial {
    id: string;
    name: string;
    location: string;
    rating: number;
    text: string;
    product_name: string | null;
}

// Static testimonials (testimonials table not yet created)
const testimonials: Testimonial[] = [
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
    },
    {
        id: "3",
        name: "Omar Farouk",
        location: "Alexandria, Egypt",
        rating: 5,
        text: "Excellent quality and fast delivery. The ring looks even better in person than in the photos!",
        product_name: "Cerberus Ring"
    },
    {
        id: "4",
        name: "Mona El-Sayed",
        location: "Giza, Egypt",
        rating: 5,
        text: "A perfect gift for my husband. He absolutely loves the unique design and the weight of the ring feels premium.",
        product_name: "Styx Ring"
    }
];

export async function fetchTestimonials(): Promise<Testimonial[]> {
    // Return static testimonials (database table not yet created)
    return testimonials;
}
