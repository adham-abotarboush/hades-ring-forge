import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Our Story
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
              Born from a passion for mythology and sustainable craftsmanship, Hades transforms 
              discarded silverware into mythic treasures. Each ring is a testament to the enduring 
              power of Greek legends and the artistry of handmade jewelry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">The Forge</h2>
              <p className="text-muted-foreground leading-relaxed">
                In the depths of our workshop—our own underworld forge—we breathe new life into 
                forgotten forks and spoons. Using traditional metalworking techniques passed down 
                through generations, we craft rings that honor the ancient Greek pantheon.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">Our Craft</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every curve, every engraving, every detail is carefully considered to bring you 
                a piece of mythology you can wear. Each ring carries the weight of legend, 
                forged with precision and passion by master artisans dedicated to their craft.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">Sustainability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe in giving new purpose to forgotten treasures. By transforming vintage 
                silverware into timeless jewelry, we reduce waste and honor the craftsmanship of 
                generations past while creating heirlooms for generations to come.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">Mythology Meets Modern</h2>
              <p className="text-muted-foreground leading-relaxed">
                Each design draws inspiration from Greek mythology, translating ancient legends 
                into contemporary jewelry. From Hades' helm to Cerberus' watchful gaze, our rings 
                let you carry the power of the gods wherever you go.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
