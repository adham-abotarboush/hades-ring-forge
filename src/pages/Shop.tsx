import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { ShopifyProduct, fetchCollectionByHandle } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProducts } from "@/contexts/ProductsContext";
import {
  useProductTierMap,
  tierRank,
  TIER_HANDLES,
  type TierHandle,
  parseShopTierParam,
  matchesShopTierFilter,
  type ShopTierFilter,
} from "@/hooks/useProductTierMap";

const MAX_PRICE = 1000;

type SortOption = "featured" | "price-low" | "price-high" | "newest" | "title";

const PRICE_PRESETS = [
  { label: "All", min: 0, max: MAX_PRICE },
  { label: "Under EGP 200", min: 0, max: 200 },
  { label: "EGP 200 - 400", min: 200, max: 400 },
  { label: "EGP 400 - 600", min: 400, max: 600 },
  { label: "EGP 600+", min: 600, max: MAX_PRICE },
];

/** Shopify often exposes a catch-all “home” collection — hide from shop filters */
function isNoiseCollection(c: { node: { title: string; handle: string } }): boolean {
  const title = c.node.title.trim().toLowerCase();
  const handle = c.node.handle.trim().toLowerCase();
  if (["home", "frontpage", "homepage", "home-page", "home_page"].includes(handle)) return true;
  if (["home", "home page", "homepage", "front page"].includes(title)) return true;
  if (/^home\s*page$/i.test(c.node.title.trim())) return true;
  return false;
}

