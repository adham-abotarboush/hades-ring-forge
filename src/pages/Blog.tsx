import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { fetchBlogPosts, BlogPost } from "@/lib/blog";
import { Loader2 } from "lucide-react";

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogPosts()
            .then(setPosts)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <main className="pt-32 pb-20">
                    <div className="container mx-auto px-4 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                            From the <span className="text-primary">Forge</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Stories of craftsmanship, guides for ring care, and tales from Greek mythology that inspire our work.
                        </p>
                    </div>

                    {posts.length === 0 ? (
                        <p className="text-center text-muted-foreground">No posts yet. Check back soon!</p>
                    ) : (
                        <>
                            {/* Featured Post */}
                            <div className="mb-12">
                                <BlogCard post={posts[0]} variant="featured" />
                            </div>

                            {/* Post Grid */}
                            {posts.length > 1 && (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {posts.slice(1).map((post) => (
                                        <BlogCard key={post.id} post={post} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
