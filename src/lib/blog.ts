import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image: string | null;
    author: string;
    category: "story" | "guide" | "news";
    read_time: string;
    published_at: string | null;
    created_at: string;
}

// Fallback data in case Supabase is unavailable
const fallbackPosts: BlogPost[] = [
    {
        id: "1",
        slug: "the-art-of-forging-darkness",
        title: "The Art of Forging Darkness",
        excerpt: "Discover the ancient techniques we use to craft each ring, from molten metal to mythological masterpiece.",
        content: "# The Art of Forging Darkness\n\nEvery ring at Hades Ring Forge begins its journey in fire.",
        cover_image: null,
        author: "The Forge Master",
        category: "story",
        read_time: "5 min read",
        published_at: "2024-11-15",
        created_at: "2024-11-15"
    }
];

export async function fetchBlogPosts(): Promise<BlogPost[]> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching blog posts:', error);
            return fallbackPosts;
        }

        return data || fallbackPosts;
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return fallbackPosts;
    }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single();

        if (error) {
            console.error('Error fetching blog post:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch blog post:', error);
        return null;
    }
}

export async function fetchRecentPosts(count: number = 3): Promise<BlogPost[]> {
    const posts = await fetchBlogPosts();
    return posts.slice(0, count);
}
