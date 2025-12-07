import { useState } from "react";
import { ShoppingCart, Eye, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { WishlistButton } from "@/components/WishlistButton";
import { QuickViewModal } from "@/components/QuickViewModal";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const setCartOpen = useCartStore(state => state.setCartOpen);
  const { node } = product;

  const handleAddToCart = () => {
    const firstVariant = node.variants.edges[0]?.node;
    if (!firstVariant) return;

    const cartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: "Size 16",
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: [{ name: "Ring Size", value: "16" }]
    };

    const success = addItem(cartItem);

    if (success) {
      toast.success(
        <div
          onClick={() => setCartOpen(true)}
          className="cursor-pointer w-full"
        >
          Added Size 16 to cart! Click to view
        </div>,
        {
          position: "top-center",
        }
      );
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const image = node.images.edges[0]?.node;
  const secondImage = node.images.edges[1]?.node;
  const firstVariant = node.variants.edges[0]?.node;
  const price = firstVariant?.price || node.priceRange.minVariantPrice;
  const compareAtPrice = firstVariant?.compareAtPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  
  // Check if any variant is available for sale
  const hasAvailableVariant = node.variants.edges.some(v => v.node.availableForSale);
  const isSoldOut = !hasAvailableVariant;
  const totalInventory = node.totalInventory ?? 0;
  const isAlmostSoldOut = !isSoldOut && totalInventory > 0 && totalInventory <= 5;

  return (
    <>
      <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-500 hover-lift h-full flex flex-col">
        <Link to={`/product/${node.handle}`}>
          <div className="relative aspect-square overflow-hidden bg-gradient-forge">
            {image ? (
              <>
                <ProgressiveImage
                  src={image.url}
                  alt={image.altText || node.title}
                  className="group-hover:scale-110 transition-all duration-700 ease-out"
                  containerClassName="absolute inset-0"
                  rootMargin="200px"
                />
                {secondImage && (
                  <ProgressiveImage
                    src={secondImage.url}
                    alt={secondImage.altText || node.title}
                    className="group-hover:scale-110 transition-all duration-700 ease-out opacity-0 group-hover:opacity-100"
                    containerClassName="absolute inset-0"
                    rootMargin="200px"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">⚡</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Sold Out Badge Only */}
            {isSoldOut && (
              <Badge className="absolute top-4 left-4 px-3 py-1.5 bg-muted text-muted-foreground border-0 shadow-lg">
                Sold Out
              </Badge>
            )}

            {/* Quick View Button - hidden on mobile */}
            <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleQuickView}
                className="gap-2 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
              >
                <Eye className="h-4 w-4" />
                Quick View
              </Button>
            </div>

            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <WishlistButton product={product} />
            </div>
          </div>
        </Link>

        <CardContent className="p-6 flex-1 flex flex-col">
          <Link to={`/product/${node.handle}`}>
            <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
              {node.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
            {node.description}
          </p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                E£{parseFloat(price.amount).toFixed(0)}
              </span>
              {isOnSale && compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  E£{parseFloat(compareAtPrice.amount).toFixed(0)}
                </span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              size="sm"
              disabled={isSoldOut}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold group/btn disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isSoldOut ? "Sold Out" : `Add ${node.title} size 16 to cart`}
              title="Adds size 16 to cart"
            >
              <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
              {isSoldOut ? "Sold Out" : "Add (16)"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
