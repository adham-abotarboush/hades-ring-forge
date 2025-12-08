import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Loader2, Plus, Minus, Info, ZoomIn, Flame } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { ProductDetailSkeleton } from "@/components/ProductCardSkeleton";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";
import sizeChartImage from "@/assets/sizeChart.jpg";
import { SEO } from "@/components/SEO";
import { WishlistButton } from "@/components/WishlistButton";
import { StickyAddToCart } from "@/components/StickyAddToCart";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ImageZoom } from "@/components/ImageZoom";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useProducts } from "@/contexts/ProductsContext";
import { StockWarning } from "@/components/cart/StockWarning";

const ProductDetail = () => {
  const { handle } = useParams();
  const { getProductByHandle, isLoading } = useProducts();
  const product = getProductByHandle(handle || "");
  const loading = isLoading;
  
  const [selectedSize, setSelectedSize] = useState<string>("17");
  const [quantity, setQuantity] = useState<number>(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [quantityWarning, setQuantityWarning] = useState<string | null>(null);
  const addItem = useCartStore(state => state.addItem);
  const addToCartRef = useRef<HTMLDivElement>(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (addToCartRef.current) {
      observer.observe(addToCartRef.current);
    }

    return () => {
      if (addToCartRef.current) {
        observer.unobserve(addToCartRef.current);
      }
    };
  }, [product]);

  // Track as recently viewed when product loads
  useEffect(() => {
    if (product) {
      addProduct(product);
    }
  }, [product, addProduct]);

  // Helper to check if product is available
  const isProductAvailable = (prod: ShopifyProduct) => {
    return prod.node.variants.edges.some(v => v.node.availableForSale);
  };

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;

    // Use the first variant for cart (size will be stored in selectedOptions)
    const selectedVariant = product.node.variants.edges[0]?.node;

    if (!selectedVariant) return;

    // Check if product is available
    if (!isProductAvailable(product)) {
      toast.error("This product is out of stock", {
        position: "top-center",
      });
      return;
    }

    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: `Size ${selectedSize}`,
      price: selectedVariant.price,
      quantity: quantity,
      selectedOptions: [{ name: "Ring Size", value: selectedSize }]
    };

    setIsAddingToCart(true);
    try {
      const result = await useCartStore.getState().validateAndAddItem(cartItem);

      if (result.success) {
        if (result.message && result.type === 'warning') {
          toast.warning(result.message, {
            position: "top-center",
          });
        } else {
          toast.success(`Added to cart!`, {
            position: "top-center",
          });
        }
      } else if (result.message) {
        toast.error(result.message, {
          position: "top-center",
        });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    const selectedVariant = product.node.variants.edges[0]?.node;

    if (!selectedVariant) return;

    if (!isProductAvailable(product)) {
      toast.error("This product is out of stock", {
        position: "top-center",
      });
      return;
    }

    // Open window synchronously BEFORE any async operations (Safari popup blocker fix)
    const newWindow = window.open('about:blank', '_blank');

    setIsCheckingOut(true);

    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: `Size ${selectedSize}`,
      price: selectedVariant.price,
      quantity: quantity,
      selectedOptions: [{ name: "Ring Size", value: selectedSize }]
    };

    const success = addItem(cartItem);

    if (!success) {
      setIsCheckingOut(false);
      newWindow?.close();
      return;
    }

    try {
      // Validate inventory before checkout
      const isValid = await useCartStore.getState().validateCartInventory();
      if (!isValid) {
        setIsCheckingOut(false);
        newWindow?.close();
        return;
      }

      await useCartStore.getState().createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl && newWindow) {
        newWindow.location.href = checkoutUrl;
        // Clear cart after successful checkout
        useCartStore.getState().clearCart();
      } else {
        newWindow?.close();
      }
    } catch (error) {
      toast.error("Failed to create checkout", {
        position: "top-center",
      });
      newWindow?.close();
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Limit quantity based on available inventory
  const maxQuantity = product?.node?.totalInventory ?? 99;
  
  const incrementQuantity = () => {
    setQuantity(prev => {
      if (prev >= maxQuantity) {
        setQuantityWarning(maxQuantity === 1 ? "Only 1 left in stock!" : `Only ${maxQuantity} available`);
        setTimeout(() => setQuantityWarning(null), 4000);
        return prev;
      }
      setQuantityWarning(null);
      return prev + 1;
    });
  };
  
  const decrementQuantity = () => {
    setQuantityWarning(null);
    setQuantity(prev => Math.max(1, prev - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background page-transition">
        <Navigation />
        <main className="pt-40 pb-20 container mx-auto px-4">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background page-transition">
        <Navigation />
        <main className="pt-40 pb-20 container mx-auto px-4 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">This mythic treasure has vanished into the underworld.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const { node } = product;
  const image = node.images.edges[0]?.node;
  const firstVariant = node.variants.edges[0]?.node;
  const price = firstVariant?.price || node.priceRange.minVariantPrice;
  const compareAtPrice = firstVariant?.compareAtPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  // Available ring sizes (17 to 22)
  const availableSizes = Array.from({ length: 6 }, (_, i) => (17 + i).toString());

  // Get the first available variant for the selected size
  const selectedVariant = node.variants.edges[0]?.node;

  // Check if product is available for sale
  const isAvailable = isProductAvailable(product);
  
  // Check stock levels for badges
  const totalInventory = node.totalInventory ?? 0;
  const isSoldOut = !isAvailable;
  const isAlmostSoldOut = !isSoldOut && totalInventory > 0 && totalInventory <= 5;

  // Helper to check if a size is available (all sizes available if product has any available variant)
  const isSizeAvailable = (size: string) => {
    return isAvailable;
  };

  return (
    <div className="min-h-screen bg-background page-transition">
      {product && (
        <SEO
          title={node.title}
          description={node.description}
          image={image?.url}
          url={window.location.href}
          type="product"
        />
      )}
      <Navigation />

      <main className="pt-40 pb-20 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery with Zoom */}
          <div className="space-y-4">
            <div
              className="aspect-square bg-muted rounded-lg overflow-hidden relative cursor-zoom-in group"
              onClick={() => setIsZoomOpen(true)}
            >
              {node.images.edges[selectedImageIndex]?.node && (
                <>
                  <ProgressiveImage
                    src={node.images.edges[selectedImageIndex].node.url}
                    alt={node.images.edges[selectedImageIndex].node.altText || node.title}
                    containerClassName="w-full h-full"
                    lazy={false}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-3">
                      <ZoomIn className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {node.images.edges.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {node.images.edges.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${index === selectedImageIndex
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-transparent hover:border-primary/50'
                      }`}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText || `${node.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl font-heading font-bold">{node.title}</h1>
              <div className="flex items-center gap-2">
                <WishlistButton product={product} variant="icon" />
                <SocialShareButtons
                  title={node.title}
                  description={node.description}
                  imageUrl={image?.url}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <p className="text-3xl font-bold text-primary">
                EGP {parseFloat(price.amount).toFixed(0)}
              </p>
              {isOnSale && compareAtPrice && (
                <p className="text-xl text-muted-foreground line-through">
                  EGP {parseFloat(compareAtPrice.amount).toFixed(0)}
                </p>
              )}
              {isOnSale && (
                <span className="px-2 py-1 bg-destructive text-destructive-foreground text-sm font-semibold rounded">
                  SALE
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              {node.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Label className="text-base font-semibold">
                  Ring Size
                </Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      How to choose your size?
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ring Size Guide</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <img
                        src={sizeChartImage}
                        alt="Ring Size Chart"
                        className="w-full h-auto"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size: string) => {
                    const sizeAvailable = isSizeAvailable(size);
                    return (
                      <div key={size} className="flex items-center">
                        <RadioGroupItem
                          value={size}
                          id={`size-${size}`}
                          className="peer sr-only"
                          disabled={!sizeAvailable}
                        />
                        <Label
                          htmlFor={`size-${size}`}
                          className={`flex items-center justify-center px-4 py-2 border-2 rounded-md transition-all min-w-[60px] ${sizeAvailable
                            ? 'border-border cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary'
                            : 'border-muted bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50 line-through'
                            }`}
                        >
                          {size}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <Label className="text-base font-semibold mb-3 block">Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold min-w-[40px] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Stock warning */}
              {quantityWarning && (
                <div className="mt-3">
                  <StockWarning message={quantityWarning} type="warning" />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3" ref={addToCartRef}>
              <Button
                onClick={handleAddToCart}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={!selectedVariant || !isAvailable || isAddingToCart}
              >
                {isAddingToCart ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>

              <Button
                onClick={handleBuyNow}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold w-full sm:w-auto"
                disabled={!selectedVariant || !isAvailable || isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {!isAvailable ? 'Out of Stock' : 'Buy Now'}
                  </>
                )}
              </Button>
            </div>
            
            {/* Stock Badge */}
            {isSoldOut ? (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-muted/80 text-muted-foreground rounded-lg text-sm font-medium border border-border">
                <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                Sold Out
              </div>
            ) : totalInventory === 1 ? (
              <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-destructive/90 to-destructive text-destructive-foreground rounded-lg text-base font-semibold shadow-lg shadow-destructive/25 border border-destructive/50">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive-foreground opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive-foreground"></span>
                </span>
                <Flame className="h-5 w-5 animate-pulse" />
                <span>Only 1 Left — Order Now!</span>
              </div>
            ) : isAlmostSoldOut && (
              <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-600/90 to-orange-600 text-white rounded-lg text-base font-semibold shadow-lg shadow-orange-600/25 border border-orange-500/50">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <Flame className="h-5 w-5" />
                <span>Hurry! Only {totalInventory} Left in Stock</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20">
          <RelatedProducts currentProductId={node.id} />
        </div>

        {/* Recently Viewed Section */}
        <div className="mt-20">
          <RecentlyViewed currentProductHandle={handle} maxItems={4} />
        </div>

        {/* Reviews Section */}
        <div className="mt-20">
          <ReviewsList productHandle={handle || ""} />
        </div>
      </main>

      {/* Image Zoom Modal */}
      <ImageZoom
        images={node.images.edges.map(e => e.node)}
        initialIndex={selectedImageIndex}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />

      <Footer />
      {product && (
        <StickyAddToCart
          product={product}
          onAddToCart={handleAddToCart}
          isCheckingOut={isCheckingOut}
          isVisible={isStickyVisible}
        />
      )}
    </div>
  );
};

export default ProductDetail;
