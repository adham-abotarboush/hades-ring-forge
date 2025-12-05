import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/BlogCard";
import { fetchRecentPosts, BlogPost } from "@/lib/blog";

export function BlogSection() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentPosts(3)
            .then(setPosts)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="py-20">
                <div className="container mx-auto px-4 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </section>
        );
    }

    if (posts.length === 0) return null;

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                            From the <span className="text-primary">Forge</span>
                        </h2>
                        <p className="text-muted-foreground">
                            Stories, guides, and news from the underworld
                        </p>
                    </div>
                    <Button variant="ghost" asChild className="hidden md:flex gap-2">
                        <Link to="/blog">
                            View All Posts
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" asChild className="gap-2">
                        <Link to="/blog">
                            View All Posts
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
