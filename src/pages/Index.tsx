import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-forge.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 animate-fade-in">
            Forged in the <span className="text-primary">Underworld</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Handcrafted rings from recycled forks, inspired by the myths and legends of Hades
          </p>
          <Link to="/shop">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold">
              Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Mythic Craftsmanship
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each ring is a unique piece of wearable mythology, forged with care and inspired by ancient Greek legends.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl font-heading text-primary mb-4">♻️</div>
            <h3 className="text-xl font-heading font-semibold mb-2">Sustainable</h3>
            <p className="text-muted-foreground">Crafted from recycled forks, giving new life to old metal</p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-4xl font-heading text-primary mb-4">⚒️</div>
            <h3 className="text-xl font-heading font-semibold mb-2">Handmade</h3>
            <p className="text-muted-foreground">Each piece individually forged by skilled artisans</p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-4xl font-heading text-primary mb-4">🏛️</div>
            <h3 className="text-xl font-heading font-semibold mb-2">Mythic Design</h3>
            <p className="text-muted-foreground">Inspired by the timeless tales of Greek mythology</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
