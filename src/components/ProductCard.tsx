import { useState } from "react";
import { ShoppingCart, Eye, Flame, Loader2 } from "lucide-react";
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
  tier?: "premium-tier" | "pro-tier" | "basic-tier";
}

const TIER_STYLES: Record<
  NonNullable<ProductCardProps["tier"]>,
  {
    color: string;
    label: string;
    icon: string;
    glow: string;
    ribbon: string;
  }
> = {
  "premium-tier": {
    color: "hsl(45 90% 60%)",
    label: "Premium",
    icon: "👑",
    glow: "0 0 40px -10px hsl(45 90% 55% / 0.55)",
    ribbon: "linear-gradient(135deg, hsl(45 90% 55%), hsl(35 85% 45%))",
  },
  "pro-tier": {
    color: "hsl(170 60% 55%)",
    label: "Pro",
    icon: "⚜️",
    glow: "0 0 30px -10px hsl(170 60% 50% / 0.45)",
    ribbon: "linear-gradient(135deg, hsl(170 60% 50%), hsl(190 60% 40%))",
  },
  "basic-tier": {
    color: "hsl(210 25% 75%)",
    label: "Basic",
    icon: "🔱",
    glow: "0 0 24px -10px hsl(210 25% 70% / 0.35)",
    ribbon: "linear-gradient(135deg, hsl(210 25% 70%), hsl(210 20% 55%))",
  },
};

export const ProductCard = ({ product, tier }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const setCartOpen = useCartStore(state => state.setCartOpen);
  const validateAndAddItem = useCartStore(state => state.validateAndAddItem);
  const { node } = product;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding) return;
    
    const firstVariant = node.variants.edges[0]?.node;
    if (!firstVariant) return;

    const cartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: "Size 17",
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: [{ name: "Ring Size", value: "17" }]
    };

    setIsAdding(true);
    try {
      const result = await validateAndAddItem(cartItem);

      if (result.success) {
        if (result.message && result.type === 'warning') {
          toast.warning(result.message, {
            position: "top-center",
          });
        } else {
          toast.success(
            <div
              onClick={() => setCartOpen(true)}
              className="cursor-pointer w-full"
            >
              Added Size 17 to cart! Click to view
            </div>,
            {
              position: "top-center",
            }
          );
        }
      } else if (result.message) {
        toast.error(result.message, {
          position: "top-center",
        });
      }
    } finally {
      setIsAdding(false);
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

  const tierStyle = tier ? TIER_STYLES[tier] : null;

  return (
    <>
      <Card
        className={`group overflow-hidden bg-card transition-all duration-500 hover-lift h-full flex flex-col relative ${
          tierStyle ? "" : "border-border hover:border-primary/50"
        }`}
        style={
          tierStyle
            ? {
                borderColor: `${tierStyle.color}55`,
                boxShadow: tierStyle.glow,
              }
            : undefined
        }
      >
        {tierStyle && (
          <>
            {/* Tier ribbon — diagonal corner flag */}
            <div className="absolute top-0 right-0 z-20 pointer-events-none overflow-hidden w-24 h-24">
              <div
                className="absolute top-[18px] right-[-32px] w-[120px] py-1 text-center rotate-45 shadow-md text-[10px] font-bold tracking-[0.25em] uppercase text-background"
                style={{ background: tierStyle.ribbon }}
              >
                {tierStyle.label}
              </div>
            </div>

            {/* Tier accent strip along the top */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] z-10 pointer-events-none"
              style={{ background: tierStyle.ribbon }}
            />
          </>
        )}

        <Link to={`/product/${node.handle}`}>
          <div className="relative aspect-square overflow-hidden bg-gradient-forge">
            {image ? (
              <>
                <ProgressiveImage
                  src={image.url}
                  alt={image.altText || node.title}
                  className="md:group-hover:scale-110 transition-all duration-700 ease-out"
                  containerClassName="absolute inset-0"
                  rootMargin="200px"
                />
                {secondImage && (
                  <ProgressiveImage
                    src={secondImage.url}
                    alt={secondImage.altText || node.title}
                    className="md:group-hover:scale-110 transition-all duration-700 ease-out opacity-0 md:group-hover:opacity-100"
                    containerClassName="absolute inset-0"
                    rootMargin="200px"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">⚡</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

            {/* Sold Out Badge Only */}
            {isSoldOut && (
              <Badge className="absolute top-4 left-4 px-3 py-1.5 bg-muted text-muted-foreground border-0 shadow-lg">
                Sold Out
              </Badge>
            )}

            {/* Quick View Button - hidden on mobile */}
            <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleQuickView}
                className="gap-2 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg pointer-events-auto"
              >
                <Eye className="h-4 w-4" />
                Quick View
              </Button>
            </div>

            {/* Wishlist button - always visible on mobile, hover on desktop */}
            <div className="absolute top-4 right-4 z-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <WishlistButton product={product} />
            </div>
          </div>
        </Link>

        <CardContent className="p-6 flex-1 flex flex-col">
          {tierStyle && (
            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: tierStyle.color }}>
              <span>{tierStyle.icon}</span>
              <span>{tierStyle.label} Tier</span>
            </div>
          )}
          <Link to={`/product/${node.handle}`}>
            <h3
              className={`text-xl font-heading font-semibold mb-3 transition-colors duration-300 leading-tight ${
                tierStyle ? "" : "group-hover:text-primary"
              }`}
              onMouseEnter={(e) => {
                if (tierStyle) e.currentTarget.style.color = tierStyle.color;
              }}
              onMouseLeave={(e) => {
                if (tierStyle) e.currentTarget.style.color = "";
              }}
            >
              {node.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
            {node.description}
          </p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-bold"
                style={tierStyle ? { color: tierStyle.color } : { color: "hsl(var(--primary))" }}
              >
                <span className="text-sm font-medium opacity-70 mr-0.5">EGP</span>
                {parseFloat(price.amount).toFixed(0)}
              </span>
              {isOnSale && compareAtPrice && (
                <span className="text-base text-muted-foreground line-through">
                  <span className="text-xs mr-0.5">EGP</span>
                  {parseFloat(compareAtPrice.amount).toFixed(0)}
                </span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              size="sm"
              disabled={isSoldOut || isAdding}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold group/btn disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isSoldOut ? "Sold Out" : `Add ${node.title} size 17 to cart`}
              title="Adds size 17 to cart"
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
              )}
              {isSoldOut ? "Sold Out" : isAdding ? "Adding..." : "Size 17"}
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
