import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";

export function SearchDialog() {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(false);
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

    const handleSelect = (handle: string) => {
        setOpen(false);
        navigate(`/product/${handle}`);
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setOpen(true)}
                aria-label="Search products"
            >
                <Search className="h-5 w-5" />
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search rings..." className="text-foreground placeholder:text-muted-foreground" />
                <CommandList className="bg-background border-t border-border">
                    <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No results found.</CommandEmpty>
                    {loading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <CommandGroup heading="Products" className="text-foreground">
                            {products.map((product) => (
                                <CommandItem
                                    key={product.node.id}
                                    value={product.node.title}
                                    onSelect={() => handleSelect(product.node.handle)}
                                    className="cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary"
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                                            {product.node.images.edges[0]?.node && (
                                                <ProgressiveImage
                                                    src={product.node.images.edges[0].node.url}
                                                    alt={product.node.title}
                                                    containerClassName="w-full h-full"
                                                    lazy={false}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{product.node.title}</span>
                                            <span className="text-xs text-muted-foreground">
                                                E£{parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
