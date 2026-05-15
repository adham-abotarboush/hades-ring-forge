import { useState } from "react";
import { ShoppingCart, Eye, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { TierHandle } from "@/hooks/useProductTierMap";

export interface ProductCardProps {
  product: ShopifyProduct;
  /** Internal Shopify tier — never shown; non-premium tiers share one card treatment */
  tier?: TierHandle;
  realm?: "hades" | "persephone";
  /** When true, the buy button shows only the cart icon (no text label). */
  compact?: boolean;
}

type Presentation = "premium" | "standard" | "base";

const REALM_META: Record<NonNullable<ProductCardProps["realm"]>, { color: string; icon: string; label: string }> = {
  hades: { color: "hsl(0 75% 55%)", icon: "🔥", label: "Hades" },
  persephone: { color: "hsl(130 55% 55%)", icon: "🌿", label: "Persephone" },
};

function getPresentation(tier?: TierHandle): Presentation {
  if (tier === "premium-tier") return "premium";
  if (tier === "pro-tier" || tier === "basic-tier") return "standard";
  return "base";
}

function segmentForNameRail(raw: string): string {
  let s = raw.trim().normalize("NFKC");
  if (s.length > 28) s = `${s.slice(0, 26)}…`;
  return s
    .replace(/[\u00AD\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Repeating title on mat seams — overlay strips sized to padding so text always centers in the gap */
function PremiumMatNameOverlay({ title }: { title: string }) {
  const full = (typeof title === "string" ? title : String(title ?? "")).trim();
  const seg = segmentForNameRail(full);
  const loop = `${seg} · `;
  const repeated = Array.from({ length: 28 }, () => loop).join("");
  const railBase =
    "pointer-events-none absolute z-[7] flex items-center justify-center overflow-hidden select-none";
  const railText =
    "whitespace-nowrap font-sans font-medium uppercase tracking-[0.12em] text-primary/70 text-[5px] sm:text-[7px] leading-none [font-variant-ligatures:none]";
  const cornerBase =
    "pointer-events-none absolute z-[7] flex items-center justify-center select-none h-2.5 w-2.5 sm:h-3 sm:w-3";
  const cornerDot = "block h-[2px] w-[2px] sm:h-[3px] sm:w-[3px] rounded-full bg-primary/70";

  return (
    <>
      <div
        className={cn(railBase, "top-0 left-2.5 right-2.5 sm:left-3 sm:right-3 h-2.5 sm:h-3")}
        aria-hidden
      >
        <span className={railText}>{repeated}</span>
      </div>
      <div
        className={cn(railBase, "bottom-0 left-2.5 right-2.5 sm:left-3 sm:right-3 h-2.5 sm:h-3")}
        aria-hidden
      >
        <span className={railText}>{repeated}</span>
      </div>
      <div
        className={cn(railBase, "left-0 top-2.5 bottom-2.5 sm:top-3 sm:bottom-3 w-2.5 sm:w-3")}
        aria-hidden
      >
        <span className={cn(railText, "[writing-mode:vertical-rl] rotate-180")}>{repeated}</span>
      </div>
      <div
        className={cn(railBase, "right-0 top-2.5 bottom-2.5 sm:top-3 sm:bottom-3 w-2.5 sm:w-3")}
        aria-hidden
      >
        <span className={cn(railText, "[writing-mode:vertical-rl]")}>{repeated}</span>
      </div>
      <div className={cn(cornerBase, "top-0 left-0")} aria-hidden>
        <span className={cornerDot} />
      </div>
      <div className={cn(cornerBase, "top-0 right-0")} aria-hidden>
        <span className={cornerDot} />
      </div>
      <div className={cn(cornerBase, "bottom-0 left-0")} aria-hidden>
        <span className={cornerDot} />
      </div>
      <div className={cn(cornerBase, "bottom-0 right-0")} aria-hidden>
        <span className={cornerDot} />
      </div>
    </>
  );
}

/** Quiet L-shaped corners — reads like a vault / atelier frame, not a badge */
function PremiumCornerAccents() {
  return (
    <>
      <div
        className="pointer-events-none absolute left-3 top-3 z-[4] h-9 w-9 border-l border-t border-[hsla(43,38%,62%,0.28)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-3 top-3 z-[4] h-9 w-9 border-r border-t border-[hsla(43,38%,62%,0.28)]"
        aria-hidden
      />
    </>
  );
}

export const ProductCard = ({ product, tier, realm, compact }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const validateAndAddItem = useCartStore((state) => state.validateAndAddItem);
  const { node } = product;
  const presentation = getPresentation(tier);
  const isPremium = presentation === "premium";

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
      selectedOptions: [{ name: "Ring Size", value: "17" }],
    };

    setIsAdding(true);
    try {
      const result = await validateAndAddItem(cartItem);

      if (result.success) {
        if (result.message && result.type === "warning") {
          toast.warning(result.message, {
            position: "top-center",
          });
        } else {
          toast.success(
            <div onClick={() => setCartOpen(true)} className="cursor-pointer w-full">
              Added Size 17 to cart! Click to view
            </div>,
            {
              position: "top-center",
            },
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
  const price = firstVariant?.price ?? node.priceRange?.minVariantPrice;
  const compareAtPrice = firstVariant?.compareAtPrice;
  const isOnSale =
    price &&
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const hasAvailableVariant = node.variants.edges.some((v) => v.node.availableForSale);
  const isSoldOut = !hasAvailableVariant;

  const imageScaleClass =
    isPremium
      ? "md:group-hover:scale-[1.045] transition-transform duration-700 ease-out"
      : presentation === "standard"
        ? "md:group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        : "md:group-hover:scale-[1.02] transition-transform duration-500 ease-out";

  const cardInner = (
    <>
      {realm && (
        <div
          className={cn(
            "flex items-center gap-1.5 text-[10px] font-bold tracking-[0.3em] uppercase",
            !isPremium && "mb-2.5",
          )}
        >
          <span aria-hidden>{REALM_META[realm].icon}</span>
          <span style={{ color: REALM_META[realm].color }}>{REALM_META[realm].label}</span>
        </div>
      )}
      <Link to={`/product/${node.handle}`}>
        <h3
          className={cn(
            "font-heading font-semibold transition-colors duration-300 leading-tight group-hover:text-primary",
            !isPremium && "mb-3",
            isPremium ? "text-[1.28rem] tracking-[0.03em] text-foreground/95" : "text-xl tracking-normal",
          )}
        >
          {node.title}
        </h3>
      </Link>
      <p
        className={cn(
          "text-sm text-muted-foreground line-clamp-2",
          isPremium && "mb-0 text-muted-foreground/90 leading-relaxed",
          !isPremium && "mb-6",
        )}
      >
        {node.description}
      </p>

      <div className="flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-bold text-white transition-colors duration-300 group-hover:text-primary",
              isPremium ? "text-[1.65rem] tabular-nums" : "text-2xl",
            )}
          >
            <span className="text-sm font-medium mr-0.5 opacity-90 transition-opacity group-hover:opacity-100">EGP</span>
            {price ? parseFloat(price.amount).toFixed(0) : "—"}
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
          size={compact ? "icon" : "sm"}
          disabled={isSoldOut || isAdding}
          className={cn(
            "bg-primary hover:bg-primary/90 text-primary-foreground group/btn disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
            isPremium && "shadow-[0_4px_20px_-4px_hsla(38,85%,42%,0.35)]",
            !isPremium && "shadow-gold",
            compact ? "h-8 w-8 p-0" : "px-3",
            !compact && isPremium && "px-4",
          )}
          aria-label={isSoldOut ? "Sold Out" : `Add ${node.title} size 17 to cart`}
          title="Adds size 17 to cart"
        >
          {isAdding ? (
            <Loader2 className={cn("h-4 w-4 animate-spin", !compact && "mr-2")} />
          ) : (
            <ShoppingCart className={cn("h-4 w-4 group-hover/btn:rotate-12 transition-transform", !compact && "mr-2")} />
          )}
          {!compact && (
            <span>{isSoldOut ? "Sold Out" : isAdding ? "Adding..." : "Size 17"}</span>
          )}
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Card
        className={cn(
          "group min-w-0 overflow-hidden h-full flex flex-col relative",
          "transition-[transform,box-shadow,border-color] duration-500 ease-out",
          presentation === "base" &&
            "bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-muted-foreground/20 md:hover:-translate-y-0.5",
          presentation === "standard" &&
            cn(
              "bg-card border border-border/75 shadow-sm",
              "hover:shadow-md hover:border-muted-foreground/25 md:hover:-translate-y-0.5",
            ),
          isPremium &&
            cn(
              "rounded-xl border border-white/[0.08]",
              "bg-[hsl(0_0%_10.5%)]",
              /* Inner rim + depth — no tinted outer glow */
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.055),inset_0_-1px_0_0_rgba(0,0,0,0.35),0_4px_14px_-4px_rgba(0,0,0,0.45)]",
              "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.075),inset_0_-1px_0_0_rgba(0,0,0,0.4),0_22px_50px_-20px_rgba(0,0,0,0.58)]",
              "hover:border-white/[0.12] md:hover:-translate-y-[4px]",
              "before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[11px] before:border before:border-white/[0.04] before:content-['']",
            ),
        )}
      >
        <Link to={`/product/${node.handle}`} className="block w-full shrink-0">
          {isPremium ? (
            <div
              className={cn(
                "relative flex aspect-square min-h-0 flex-col overflow-hidden",
                "bg-[hsl(26_7%_7%)]",
                "p-2.5 sm:p-3",
                "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.45)]",
              )}
            >
              <PremiumMatNameOverlay title={node.title} />
              <div className="relative z-0 min-h-0 flex-1 overflow-hidden">
                <div
                  className={cn(
                    "relative h-full w-full overflow-hidden",
                    "rounded-md",
                    "bg-gradient-to-br from-[hsl(32_6%_11%)] to-[hsl(24_5%_9%)]",
                    "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_12px_28px_-8px_rgba(0,0,0,0.35)]",
                    "md:group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07),inset_0_18px_40px_-10px_rgba(0,0,0,0.42)]",
                  )}
                >
                  <PremiumCornerAccents />
                  <div
                    className="pointer-events-none absolute inset-0 z-[1] opacity-[0.22] md:group-hover:opacity-[0.32] transition-opacity duration-700"
                    style={{
                      background:
                        "radial-gradient(ellipse 85% 55% at 50% 0%, hsla(46, 28%, 88%, 0.14), transparent 62%)",
                    }}
                    aria-hidden
                  />
                  <div className="pointer-events-none absolute inset-0 z-[1] opacity-0 md:group-hover:opacity-100 transition-opacity duration-600 bg-gradient-to-b from-transparent via-transparent to-black/[0.08]" />

                  {image ? (
                    <>
                      <ProgressiveImage
                        src={image.url}
                        alt={image.altText || node.title}
                        className={imageScaleClass}
                        containerClassName="absolute inset-0 z-0"
                        rootMargin="200px"
                      />
                      {secondImage && (
                        <ProgressiveImage
                          src={secondImage.url}
                          alt={secondImage.altText || node.title}
                          className={cn(imageScaleClass, "opacity-0 md:group-hover:opacity-100")}
                          containerClassName="absolute inset-0 z-0"
                          rootMargin="200px"
                        />
                      )}
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-6xl">⚡</div>
                  )}

                  <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[hsl(0_0%_4%_/_0.45)] via-transparent to-transparent opacity-[0.35] transition-opacity duration-500 md:group-hover:opacity-[0.75]" />

                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[4] h-px bg-gradient-to-r from-transparent via-[hsla(43,36%,58%,0.45)] to-transparent opacity-80" aria-hidden />

                  {isSoldOut && (
                    <Badge className="absolute left-4 top-4 z-10 border-0 bg-muted px-3 py-1.5 text-muted-foreground shadow-lg">
                      Sold Out
                    </Badge>
                  )}

                  <div className="pointer-events-none absolute inset-0 z-[5] hidden items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleQuickView}
                      className="pointer-events-auto gap-2 border border-border/60 bg-background/90 shadow-md backdrop-blur-sm hover:bg-background md:group-hover:scale-[1.02]"
                    >
                      <Eye className="h-4 w-4" />
                      Quick View
                    </Button>
                  </div>

                  <div className="absolute right-4 top-4 z-10 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                    <WishlistButton product={product} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-card",
              )}
            >
              {presentation === "standard" && (
                <div className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 md:group-hover:opacity-100 bg-gradient-to-b from-transparent to-black/[0.05]" />
              )}

              {image ? (
                <>
                  <ProgressiveImage
                    src={image.url}
                    alt={image.altText || node.title}
                    className={imageScaleClass}
                    containerClassName="absolute inset-0"
                    rootMargin="200px"
                  />
                  {secondImage && (
                    <ProgressiveImage
                      src={secondImage.url}
                      alt={secondImage.altText || node.title}
                      className={cn(imageScaleClass, "opacity-0 md:group-hover:opacity-100")}
                      containerClassName="absolute inset-0"
                      rootMargin="200px"
                    />
                  )}
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl">⚡</div>
              )}

              <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 md:group-hover:opacity-100" />

              {isSoldOut && (
                <Badge className="absolute left-4 top-4 z-10 border-0 bg-muted px-3 py-1.5 text-muted-foreground shadow-lg">
                  Sold Out
                </Badge>
              )}

              <div className="pointer-events-none absolute inset-0 z-[3] hidden items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleQuickView}
                  className="pointer-events-auto gap-2 border border-border/60 bg-background/90 shadow-md backdrop-blur-sm hover:bg-background"
                >
                  <Eye className="h-4 w-4" />
                  Quick View
                </Button>
              </div>

              <div className="absolute right-4 top-4 z-10 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                <WishlistButton product={product} />
              </div>
            </div>
          )}
        </Link>

        <CardContent
          className={cn(
            "flex-1 flex flex-col",
            isPremium ? "!p-0" : "p-6",
            isPremium &&
              cn(
                "border-t border-white/[0.06]",
                "bg-gradient-to-b from-[hsl(0_0%_10.8%)] to-[hsl(0_0%_9.8%)]",
              ),
            presentation === "standard" && "border-t border-border/40",
          )}
        >
          {isPremium ? (
            <div className="flex min-h-0 flex-1 flex-col space-y-4 px-7 py-7">{cardInner}</div>
          ) : (
            cardInner
          )}
        </CardContent>
      </Card>

      <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </>
  );
};
