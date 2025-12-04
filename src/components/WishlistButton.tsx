import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlistStore";
import { ShopifyProduct } from "@/lib/shopify";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
    product: ShopifyProduct;
    className?: string;
    variant?: "icon" | "full";
}

export function WishlistButton({ product, className, variant = "icon" }: WishlistButtonProps) {
    const { isInWishlist, addItem, removeItem } = useWishlistStore();
    const isSaved = isInWishlist(product.node.id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSaved) {
            removeItem(product.node.id);
        } else {
            addItem(product);
        }
    };

    if (variant === "full") {
        return (
            <Button
                variant="outline"
                size="lg"
                className={cn("gap-2", className)}
                onClick={toggleWishlist}
            >
                <Heart className={cn("h-5 w-5 transition-colors", isSaved && "fill-primary text-primary")} />
                {isSaved ? "Saved to Wishlist" : "Add to Wishlist"}
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-sm transition-all hover:scale-110",
                className
            )}
            onClick={toggleWishlist}
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart className={cn("h-5 w-5 transition-colors", isSaved && "fill-primary text-primary")} />
        </Button>
    );
}