const Shop = () => {
  const { products, collections, isLoading: loading } = useProducts();
  const productTierMap = useProductTierMap();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTier = useMemo(
    () => parseShopTierParam(searchParams.get("tier")),
    [searchParams],
  );

  const setSelectedTier = useCallback(
    (tier: ShopTierFilter) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (tier === "all") next.delete("tier");
          else if (tier === "premium") next.set("tier", "premium");
          else next.set("tier", "basic");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [showInStock, setShowInStock] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);

  const { data: collectionFilterData, isFetching: collectionFilterFetching } = useQuery({
    queryKey: ["shop-filter-collection", selectedCollection],
    queryFn: () => fetchCollectionByHandle(selectedCollection, 100),
    enabled: selectedCollection !== "all",
    staleTime: 1000 * 60 * 5,
  });

  const baseProductList: ShopifyProduct[] = useMemo(() => {
    if (selectedCollection === "all") return products;
    if (!collectionFilterData?.node.products.edges) return [];
    return collectionFilterData.node.products.edges;
  }, [products, selectedCollection, collectionFilterData]);

  const isProductInStock = useCallback((product: ShopifyProduct) => {
    return product.node.variants.edges.some((v) => v.node.availableForSale);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...baseProductList];

    result = result.filter((p) => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (showInStock) {
      result = result.filter((p) => isProductInStock(p));
    }

    result = result.filter((p) => matchesShopTierFilter(productTierMap, p.node.id, selectedTier));

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            parseFloat(a.node.priceRange.minVariantPrice.amount) -
            parseFloat(b.node.priceRange.minVariantPrice.amount),
        );
        break;
      case "price-high":
        result.sort(
          (a, b) =>
            parseFloat(b.node.priceRange.minVariantPrice.amount) -
            parseFloat(a.node.priceRange.minVariantPrice.amount),
        );
        break;
      case "title":
        result.sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      case "newest":
        result.reverse();
        break;
      case "featured":
      default:
        result.sort((a, b) => {
          const aRank = tierRank(productTierMap.get(a.node.id));
          const bRank = tierRank(productTierMap.get(b.node.id));
          if (aRank !== bRank) return aRank - bRank;
          const aAvailable = a.node.variants?.edges?.some((v) => v.node.availableForSale) ?? false;
          const bAvailable = b.node.variants?.edges?.some((v) => v.node.availableForSale) ?? false;
          if (aAvailable && !bAvailable) return -1;
          if (!aAvailable && bAvailable) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [baseProductList, priceRange, showInStock, sortBy, productTierMap, selectedTier, isProductInStock]);

  const clearFilters = () => {
    setPriceRange([0, MAX_PRICE]);
    setShowInStock(false);
    setSelectedCollection("all");
    setSelectedTier("all");
    setSortBy("featured");
  };

  const hasActiveFilters =
    priceRange[0] > 0 ||
    priceRange[1] < MAX_PRICE ||
    showInStock ||
    selectedCollection !== "all" ||
    selectedTier !== "all";

  const browseCollections = useMemo(
    () =>
      collections.filter(
        (c) => !TIER_HANDLES.includes(c.node.handle as TierHandle) && !isNoiseCollection(c),
      ),
    [collections],
  );

  const collectionListLoading = selectedCollection !== "all" && collectionFilterFetching;
  const gridLoading = loading || collectionListLoading;

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
            <span className="font-semibold">
              <span className="text-xs font-normal opacity-70">EGP</span> {priceRange[0]}
            </span>
          </div>
          <span className="text-muted-foreground">—</span>
          <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-center">
            <span className="text-muted-foreground text-xs block">Max</span>
            <span className="font-semibold">
              <span className="text-xs font-normal opacity-70">EGP</span> {priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="in-stock" className="text-base font-semibold">
          In Stock Only
        </Label>
        <Switch id="in-stock" checked={showInStock} onCheckedChange={setShowInStock} />
      </div>

      {browseCollections.length > 0 && (
        <div>
          <Label className="text-base font-semibold mb-3 block">Collections</Label>
          <Select value={selectedCollection} onValueChange={setSelectedCollection}>
            <SelectTrigger>
              <SelectValue placeholder="All Collections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collections</SelectItem>
              {browseCollections.map((collection) => (
                <SelectItem key={collection.node.id} value={collection.node.handle}>
                  {collection.node.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label className="text-base font-semibold mb-3 block">Tier</Label>
        <Select
          value={selectedTier}
          onValueChange={(v) => setSelectedTier(v as ShopTierFilter)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All tiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tiers</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background page-transition">
      <Navigation />

      <main className="pt-32 pb-16 sm:pt-40 sm:pb-20 container mx-auto max-w-[100vw] px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <div className="inline-block mb-3 px-3 py-1.5 sm:mb-4 sm:px-4 sm:py-2 bg-primary/10 border border-primary/20 rounded-full">
            <p className="text-xs font-medium text-primary sm:text-sm">⚡ Limited Edition Pieces</p>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 sm:mb-6 px-1 leading-tight">
            The Underworld Collection
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-1">
            Explore our collection of handcrafted spoon rings, each inspired by the legends and deities of the ancient
            underworld
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Sheet open={mobileFiltersVisible} onOpenChange={setMobileFiltersVisible}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                        !
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[min(100vw,20rem)] sm:w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <Button variant="outline" onClick={() => setFiltersOpen(!filtersOpen)} className="hidden lg:flex">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {filtersOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">!</span>
                )}
              </Button>

              <p className="text-sm text-muted-foreground">
                {gridLoading ? "…" : `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="title">Alphabetically</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {filtersOpen && (
            <aside className="hidden lg:block w-64 shrink-0 animate-fade-in">
              <div className="sticky top-32 bg-card border border-border rounded-lg p-6">
                <FilterContent />
              </div>
            </aside>
          )}

          <div className="flex-1">
            {gridLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-32 animate-fade-in">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-3xl font-heading font-semibold mb-4">No Products Found</h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  {hasActiveFilters
                    ? "Try adjusting your filters to find what you're looking for."
                    : "Our forge is currently empty. Check back soon for mythic treasures!"}
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  filtersOpen ? "lg:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"
                } gap-6 lg:gap-8`}
              >
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.node.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} tier={productTierMap.get(product.node.id)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
