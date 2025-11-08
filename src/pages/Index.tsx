import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
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
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/60 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full animate-fade-in">
              <p className="text-sm font-medium text-primary">✨ Handcrafted with Ancient Techniques</p>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight animate-fade-in-up tracking-tight">
              Forged in the <span className="text-gradient">Underworld</span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-primary font-medium mb-14 animate-fade-in-delay-1 tracking-wide">
              Where Ancient Myths Become Timeless Treasures
            </p>
            
            <div className="flex justify-center animate-fade-in-delay-2">
              <Link to="/shop">
                <Button variant="hero" size="lg" className="text-xl px-12 py-8 h-auto group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    Explore Collection
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
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
      <section className="py-20 container mx-auto px-4 relative">
        <div className="absolute inset-0 bg-gradient-forge opacity-30 blur-3xl" />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Flame className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold tracking-wider uppercase text-primary">Most Forged</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 tracking-tight">
              Legendary Bestsellers
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              The most sought-after rings from the depths of the Underworld
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-card/50 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProducts.slice(0, 6).map((product) => (
                  <div key={product.node.id} className="animate-fade-in-up">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/shop">
                  <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary group">
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
      <section className="py-20 container mx-auto px-4 relative">
        <div className="absolute inset-0 bg-gradient-forge opacity-50 blur-3xl" />
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 tracking-tight">
              Mythic Craftsmanship
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Each ring is forged with care and inspired by ancient Greek legends
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover-lift">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">♻️</div>
              <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-4 group-hover:text-primary transition-colors">Sustainable</h3>
              <p className="text-muted-foreground leading-relaxed font-light">Crafted from recycled forks, giving new life to old metal with environmental consciousness</p>
            </div>
            
            <div className="group text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover-lift">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">⚒️</div>
              <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-4 group-hover:text-primary transition-colors">Handmade</h3>
              <p className="text-muted-foreground leading-relaxed font-light">Each piece individually forged by skilled artisans using traditional techniques</p>
            </div>
            
            <div className="group text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover-lift">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🏛️</div>
              <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-4 group-hover:text-primary transition-colors">Mythic Design</h3>
              <p className="text-muted-foreground leading-relaxed font-light">Inspired by the timeless tales and symbols of ancient Greek mythology</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
