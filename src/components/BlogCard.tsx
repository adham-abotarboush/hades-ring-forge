import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface BlogCardProps {
    post: BlogPost;
    variant?: "default" | "featured";
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
    const isFeatured = variant === "featured";

    return (
        <Link
            to={`/blog/${post.slug}`}
            className={cn(
                "group block rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300",
                isFeatured && "md:grid md:grid-cols-2"
            )}
        >
            {/* Image */}
            <div className={cn(
                "aspect-video overflow-hidden bg-muted relative",
                isFeatured && "md:aspect-auto md:h-full"
            )}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <img
                    src={post.cover_image || `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category Badge */}
                <span className={cn(
                    "absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                    post.category === "story" && "bg-primary/90 text-primary-foreground",
                    post.category === "guide" && "bg-blue-500/90 text-white",
                    post.category === "news" && "bg-green-500/90 text-white"
                )}>
                    {post.category}
                </span>
            </div>

            {/* Content */}
            <div className={cn(
                "p-5",
                isFeatured && "md:p-8 md:flex md:flex-col md:justify-center"
            )}>
                <h3 className={cn(
                    "font-heading font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2",
                    isFeatured ? "text-2xl md:text-3xl" : "text-lg"
                )}>
                    {post.title}
                </h3>

                <p className={cn(
                    "text-muted-foreground mb-4 line-clamp-2",
                    isFeatured && "md:text-lg md:line-clamp-3"
                )}>
                    {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {post.published_at && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.published_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.read_time}
                        </span>
                    </div>

                    <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
