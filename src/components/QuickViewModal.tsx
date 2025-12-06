import { useState } from "react";
import { Eye, ShoppingCart, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShopifyProduct } from "@/lib/shopify";
import { WishlistButton } from "@/components/WishlistButton";
import { useNavigate } from "react-router-dom";

interface QuickViewModalProps {
    product: ShopifyProduct | null;
    isOpen: boolean;
    onClose: () => void;
}

const RING_SIZES = ["6", "7", "8", "9", "10", "11", "12"];

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const navigate = useNavigate();

    if (!product) return null;

    const { node } = product;
    const firstVariant = node.variants.edges[0]?.node;
    const price = firstVariant?.price || node.priceRange.minVariantPrice;
    const compareAtPrice = firstVariant?.compareAtPrice;
    const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
    const images = node.images.edges;
    // Check if any variant is available for sale
    const isInStock = node.variants.edges.some(v => v.node.availableForSale);

    const handleAddToCart = async () => {
        if (!selectedSize) return;

        setIsAddingToCart(true);
        // Simulate adding to cart - would integrate with actual cart logic
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsAddingToCart(false);
        onClose();
        // Navigate to product page for checkout
        navigate(`/product/${node.handle}`);
    };

    const handleViewDetails = () => {
        onClose();
        navigate(`/product/${node.handle}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
                <DialogHeader className="sr-only">
                    <DialogTitle>{node.title}</DialogTitle>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="relative bg-muted">
                        <div className="aspect-[4/3] md:aspect-square">
                            {images[selectedImageIndex]?.node && (
                                <img
                                    src={images[selectedImageIndex].node.url}
                                    alt={images[selectedImageIndex].node.altText || node.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                                {images.slice(0, 4).map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${index === selectedImageIndex
                                            ? 'border-primary'
                                            : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={img.node.url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Wishlist Button */}
                        <div className="absolute top-4 right-4">
                            <WishlistButton product={product} variant="icon" />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-6 md:p-8 flex flex-col">
                        <div className="flex-1">
                        <h2 className="text-2xl font-heading font-bold mb-2">{node.title}</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <p className="text-3xl font-bold text-primary">
                                E£{parseFloat(price.amount).toFixed(0)}
                            </p>
                            {isOnSale && compareAtPrice && (
                                <p className="text-xl text-muted-foreground line-through">
                                    E£{parseFloat(compareAtPrice.amount).toFixed(0)}
                                </p>
                            )}
                            {isOnSale && (
                                <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded">
                                    SALE
                                </span>
                            )}
                        </div>

                            <p className="text-muted-foreground mb-6 line-clamp-3">
                                {node.description}
                            </p>

                            {/* Size Selector */}
                            <div className="mb-6">
                                <Label className="text-base font-semibold mb-3 block">
                                    Select Size
                                </Label>
                                <RadioGroup
                                    value={selectedSize}
                                    onValueChange={setSelectedSize}
                                    className="flex flex-wrap gap-2"
                                >
                                    {RING_SIZES.map((size) => (
                                        <div key={size}>
                                            <RadioGroupItem
                                                value={size}
                                                id={`quick-size-${size}`}
                                                className="sr-only"
                                            />
                                            <Label
                                                htmlFor={`quick-size-${size}`}
                                                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 cursor-pointer transition-all ${selectedSize === size
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                {size}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {isInStock ? (
                                    <span className="text-sm text-green-500 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="text-sm text-destructive flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-destructive" />
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleAddToCart}
                                disabled={!selectedSize || !isInStock || isAddingToCart}
                                className="w-full h-12 text-base"
                            >
                                {isAddingToCart ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        {!selectedSize ? 'Select a Size' : 'Add to Cart'}
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleViewDetails}
                                className="w-full h-12 text-base"
                            >
                                View Full Details
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Quick View trigger button for ProductCard
interface QuickViewButtonProps {
    onClick: (e: React.MouseEvent) => void;
}

export function QuickViewButton({ onClick }: QuickViewButtonProps) {
    return (
        <Button
            variant="secondary"
            size="sm"
            onClick={onClick}
            className="gap-2 bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
        >
            <Eye className="h-4 w-4" />
            Quick View
        </Button>
    );
}
