import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, Loader2, Plus, Minus } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ReviewsList } from "@/components/reviews/ReviewsList";

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts(100);
        const found = products.find(p => p.node.handle === handle);
        setProduct(found || null);
        
        // Set default size to first AVAILABLE variant
        if (found && found.node.variants.edges.length > 0) {
          const firstAvailableVariant = found.node.variants.edges.find(
            v => v.node.availableForSale
          )?.node || found.node.variants.edges[0].node;
          
          if (firstAvailableVariant.selectedOptions.length > 0) {
            setSelectedSize(firstAvailableVariant.selectedOptions[0].value);
          }
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
    
    // Find the variant matching the selected size
    const selectedVariant = product.node.variants.edges.find(
      v => v.node.selectedOptions.some(opt => opt.value === selectedSize)
    )?.node || product.node.variants.edges[0]?.node;
    
    if (!selectedVariant) return;

    // Check if variant is available
    if (!selectedVariant.availableForSale) {
      toast.error("This size is out of stock", {
        position: "top-center",
      });
      return;
    }

    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success(`Added ${quantity} item(s) to cart!`, {
      position: "top-center",
    });
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    const selectedVariant = product.node.variants.edges.find(
      v => v.node.selectedOptions.some(opt => opt.value === selectedSize)
    )?.node || product.node.variants.edges[0]?.node;
    
    if (!selectedVariant) return;

    if (!selectedVariant.availableForSale) {
      toast.error("This size is out of stock", {
        position: "top-center",
      });
      return;
    }

    setIsCheckingOut(true);
    
    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    
    try {
      await useCartStore.getState().createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
  
  // Get current selected variant
  const selectedVariant = node.variants.edges.find(
    v => v.node.selectedOptions.some(opt => opt.value === selectedSize)
  )?.node;
  
  // Helper to check if a size is available
  const isSizeAvailable = (size: string) => {
    const variant = node.variants.edges.find(
      v => v.node.selectedOptions.some(opt => opt.value === size)
    )?.node;
    return variant ? variant.availableForSale : false;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-20 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {image && (
              <img
                src={image.url}
                alt={image.altText || node.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-heading font-bold mb-4">{node.title}</h1>
            <p className="text-3xl font-bold text-primary mb-6">
              E£{parseFloat(price.amount).toFixed(2)}
            </p>
            
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              {node.description}
            </p>
            
            {/* Size Selector */}
            {node.options.length > 0 && node.options[0].values.length > 1 && (
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  {node.options[0].name}
                </Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="flex flex-wrap gap-3">
                    {node.options[0].values.map((size) => {
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
                            className={`flex items-center justify-center px-4 py-2 border-2 rounded-md transition-all min-w-[60px] ${
                              isAvailable
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
            )}
            
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
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={!selectedVariant || !selectedVariant.availableForSale}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold w-full sm:w-auto"
                disabled={!selectedVariant || !selectedVariant.availableForSale || isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {selectedVariant && !selectedVariant.availableForSale ? 'Out of Stock' : 'Buy Now'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20">
          <ReviewsList productHandle={handle || ""} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
