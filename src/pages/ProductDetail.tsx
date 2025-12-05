import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Loader2, Plus, Minus, Info, ZoomIn } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
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

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts(100);
        const found = products.find(p => p.node.handle === handle);
        setProduct(found || null);

        // Set default size to first available size (16)
        if (found) {
          setSelectedSize("16");
          // Track as recently viewed
          addProduct(found);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product) return;

    // Use the first variant for cart (size will be stored in selectedOptions)
    const selectedVariant = product.node.variants.edges[0]?.node;

    if (!selectedVariant) return;

    // Check if product is available
    if (product.node.totalInventory <= 0) {
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

    const success = addItem(cartItem, product.node.totalInventory);

    if (success) {
      toast.success(`Added ${quantity} item(s) to cart!`, {
        position: "top-center",
      });
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    const selectedVariant = product.node.variants.edges[0]?.node;

    if (!selectedVariant) return;

    if (product.node.totalInventory <= 0) {
      toast.error("This product is out of stock", {
        position: "top-center",
      });
      return;
    }

    setIsCheckingOut(true);

    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: `Size ${selectedSize}`,
      price: selectedVariant.price,
      quantity: quantity,
      selectedOptions: [{ name: "Ring Size", value: selectedSize }]
    };

    const success = addItem(cartItem, product.node.totalInventory);

    if (!success) {
      setIsCheckingOut(false);
      return;
    }

    try {
      // Validate inventory before checkout
      const isValid = await useCartStore.getState().validateCartInventory();
      if (!isValid) {
        setIsCheckingOut(false);
        return;
      }

      await useCartStore.getState().createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        // Clear cart after successful checkout
        useCartStore.getState().clearCart();
      }
    } catch (error) {
      toast.error("Failed to create checkout", {
        position: "top-center",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-20 container mx-auto px-4">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-20 container mx-auto px-4 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">This mythic treasure has vanished into the underworld.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  // Available ring sizes (16 to 22)
  const availableSizes = Array.from({ length: 7 }, (_, i) => (16 + i).toString());

  // Get the first available variant for the selected size
  const selectedVariant = node.variants.edges[0]?.node;

  // Helper to check if a size is available (all sizes available if product has inventory)
  const isSizeAvailable = (size: string) => {
    return node.totalInventory > 0;
  };

  return (
    <div className="min-h-screen bg-background">
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

      <main className="pt-32 pb-20 container mx-auto px-4">
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
            <p className="text-3xl font-bold text-primary mb-6">
              E£{parseFloat(price.amount).toFixed(2)}
            </p>

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
                    const isAvailable = isSizeAvailable(size);
                    return (
                      <div key={size} className="flex items-center">
                        <RadioGroupItem
                          value={size}
                          id={`size-${size}`}
                          className="peer sr-only"
                          disabled={!isAvailable}
                        />
                        <Label
                          htmlFor={`size-${size}`}
                          className={`flex items-center justify-center px-4 py-2 border-2 rounded-md transition-all min-w-[60px] ${isAvailable
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
              {node.totalInventory <= 5 && node.totalInventory > 0 && (
                <p className="text-sm text-destructive mt-2">
                  Only {node.totalInventory} left in stock
                </p>
              )}
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
            </div>

            <div className="flex flex-col sm:flex-row gap-3" ref={addToCartRef}>
              <Button
                onClick={handleAddToCart}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={!selectedVariant || node.totalInventory <= 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <Button
                onClick={handleBuyNow}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold w-full sm:w-auto"
                disabled={!selectedVariant || node.totalInventory <= 0 || isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {node.totalInventory <= 0 ? 'Out of Stock' : 'Buy Now'}
                  </>
                )}
              </Button>
            </div>
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
