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

// Static blog posts (blog_posts table not yet created)
const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "the-art-of-forging-darkness",
        title: "The Art of Forging Darkness",
        excerpt: "Discover the ancient techniques we use to craft each ring, from molten metal to mythological masterpiece.",
        content: "# The Art of Forging Darkness\n\nEvery ring at Hades Ring Forge begins its journey in fire. Our master craftsmen draw upon centuries-old techniques, combined with modern precision, to create pieces that transcend ordinary jewelry.\n\n## The Process\n\nEach ring starts as raw metal, heated to temperatures exceeding 1000°C. Through careful manipulation and expert hammering, the metal takes shape, guided by hands that have honed their craft over decades.\n\n## Mythological Inspiration\n\nOur designs draw from the rich tapestry of Greek mythology. The serpents of the underworld, the three-headed guardian Cerberus, and the dark majesty of Hades himself all find expression in our work.",
        cover_image: null,
        author: "The Forge Master",
        category: "story",
        read_time: "5 min read",
        published_at: "2024-11-15",
        created_at: "2024-11-15"
    },
    {
        id: "2",
        slug: "ring-care-guide",
        title: "Caring for Your Underworld Treasure",
        excerpt: "Learn the essential techniques to keep your Hades ring looking as magnificent as the day it was forged.",
        content: "# Caring for Your Underworld Treasure\n\nYour Hades ring is built to last, but proper care ensures it remains a stunning piece for generations.\n\n## Daily Care\n\n- Remove your ring before swimming or showering\n- Avoid contact with harsh chemicals\n- Store in a cool, dry place\n\n## Cleaning\n\nGently clean with a soft cloth and mild soap solution. For deeper cleaning, use a jewelry polishing cloth.",
        cover_image: null,
        author: "The Forge Master",
        category: "guide",
        read_time: "3 min read",
        published_at: "2024-11-10",
        created_at: "2024-11-10"
    }
];

export async function fetchBlogPosts(): Promise<BlogPost[]> {
    // Return static blog posts (database table not yet created)
    return blogPosts;
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    // Find from static blog posts
    return blogPosts.find(post => post.slug === slug) || null;
}

export async function fetchRecentPosts(count: number = 3): Promise<BlogPost[]> {
    return blogPosts.slice(0, count);
}
