import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Wishlist = () => {
    const { items } = useWishlistStore();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navigation />

            <main className="flex-grow container mx-auto px-4 pt-40 pb-20">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-heading font-bold">Your Wishlist</h1>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-muted/30 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            Save your favorite pieces here to keep track of them. They'll be waiting for you when you're ready.
                        </p>
                        <Link to="/shop">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold">
                                Explore Collection
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((product) => (
                            <ProductCard key={product.node.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Wishlist;
