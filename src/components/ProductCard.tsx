import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const { node } = product;

  const handleAddToCart = () => {
    const firstVariant = node.variants.edges[0]?.node;
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

  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  return (
    <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
      <Link to={`/product/${node.handle}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image && (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/product/${node.handle}`}>
          <h3 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
            {node.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {node.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ${parseFloat(price.amount).toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
