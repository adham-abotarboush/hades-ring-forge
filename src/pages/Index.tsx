import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Sparkles, Shield, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-forge.jpg";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useEffect, useState } from "react";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts(6);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full animate-fade-in shadow-lg">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <p className="text-sm font-semibold text-primary tracking-wider">HANDCRAFTED WITH ANCIENT TECHNIQUES</p>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-9xl font-heading font-bold mb-8 leading-[0.95] animate-fade-in-up tracking-tighter">
              Hades <span className="text-gradient bg-clip-text text-transparent">Underworld</span>
            </h1>
            
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground/90 font-light mb-12 animate-fade-in-delay-1 tracking-wide max-w-4xl mx-auto leading-relaxed">
              You Had To Eat The Pomegranate
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-2 mb-16">
              <Link to="/shop">
                <Button variant="hero" size="lg" className="text-lg px-10 py-7 h-auto group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    Explore Collection
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-delay-2">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">100% Authentic</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Master Crafted</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">5K+ Happy Owners</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-32 container mx-auto px-4 relative">
        <div className="absolute inset-0 bg-gradient-forge opacity-20 blur-3xl" />
        
        <div className="relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full shadow-lg">
              <Flame className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-bold tracking-widest uppercase text-primary">Most Forged</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-heading font-bold mb-8 tracking-tighter leading-none">
              Legendary <span className="text-gradient bg-clip-text text-transparent">Bestsellers</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              The most sought-after rings from the depths of the Underworld
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[450px] bg-card/30 animate-pulse rounded-2xl backdrop-blur-sm" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
                {featuredProducts.slice(0, 6).map((product, index) => (
                  <div 
                    key={product.node.id} 
                    className="animate-fade-in-up hover-lift"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/shop">
                  <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary group text-lg px-8 py-6 h-auto">
                    View All Rings
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 container mx-auto px-4 relative">
        <div className="absolute inset-0 bg-gradient-forge opacity-30 blur-3xl" />
        
        <div className="relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-heading font-bold mb-8 tracking-tighter leading-none">
              Mythic <span className="text-gradient bg-clip-text text-transparent">Craftsmanship</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Each ring is forged with care and inspired by ancient Greek legends
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            <div className="group text-center p-10 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/60 hover:bg-card/50 transition-all duration-500 hover-lift hover:shadow-gold">
              <div className="text-7xl mb-8 group-hover:scale-125 transition-transform duration-500">♻️</div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold mb-5 group-hover:text-primary transition-colors">Sustainable</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">Crafted from recycled forks, giving new life to old metal with environmental consciousness</p>
            </div>
            
            <div className="group text-center p-10 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/60 hover:bg-card/50 transition-all duration-500 hover-lift hover:shadow-gold">
              <div className="text-7xl mb-8 group-hover:scale-125 transition-transform duration-500">⚒️</div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold mb-5 group-hover:text-primary transition-colors">Handmade</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">Each piece individually forged by skilled artisans using traditional techniques</p>
            </div>
            
            <div className="group text-center p-10 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/60 hover:bg-card/50 transition-all duration-500 hover-lift hover:shadow-gold">
              <div className="text-7xl mb-8 group-hover:scale-125 transition-transform duration-500">🏛️</div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold mb-5 group-hover:text-primary transition-colors">Mythic Design</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">Inspired by the timeless tales and symbols of ancient Greek mythology</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
