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
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* === HERO SECTION === */}
      <section className="relative flex items-center justify-center min-h-[90vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-28 text-center md:text-left md:grid md:grid-cols-2 md:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full shadow backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-primary uppercase tracking-wider">
                Handcrafted with Ancient Techniques
              </p>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight tracking-tighter">
              Hades{" "}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Underworld
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
              You had to eat the pomegranate — now embrace your fate in style.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/shop">
                <Button
                  variant="hero"
                  size="lg"
                  className="text-lg px-8 py-6 rounded-xl group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Explore Collection
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right-side visual accent */}
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="absolute -inset-8 bg-primary/30 blur-3xl rounded-full opacity-50" />
              <img
                src={heroImage}
                alt="Forged Ring"
                className="rounded-3xl shadow-2xl border border-border/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === TRUST ICONS === */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { icon: Shield, label: "100% Authentic" },
            { icon: Award, label: "Master Crafted" },
            { icon: Users, label: "5K+ Happy Owners" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="group">
              <Icon className="mx-auto h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === BEST SELLERS === */}
      <section className="py-28 container mx-auto px-4 text-center relative">
        <div className="absolute inset-0 bg-gradient-forge opacity-10 blur-2xl" />
        <div className="relative z-10">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Flame className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold uppercase text-primary tracking-wider">
                Most Forged
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4 tracking-tighter">
              Legendary{" "}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Bestsellers
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The most sought-after rings from the depths of the Underworld.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[420px] bg-card/30 animate-pulse rounded-2xl backdrop-blur-sm"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                {featuredProducts.map((product, index) => (
                  <div
                    key={product.node.id}
                    className="animate-fade-in-up hover-lift"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <Link to="/shop">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary text-lg px-8 py-6 h-auto"
                >
                  View All Rings
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* === FEATURES === */}
      <section className="py-28 container mx-auto px-4 relative">
        <div className="absolute inset-0 bg-gradient-forge opacity-20 blur-3xl" />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-10 tracking-tighter">
            Mythic{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Craftsmanship
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-20">
            Each ring is forged with care, inspired by ancient Greek legends.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: "♻️",
                title: "Sustainable",
                desc: "Forged from recycled metals — honoring both past and planet.",
              },
              {
                icon: "⚒️",
                title: "Handmade",
                desc: "Each piece individually shaped by master artisans using time-honored methods.",
              },
              {
                icon: "🏛️",
                title: "Mythic Design",
                desc: "Inspired by the enduring tales of Greek gods and heroes.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group p-10 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/60 hover:shadow-lg transition-all duration-500 hover:bg-card/50"
              >
                <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">
                  {icon}
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;