import { useState, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { ShopifyProduct } from "@/lib/shopify";
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

const MAX_PRICE = 1000;

type SortOption = "featured" | "price-low" | "price-high" | "newest" | "title";

const PRICE_PRESETS = [
  { label: "All", min: 0, max: MAX_PRICE },
  { label: "Under EGP 200", min: 0, max: 200 },
  { label: "EGP 200 - 400", min: 200, max: 400 },
  { label: "EGP 400 - 600", min: 400, max: 600 },
  { label: "EGP 600+", min: 600, max: MAX_PRICE },
];

const Shop = () => {
  const { products, collections, isLoading: loading } = useProducts();
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [showInStock, setShowInStock] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);

  // Helper to check if product is available
  const isProductInStock = (product: ShopifyProduct) => {
    return product.node.variants.edges.some(v => v.node.availableForSale);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by price range
    result = result.filter(p => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by stock
    if (showInStock) {
      result = result.filter(p => isProductInStock(p));
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) =>
          parseFloat(a.node.priceRange.minVariantPrice.amount) -
          parseFloat(b.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "price-high":
        result.sort((a, b) =>
          parseFloat(b.node.priceRange.minVariantPrice.amount) -
          parseFloat(a.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "title":
        result.sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      case "newest":
        // Note: Shopify returns products in order, so "newest" would require createdAt
        // For now, we'll just reverse the order
        result.reverse();
        break;
      default:
        // "featured" - keep original order
        break;
    }

    return result;
  }, [products, priceRange, showInStock, sortBy]);

  const clearFilters = () => {
    setPriceRange([0, MAX_PRICE]);
    setShowInStock(false);
    setSelectedCollection("all");
    setSortBy("featured");
  };

  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < MAX_PRICE || showInStock || selectedCollection !== "all";

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Price Range</Label>

        {/* Quick Preset Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRICE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setPriceRange([preset.min, preset.max])}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${priceRange[0] === preset.min && priceRange[1] === preset.max
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:border-primary/50 hover:bg-primary/10'
                }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Range Display */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-center">
            <span className="text-muted-foreground text-xs block">Min</span>
            <span className="font-semibold">EGP {priceRange[0]}</span>
          </div>
          <span className="text-muted-foreground">—</span>
          <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-center">
            <span className="text-muted-foreground text-xs block">Max</span>
            <span className="font-semibold">EGP {priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* In Stock Only */}
      <div className="flex items-center justify-between">
        <Label htmlFor="in-stock" className="text-base font-semibold">In Stock Only</Label>
        <Switch
          id="in-stock"
          checked={showInStock}
          onCheckedChange={setShowInStock}
        />
      </div>

      {/* Collections */}
      {collections.length > 0 && (
        <div>
          <Label className="text-base font-semibold mb-3 block">Collections</Label>
          <Select value={selectedCollection} onValueChange={setSelectedCollection}>
            <SelectTrigger>
              <SelectValue placeholder="All Collections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collections</SelectItem>
              {collections.map((collection) => (
                <SelectItem key={collection.node.id} value={collection.node.handle}>
                  {collection.node.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background page-transition">
      <Navigation />

      <main className="pt-40 pb-20 container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <p className="text-sm font-medium text-primary">⚡ Limited Edition Pieces</p>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6">
            The Underworld Collection
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our collection of handcrafted spoon rings, each inspired by the legends and deities of the ancient underworld
          </p>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
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
              {filtersOpen ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  !
                </span>
              )}
            </Button>

            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
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
            {loading ? (
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
                    : "Our forge is currently empty. Check back soon for mythic treasures!"
                  }
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${filtersOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6 lg:gap-8`}>
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.node.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} />
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
