import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function SearchDialog() {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        if (open && products.length === 0) {
            setLoading(true);
            fetchProducts(100)
                .then((data) => setProducts(data))
                .catch((err) => console.error("Failed to load products for search", err))
                .finally(() => setLoading(false));
        }
    }, [open, products.length]);

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;
        const query = searchQuery.toLowerCase();
        return products.filter(p =>
            p.node.title.toLowerCase().includes(query) ||
            p.node.description?.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    const handleSelect = (handle: string) => {
        setOpen(false);
        setSearchQuery("");
        navigate(`/product/${handle}`);
    };

    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    // Check if product has any available variant
    const isProductAvailable = (product: ShopifyProduct) => {
        return product.node.variants.edges.some(v => v.node.availableForSale);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Search products"
                >
                    <Search className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
                <SheetHeader className="px-4 py-4 border-b border-border">
                    <SheetTitle className="sr-only">Search Products</SheetTitle>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search rings..."
                            className="pl-10 pr-10 h-12 text-base bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                            autoFocus
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {searchQuery ? (
                            <>{filteredProducts.length} result{filteredProducts.length !== 1 && 's'} found</>
                        ) : (
                            <>Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">{isMac ? '⌘' : 'Ctrl'}K</kbd> anytime to search</>
                        )}
                    </p>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Loading rings...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3 px-4">
                            <div className="text-5xl">🔍</div>
                            <p className="text-muted-foreground text-center">
                                No rings found for "{searchQuery}"
                            </p>
                            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                                Clear search
                            </Button>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.node.id}
                                    onClick={() => handleSelect(product.node.handle)}
                                    className="w-full flex items-center gap-4 p-3 rounded-xl bg-card hover:bg-muted/50 border border-border hover:border-primary/30 transition-all duration-200 text-left group"
                                >
                                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                        {product.node.images.edges[0]?.node && (
                                            <img
                                                src={product.node.images.edges[0].node.url}
                                                alt={product.node.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                                            {product.node.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-lg font-bold text-primary">
                                                E£{parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}
                                            </span>
                                            {!isProductAvailable(product) && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                                                    Sold Out
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
