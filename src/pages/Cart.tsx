import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PhoneNumberModal } from "@/components/PhoneNumberModal";
import { orderDataSchema } from "@/lib/validation";
import { Link } from "react-router-dom";
import { StockWarning } from "@/components/cart/StockWarning";

const Cart = () => {
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [itemWarnings, setItemWarnings] = useState<Record<string, { message: string; type: 'error' | 'warning' }>>({})
  const { 
    items, 
    isLoading,
    updateQuantity, 
    removeItem, 
    createCheckout,
    clearCart,
    validateAndUpdateQuantity,
  } = useCartStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  const handleQuantityChange = async (variantId: string, newQuantity: number) => {
    if (updatingItems.has(variantId)) return;
    
    // Clear any previous warning for this item
    setItemWarnings(prev => {
      const next = { ...prev };
      delete next[variantId];
      return next;
    });
    
    setUpdatingItems(prev => new Set(prev).add(variantId));
    try {
      const result = await validateAndUpdateQuantity(variantId, newQuantity);
      
      if (result.message && result.type) {
        setItemWarnings(prev => ({
          ...prev,
          [variantId]: { message: result.message!, type: result.type! }
        }));
        
        // Auto-clear warning after 4 seconds
        setTimeout(() => {
          setItemWarnings(prev => {
            const next = { ...prev };
            delete next[variantId];
            return next;
          });
        }, 4000);
      }
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
    }
  };

  const handleCheckout = async () => {
    // Open window IMMEDIATELY (synchronously) - Safari/iOS allows this
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Loading Checkout...</title></head>
          <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;background:#1a1a1a;color:#fff;">
            <div style="text-align:center;">
              <h2>Preparing your checkout...</h2>
              <p>Please wait</p>
            </div>
          </body>
        </html>
      `);
    }

    try {
      // Validate inventory before proceeding
      const { validateCartInventory } = useCartStore.getState();
      const isValid = await validateCartInventory();
      
      if (!isValid) {
        newWindow?.close();
        return; // Validation already shows error toast
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("phone_number")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!profile?.phone_number) {
          newWindow?.close();
          setShowPhoneModal(true);
          return;
        }
      }

      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      
      if (checkoutUrl) {
        if (user) {
          const currencyCode = items[0]?.price.currencyCode || 'USD';
          
          const validatedOrderData = orderDataSchema.parse({
            items: items.map(item => ({
              productId: item.product.node.id,
              variantId: item.variantId,
              title: item.product.node.title,
              quantity: item.quantity,
              price: parseFloat(item.price.amount),
              options: item.selectedOptions
            })),
            total: totalPrice,
            currency: currencyCode
          });
          
          await supabase.from("orders").insert([{
            user_id: user.id,
            checkout_url: checkoutUrl,
            total_amount: totalPrice,
            currency_code: currencyCode,
            status: 'pending',
            order_data: validatedOrderData,
          }]);
        }
        
        // Redirect the already-open window to checkout URL
        if (newWindow) {
          newWindow.location.href = checkoutUrl;
        }
        
        // Cart will be cleared via webhook when order is completed
      } else {
        newWindow?.close();
        toast.error("Failed to create checkout");
      }
    } catch (error) {
      newWindow?.close();
      console.error('Checkout failed:', error);
      toast.error("Failed to create checkout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PhoneNumberModal 
        isOpen={showPhoneModal} 
        onOpenChange={setShowPhoneModal}
        onSuccess={handleCheckout}
      />
      
      <main className="pt-40 pb-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/shop">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-4xl font-heading font-bold">Shopping Cart</h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-heading font-bold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Add some mythic treasures to your collection</p>
              <Link to="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 p-4 bg-card border border-border rounded-lg">
                    <Link 
                      to={`/product/${item.product.node.handle}`}
                      className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0"
                    >
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img
                          src={item.product.node.images.edges[0].node.url}
                          alt={item.product.node.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      )}
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.node.handle}`}>
                        <h3 className="font-heading font-semibold text-lg mb-1 hover:text-primary transition-colors">
                          {item.product.node.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.selectedOptions.map(option => option.value).join(' • ')}
                      </p>
                      <p className="font-bold text-primary text-lg">
                        <span className="text-sm font-medium opacity-70 mr-0.5">EGP</span>
                        {parseFloat(item.price.amount).toFixed(0)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          removeItem(item.variantId);
                          toast.success("Item removed from cart");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)}
                          disabled={updatingItems.has(item.variantId)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {updatingItems.has(item.variantId) ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)}
                          disabled={updatingItems.has(item.variantId)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-2">
                        Subtotal: <span className="text-xs">EGP</span> {(parseFloat(item.price.amount) * item.quantity).toFixed(0)}
                      </p>
                      
                      {/* Inline stock warning */}
                      {itemWarnings[item.variantId] && (
                        <StockWarning
                          message={itemWarnings[item.variantId].message}
                          type={itemWarnings[item.variantId].type}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-32">
                  <h2 className="text-2xl font-heading font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Items ({totalItems})</span>
                      <span><span className="text-xs">EGP</span> {totalPrice.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-heading font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          <span className="text-base font-medium opacity-70 mr-1">EGP</span>
                          {totalPrice.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold" 
                    size="lg"
                    disabled={items.length === 0 || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>
                  
                  <Link to="/shop" className="block mt-4">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
