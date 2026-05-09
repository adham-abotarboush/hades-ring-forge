import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { fetchCollectionByHandle, ShopifyProduct } from "@/lib/shopify";
import { useProductTierMap, tierRank } from "@/hooks/useProductTierMap";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { SEO } from "@/components/SEO";
import { GreekMeander } from "@/components/GreekOrnaments";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type SortOption = "featured" | "price-low" | "price-high" | "title";

const MAX_PRICE = 1000;

const PRICE_PRESETS = [
  { label: "All", min: 0, max: MAX_PRICE },
  { label: "Under EGP 200", min: 0, max: 200 },
  { label: "EGP 200–400", min: 200, max: 400 },
  { label: "EGP 400–600", min: 400, max: 600 },
  { label: "EGP 600+", min: 600, max: MAX_PRICE },
];

// Per-collection theme configuration
const COLLECTION_THEMES: Record<string, {
  accent: string;
  accentMuted: string;
  accentBorder: string;
  accentHover: string;
  gradientFrom: string;
  gradientTo: string;
  glow: string;
  icon: string;
  badge: string;
  heroTagline: string;
  heroDesc: string;
  cta: string;
}> = {
  hades: {
    accent: "hsl(0 75% 55%)",
    accentMuted: "hsl(0 75% 50% / 0.15)",
    accentBorder: "hsl(0 75% 50% / 0.35)",
    accentHover: "hsl(0 75% 50%)",
    gradientFrom: "hsl(0 60% 8%)",
    gradientTo: "hsl(15 70% 22%)",
    glow: "0 20px 60px -15px hsl(0 75% 50% / 0.45)",
    icon: "🔥",
    badge: "The Underworld",
    heroTagline: "Lord of the Underworld",
    heroDesc: "Forged in the fires beneath Olympus. Each piece carries the weight of eternity — commanding, dark, and unyielding as Hades himself.",
    cta: "Rings of Ember & Shadow",
  },
  persephone: {
    accent: "hsl(130 55% 55%)",
    accentMuted: "hsl(130 55% 50% / 0.15)",
    accentBorder: "hsl(130 55% 50% / 0.35)",
    accentHover: "hsl(130 55% 50%)",
    gradientFrom: "hsl(140 50% 6%)",
    gradientTo: "hsl(110 50% 22%)",
    glow: "0 20px 60px -15px hsl(130 55% 50% / 0.45)",
    icon: "🌿",
    badge: "Queen of Spring",
    heroTagline: "Bloom in the Darkness",
    heroDesc: "Rings born of spring's defiance — where pomegranate blossoms meet eternal shadow. Delicate yet timeless, as radiant as the seeds that bound her.",
    cta: "Rings of Bloom & Verdant Light",
  },
  "basic-tier": {
    accent: "hsl(28 55% 55%)",
    accentMuted: "hsl(28 55% 50% / 0.15)",
    accentBorder: "hsl(28 55% 50% / 0.3)",
    accentHover: "hsl(28 55% 50%)",
    gradientFrom: "hsl(20 40% 8%)",
    gradientTo: "hsl(28 55% 22%)",
    glow: "0 20px 60px -15px hsl(28 55% 50% / 0.4)",
    icon: "🛡️",
    badge: "Basic Tier",
    heroTagline: "Where the Journey Begins",
    heroDesc: "Approachable yet uncompromising. Entry rings that carry the same forge-fire as their elder siblings — accessible without sacrificing soul.",
    cta: "Approachable Mythic Pieces",
  },
  "pro-tier": {
    accent: "hsl(210 15% 78%)",
    accentMuted: "hsl(210 15% 78% / 0.15)",
    accentBorder: "hsl(210 15% 78% / 0.3)",
    accentHover: "hsl(210 15% 70%)",
    gradientFrom: "hsl(220 15% 8%)",
    gradientTo: "hsl(210 15% 25%)",
    glow: "0 20px 60px -15px hsl(210 15% 78% / 0.4)",
    icon: "⚜️",
    badge: "Pro Tier",
    heroTagline: "Crafted for the Devoted",
    heroDesc: "Mid-tier rings forged with deeper detail and refined finishes. For those who walk between realms — a step deeper into the legend.",
    cta: "Refined Forged Detail",
  },
  "premium-tier": {
    accent: "hsl(45 90% 60%)",
    accentMuted: "hsl(45 90% 55% / 0.15)",
    accentBorder: "hsl(45 90% 55% / 0.3)",
    accentHover: "hsl(45 90% 55%)",
    gradientFrom: "hsl(45 70% 8%)",
    gradientTo: "hsl(45 90% 22%)",
    glow: "0 20px 60px -15px hsl(45 90% 55% / 0.4)",
    icon: "👑",
    badge: "Premium Tier",
    heroTagline: "The Heroes of the Forge",
    heroDesc: "One-of-one statement rings — the crown jewels of the collection. Each piece is singular, named, and carries its own myth.",
    cta: "Singular, Hero-Tier Pieces",
  },
};

const DEFAULT_THEME = COLLECTION_THEMES.hades;

const REALM_HANDLES = ["hades", "persephone"] as const;

const CollectionDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const theme = (handle && COLLECTION_THEMES[handle]) ?? DEFAULT_THEME;
  const isRealm = !!handle && (REALM_HANDLES as readonly string[]).includes(handle);

  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [showInStock, setShowInStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    data: collection,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collection", handle],
    queryFn: () => fetchCollectionByHandle(handle!, 50),
    enabled: !!handle,
    staleTime: 1000 * 60 * 10,
  });

  // For realm pages (Hades/Persephone), look up each product's tier so the
  // card can render tier-specific styling.
  const productTierMap = useProductTierMap(isRealm);

  const products: ShopifyProduct[] = collection?.node.products.edges ?? [];

  const isProductInStock = (p: ShopifyProduct) =>
    p.node.variants.edges.some((v) => v.node.availableForSale);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    result = result.filter((p) => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (showInStock) result = result.filter(isProductInStock);

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            parseFloat(a.node.priceRange.minVariantPrice.amount) -
            parseFloat(b.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "price-high":
        result.sort(
          (a, b) =>
            parseFloat(b.node.priceRange.minVariantPrice.amount) -
            parseFloat(a.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "title":
        result.sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      case "featured":
      default:
        result.sort((a, b) => {
          // Primary: tier rank (Premium → Pro → Basic → untiered)
          const aRank = tierRank(productTierMap.get(a.node.id));
          const bRank = tierRank(productTierMap.get(b.node.id));
          if (aRank !== bRank) return aRank - bRank;
          // Secondary: in-stock first
          const aOk = a.node.variants?.edges?.some((v) => v.node.availableForSale) ?? false;
          const bOk = b.node.variants?.edges?.some((v) => v.node.availableForSale) ?? false;
          if (aOk && !bOk) return -1;
          if (!aOk && bOk) return 1;
          return 0;
        });
    }

    return result;
  }, [products, priceRange, showInStock, sortBy, productTierMap]);

  const hasActiveFilters =
    priceRange[0] > 0 || priceRange[1] < MAX_PRICE || showInStock;

  const clearFilters = () => {
    setPriceRange([0, MAX_PRICE]);
    setShowInStock(false);
    setSortBy("featured");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Price Range</Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRICE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setPriceRange([preset.min, preset.max])}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
                priceRange[0] === preset.min && priceRange[1] === preset.max
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50 hover:bg-primary/10"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-center">
            <span className="text-muted-foreground text-xs block">Min</span>
            <span className="font-semibold"><span className="text-xs font-normal opacity-70">EGP</span> {priceRange[0]}</span>
          </div>
          <span className="text-muted-foreground">—</span>
          <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-center">
            <span className="text-muted-foreground text-xs block">Max</span>
            <span className="font-semibold"><span className="text-xs font-normal opacity-70">EGP</span> {priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="in-stock-col" className="text-base font-semibold">In Stock Only</Label>
        <Switch id="in-stock-col" checked={showInStock} onCheckedChange={setShowInStock} />
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  // Not-found state
  if (!isLoading && !collection && !error) {
    return (
      <div className="min-h-screen bg-background page-transition">
        <Navigation />
        <main className="pt-40 pb-20 container mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🏛️</div>
          <h1 className="text-4xl font-heading font-bold mb-4">Collection Not Found</h1>
          <p className="text-muted-foreground mb-8">
            This collection hasn't been unveiled yet. Return to the forge.
          </p>
          <Link to="/collections">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const collectionTitle = collection?.node.title ?? (handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : "Collection");

  return (
    <div className="min-h-screen bg-background page-transition">
      <SEO
        title={`${collectionTitle} Collection — Hades Ring Forge`}
        description={theme.heroDesc}
      />
      <Navigation />

      <main className="pt-28 pb-20">
        {/* Compact Hero — just enough to set the realm tone */}
        <div className="relative overflow-hidden mb-8">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${theme.accent}33, transparent 70%)`,
            }}
          />

          <div className="relative z-10 container mx-auto px-4 pt-6 pb-5">
            {/* Breadcrumb */}
            <div className="flex justify-start mb-4">
              <Link
                to="/collections"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
                All Collections
              </Link>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl drop-shadow-[0_0_12px_currentColor]" style={{ color: theme.accent }}>
                  {theme.icon}
                </span>
                <div>
                  <p
                    className="text-[10px] md:text-xs font-semibold tracking-[0.35em] uppercase mb-0.5"
                    style={{ color: theme.accent, opacity: 0.9 }}
                  >
                    {theme.badge}
                  </p>
                  <h1
                    className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tighter leading-none"
                    style={{ textShadow: `0 0 30px ${theme.accent}40` }}
                  >
                    {collectionTitle}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Thin meander divider beneath the title */}
          <div className="container mx-auto px-4">
            <GreekMeander color={theme.accent} height={10} opacity={0.45} />
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Sort & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Mobile Filter */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">!</span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="hidden lg:flex"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {filtersOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">!</span>
                )}
              </Button>

              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading…" : `${filteredProducts.length} ${filteredProducts.length === 1 ? "piece" : "pieces"}`}
              </p>
            </div>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="title">Alphabetically</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            {filtersOpen && (
              <aside className="hidden lg:block w-64 shrink-0 animate-fade-in">
                <div className="sticky top-32 bg-card border border-border rounded-lg p-6">
                  <FilterContent />
                </div>
              </aside>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-32 animate-fade-in">
                  <div className="text-6xl mb-6">{theme.icon}</div>
                  <h3 className="text-3xl font-heading font-semibold mb-4">No Pieces Found</h3>
                  <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                    {hasActiveFilters
                      ? "Try adjusting your filters to uncover hidden treasures."
                      : "This realm's forge is being prepared. Return soon."}
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    filtersOpen ? "lg:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"
                  } gap-6 lg:gap-8`}
                >
                  {filteredProducts.map((product, index) => {
                    const productTier = isRealm
                      ? productTierMap.get(product.node.id)
                      : undefined;
                    return (
                      <div
                        key={product.node.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <ProductCard product={product} tier={productTier} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollectionDetail;
