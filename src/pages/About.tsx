import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Hammer, Sparkles, Leaf, Zap } from "lucide-react";
import artisan1 from "@/assets/team/artisan-1.jpg";
import artisan2 from "@/assets/team/artisan-2.jpg";
import artisan3 from "@/assets/team/artisan-3.jpg";
import artisan4 from "@/assets/team/artisan-4.jpg";
import heroForge from "@/assets/hero-forge.jpg";

const About = () => {
  const [activeTab, setActiveTab] = useState<"story" | "craft" | "team">("story");

  const artisans = [
    { name: "Marcus Forge", role: "Master Smith", image: artisan1 },
    { name: "Helena Craft", role: "Design Lead", image: artisan2 },
    { name: "Damon Steel", role: "Senior Artisan", image: artisan3 },
    { name: "Iris Myth", role: "Mythology Curator", image: artisan4 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-forge opacity-30 blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <p className="text-sm font-medium text-primary">🏛️ Est. in the Depths of Time</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
              From Forgotten to <span className="text-gradient">Legendary</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Where ancient mythology meets modern craftsmanship, and discarded silverware becomes eternal treasure
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Rings Forged</div>
            </div>
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Recycled Metal</div>
            </div>
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-2">9</div>
              <div className="text-sm text-muted-foreground">Mythic Designs</div>
            </div>
            <div className="text-center p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover-lift">
              <div className="text-3xl font-heading font-bold text-primary mb-2">4</div>
              <div className="text-sm text-muted-foreground">Master Artisans</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => setActiveTab("story")}
            className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === "story"
                ? "bg-primary text-primary-foreground shadow-gold"
                : "bg-card border border-border hover:border-primary/50"
            }`}
          >
            Our Story
          </button>
          <button
            onClick={() => setActiveTab("craft")}
            className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === "craft"
                ? "bg-primary text-primary-foreground shadow-gold"
                : "bg-card border border-border hover:border-primary/50"
            }`}
          >
            The Craft
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === "team"
                ? "bg-primary text-primary-foreground shadow-gold"
                : "bg-card border border-border hover:border-primary/50"
            }`}
          >
            Our Team
          </button>
        </div>
      </section>

      {/* Tab Content */}
      <section className="container mx-auto px-4 pb-20">
        {activeTab === "story" && (
          <div className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 md:order-1">
                <h2 className="text-4xl font-heading font-bold mb-6">The Birth of a Legend</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  In a workshop hidden from the world, where ancient tools meet modern passion, Hades was born. 
                  What started as a single artisan's quest to preserve forgotten silverware has grown into a movement 
                  that celebrates mythology, sustainability, and timeless craftsmanship.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Each piece we create tells two stories: the tale of its mythological inspiration and the journey 
                  of the metal itself—from a dining table to the fires of our forge, emerging reborn as wearable legend.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <Leaf className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Sustainable</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <Hammer className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Handcrafted</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Mythic</span>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative rounded-2xl overflow-hidden shadow-gold-lg hover-lift">
                  <img src={heroForge} alt="Forge workshop" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "craft" && (
          <div className="animate-fade-in grid md:grid-cols-2 gap-8">
            <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Hammer className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">The Forge Process</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In the depths of our workshop—our own underworld forge—we breathe new life into 
                forgotten forks and spoons. Using traditional metalworking techniques passed down 
                through generations, we craft rings that honor the ancient Greek pantheon.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Hand-selected vintage silverware</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Traditional forging techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Meticulous hand-engraving</span>
                </li>
              </ul>
            </div>

            <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Artisan Expertise</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every curve, every engraving, every detail is carefully considered to bring you 
                a piece of mythology you can wear. Each ring carries the weight of legend, 
                forged with precision and passion by master artisans dedicated to their craft.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Years of metalworking experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Deep mythology knowledge</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Commitment to excellence</span>
                </li>
              </ul>
            </div>

            <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Sustainability</h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe in giving new purpose to forgotten treasures. By transforming vintage 
                silverware into timeless jewelry, we reduce waste and honor the craftsmanship of 
                generations past while creating heirlooms for generations to come.
              </p>
            </div>

            <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Mythology Meets Modern</h3>
              <p className="text-muted-foreground leading-relaxed">
                Each design draws inspiration from Greek mythology, translating ancient legends 
                into contemporary jewelry. From Hades' helm to Cerberus' watchful gaze, our rings 
                let you carry the power of the gods wherever you go.
              </p>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold mb-4">Meet the Artisans</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The master craftspeople who breathe life into metal and myth
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {artisans.map((artisan, index) => (
                <div 
                  key={artisan.name}
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                    <img 
                      src={artisan.image} 
                      alt={artisan.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <h3 className="text-xl font-heading font-bold text-white mb-1">{artisan.name}</h3>
                      <p className="text-primary text-sm font-medium">{artisan.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default About;
