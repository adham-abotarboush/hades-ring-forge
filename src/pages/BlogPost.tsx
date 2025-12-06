import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { fetchBlogPostBySlug, fetchRecentPosts, BlogPost } from "@/lib/blog";
import { BlogCard } from "@/components/BlogCard";
import { ArrowLeft, Calendar, Clock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

const BlogPostPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [postData, recentData] = await Promise.all([
                fetchBlogPostBySlug(slug || ""),
                fetchRecentPosts(4)
            ]);
            setPost(postData);
            setRelatedPosts(recentData.filter(p => p.slug !== slug).slice(0, 3));
            setLoading(false);
        };
        loadData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <main className="pt-40 pb-20">
                    <div className="container mx-auto px-4 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <main className="pt-40 pb-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-heading font-bold mb-4">Post Not Found</h1>
                        <p className="text-muted-foreground mb-8">
                            The blog post you're looking for doesn't exist.
                        </p>
                        <Button asChild>
                            <Link to="/blog">Back to Blog</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="pt-40 pb-20">
                <article className="container mx-auto px-4">
                    {/* Back Link */}
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    {/* Header */}
                    <header className="max-w-3xl mx-auto text-center mb-12">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider mb-4 ${post.category === "story" ? "bg-primary/10 text-primary" :
                                post.category === "guide" ? "bg-blue-500/10 text-blue-500" :
                                    "bg-green-500/10 text-green-500"
                            }`}>
                            {post.category}
                        </span>

                        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {post.author}
                            </span>
                            {post.published_at && (
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(post.published_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            )}
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {post.read_time}
                            </span>
                        </div>
                    </header>

                    {/* Cover Image */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
                            <img
                                src={post.cover_image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=80"}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl mx-auto prose prose-invert prose-lg prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="container mx-auto px-4 mt-20">
                        <h2 className="text-2xl font-heading font-bold mb-8">
                            More from the Forge
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <BlogCard key={relatedPost.id} post={relatedPost} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default BlogPostPage;
