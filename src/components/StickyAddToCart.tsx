import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { useEffect, useState } from "react";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";

interface StickyAddToCartProps {
    product: ShopifyProduct;
    onAddToCart: () => void;
    isCheckingOut: boolean;
    isVisible: boolean;
}

export const StickyAddToCart = ({ product, onAddToCart, isCheckingOut, isVisible }: StickyAddToCartProps) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!shouldRender) return null;

    const { node } = product;
    const image = node.images.edges[0]?.node;
    const price = node.priceRange.minVariantPrice;
    // Check if any variant is available for sale
    const isSoldOut = !node.variants.edges.some(v => v.node.availableForSale);

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-t border-border p-4 md:hidden transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "translate-y-full"
                }`}
        >
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {image && (
                        <ProgressiveImage
                            src={image.url}
                            alt={image.altText || node.title}
                            containerClassName="w-full h-full"
                            lazy={false}
                        />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-semibold truncate text-sm">{node.title}</h4>
                    <p className="text-primary font-bold text-sm">
                        EGP {parseFloat(price.amount).toFixed(2)}
                    </p>
                </div>

                <Button
                    onClick={onAddToCart}
                    size="sm"
                    disabled={isSoldOut || isCheckingOut}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold whitespace-nowrap"
                >
                    {isCheckingOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {isSoldOut ? "Sold Out" : "Add"}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
