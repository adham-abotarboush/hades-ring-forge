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
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 leading-tight animate-fade-in-up">
              Forged in the <span className="text-gradient">Underworld</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-primary/90 font-medium mb-8 animate-fade-in-delay-1">
              Where Ancient Myths Become Timeless Treasures
            </p>
            
            <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-1">
              Each ring is a unique piece of wearable mythology, transformed from recycled forks into eternal treasures
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
              <Link to="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold text-lg px-8 py-6 h-auto group">
                  Explore Collection 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary text-lg px-8 py-6 h-auto">
                  Our Story
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

      {/* Featured Section */}
      <section className="py-32 container mx-auto px-4 relative">
        <div className="absolute inset-0 bg-gradient-forge opacity-50 blur-3xl" />
        
        <div className="relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Mythic Craftsmanship
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Each ring is a unique piece of wearable mythology, forged with care and inspired by ancient Greek legends
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover-lift">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">♻️</div>
              <h3 className="text-2xl font-heading font-semibold mb-4 group-hover:text-primary transition-colors">Sustainable</h3>
              <p className="text-muted-foreground leading-relaxed">Crafted from recycled forks, giving new life to old metal with environmental consciousness</p>
            </div>
            
            <div className="group text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover-lift">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">⚒️</div>
              <h3 className="text-2xl font-heading font-semibold mb-4 group-hover:text-primary transition-colors">Handmade</h3>
              <p className="text-muted-foreground leading-relaxed">Each piece individually forged by skilled artisans using traditional techniques</p>
            </div>
            
            <div className="group text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover-lift">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🏛️</div>
              <h3 className="text-2xl font-heading font-semibold mb-4 group-hover:text-primary transition-colors">Mythic Design</h3>
              <p className="text-muted-foreground leading-relaxed">Inspired by the timeless tales and symbols of ancient Greek mythology</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
