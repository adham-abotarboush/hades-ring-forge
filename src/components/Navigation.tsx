import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, User, LogOut, UserCircle, Heart, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/CartDrawer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { SearchDialog } from "@/components/SearchDialog";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { useCartStore } from "@/stores/cartStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { items, createCheckout, clearCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuickCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Open window immediately for Safari compatibility
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
      newWindow.document.write('<html><head><title>Redirecting to checkout...</title></head><body style="background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><p>Preparing your checkout...</p></body></html>');
    }

    setIsCheckingOut(true);
    try {
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl && newWindow) {
        newWindow.location.href = checkoutUrl;
        // Cart will be cleared via webhook when order is completed
        toast.success("Redirecting to checkout...");
      } else if (newWindow) {
        newWindow.close();
        toast.error("Failed to create checkout");
      }
    } catch (error) {
      console.error('Quick checkout failed:', error);
      if (newWindow) newWindow.close();
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBanner />
        <nav className="bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-elevated">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="/favicon.svg" alt="Hades Logo" className="h-8 w-8 group-hover:scale-110 transition-transform" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gradient group-hover:scale-105 transition-transform">
              HADES
            </h1>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary relative group ${location.pathname === link.path
                  ? "text-primary"
                  : "text-foreground/80"
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <SearchDialog />
            <Link to="/wishlist" className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <CartDrawer />
              {/* Fast Checkout Button */}
              {totalItems > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className="hidden lg:flex items-center gap-1.5 h-9 px-3 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={handleQuickCheckout}
                        disabled={isCheckingOut}
                        aria-label="Fast Checkout"
                      >
                        {isCheckingOut ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4" />
                            <span className="text-xs font-medium">Checkout</span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fast Checkout ({totalItems} items)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden lg:flex" aria-label="User Menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="text-xs opacity-70">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="hidden lg:block">
                <Button variant="ghost" size="sm" aria-label="Sign In">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Open Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 bg-gradient-underworld backdrop-blur-xl border-l border-primary/20">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link, index) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl font-heading font-bold transition-all duration-300 hover:text-primary hover:translate-x-2 animate-fade-in-up ${location.pathname === link.path
                        ? "text-primary"
                        : "text-foreground/80"
                        }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="pt-4 border-t border-border">
                    <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start mb-2">
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </Button>
                    </Link>
                    {user ? (
                      <>
                        <p className="text-xs text-muted-foreground mb-2 px-2">{user.email}</p>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            navigate("/profile");
                            setIsOpen(false);
                          }}
                        >
                          <UserCircle className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
          </div>
        </nav>
      </div>
    </>
  );
};
