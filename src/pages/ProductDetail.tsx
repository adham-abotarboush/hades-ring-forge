import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts(100);
        const found = products.find(p => p.node.handle === handle);
        setProduct(found || null);
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
    
    const firstVariant = product.node.variants.edges[0]?.node;
    if (!firstVariant) return;

    const cartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart!", {
      position: "top-center",
    });
  };

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
