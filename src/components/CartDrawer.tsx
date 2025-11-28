import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PhoneNumberModal } from "./PhoneNumberModal";
import { orderDataSchema } from "@/lib/validation";
import { Link } from "react-router-dom";

export const CartDrawer = () => {
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const { 
    items, 
    isLoading,
    isCartOpen,
    setCartOpen,
    updateQuantity, 
    removeItem, 
    createCheckout,
    clearCart,
  } = useCartStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  const handleCheckout = async () => {
    try {
      // Validate inventory before proceeding
      const { validateCartInventory } = useCartStore.getState();
      const isValid = await validateCartInventory();
      
      if (!isValid) {
        return; // Validation already shows error toast
      }

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if user has phone number
        const { data: profile } = await supabase
          .from("profiles")
          .select("phone_number")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!profile?.phone_number) {
          setShowPhoneModal(true);
          return;
        }
      }

      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      
      if (checkoutUrl) {
        // Save order to database for logged-in users
        if (user) {
          const currencyCode = items[0]?.price.currencyCode || 'USD';
          
          // Validate and sanitize order data
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
        
        window.open(checkoutUrl, '_blank');
        setCartOpen(false);
        
        // Clear cart after successful checkout (both logged-in and guest users)
        clearCart();
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error("Failed to create checkout. Please try again.");
    }
  };

  return (
    <>
      <PhoneNumberModal 
        isOpen={showPhoneModal} 
        onOpenChange={setShowPhoneModal}
        onSuccess={handleCheckout}
      />
      <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-primary/30 hover:bg-primary/10">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-card">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-heading">Your Cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-3 bg-muted/30 rounded-lg">
                      <div className="w-16 h-16 bg-background rounded-md overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product.node.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.selectedOptions.map(option => option.value).join(' • ')}
                        </p>
                        <p className="font-semibold text-primary">
                          E£{parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-shrink-0 space-y-4 pt-4 border-t border-border bg-card">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    E£{totalPrice.toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                  size="lg"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Checkout...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Checkout
                    </>
                  )}
                </Button>
                
                <Link to="/cart" onClick={() => setCartOpen(false)}>
                  <Button variant="outline" className="w-full">
                    View Full Cart
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
    </>
  );
};
