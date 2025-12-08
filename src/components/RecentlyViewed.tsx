import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentlyViewedProps {
    currentProductHandle?: string;
    maxItems?: number;
}

export const RecentlyViewed = ({ currentProductHandle, maxItems = 4 }: RecentlyViewedProps) => {
    const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

    // Filter out current product and limit items
    const displayItems = recentlyViewed
        .filter((item) => item.handle !== currentProductHandle)
        .slice(0, maxItems);

    if (displayItems.length === 0) {
        return null;
    }

    return (
        <section className="py-12">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-heading font-bold">Recently Viewed</h2>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentlyViewed}
                    className="text-muted-foreground hover:text-destructive"
                >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {displayItems.map((item, index) => (
                    <Link
                        key={item.id}
                        to={`/product/${item.handle}`}
                        className="group animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <Card className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover-lift h-full">
                            <div className="aspect-square overflow-hidden bg-muted">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.imageAlt}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">⚡</div>
                                )}
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-heading font-semibold text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-primary font-bold mt-1">
                                    <span className="text-xs font-medium opacity-70 mr-0.5">EGP</span>
                                    {parseFloat(item.price).toFixed(0)}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
};
