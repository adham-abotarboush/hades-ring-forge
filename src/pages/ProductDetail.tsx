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

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts(100);
        const found = products.find(p => p.node.handle === handle);
        setProduct(found || null);
        
        // Set default size to first variant
        if (found && found.node.variants.edges.length > 0) {
          const firstVariant = found.node.variants.edges[0].node;
          if (firstVariant.selectedOptions.length > 0) {
            setSelectedSize(firstVariant.selectedOptions[0].value);
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
              ${parseFloat(price.amount).toFixed(2)}
            </p>
            
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              {node.description}
            </p>
            
            {/* Size Selector */}
            {node.options.length > 0 && node.options[0].values.length > 1 && 
             node.options[0].values.filter(v => v !== "Default Title").length > 0 && (
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  Size
                </Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="flex flex-wrap gap-3">
                    {node.options[0].values.filter(v => v !== "Default Title").map((size) => (
                      <div key={size} className="flex items-center">
                        <RadioGroupItem
                          value={size}
                          id={`size-${size}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`size-${size}`}
                          className="flex items-center justify-center px-4 py-2 border-2 border-border rounded-md cursor-pointer transition-all hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary min-w-[60px]"
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
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
            
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold w-full md:w-auto"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
