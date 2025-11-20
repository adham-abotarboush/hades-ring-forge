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
              About Us
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
              Hades is a student-built startup based in New Cairo, Egypt, creating handcrafted rings made from recycled forks.
              Our mission is to turn everyday objects into meaningful, artistic accessories with personality and story.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">Sustainability & Recycling</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe in giving new purpose to forgotten treasures. By transforming recycled 
                forks into timeless jewelry, we reduce waste while creating meaningful accessories 
                that tell a story.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">Creativity & Craftsmanship</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every ring is carefully shaped, polished, and crafted by hand. Each piece is a work 
                of art that blends ancient mythology with modern design, creating accessories with 
                personality and character.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">Youth Entrepreneurship</h2>
              <p className="text-muted-foreground leading-relaxed">
                As a student-built startup, we're passionate about proving that young entrepreneurs 
                can create meaningful businesses. We're turning our creative vision into reality, 
                one handcrafted ring at a time.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">Quality & Accessibility</h2>
              <p className="text-muted-foreground leading-relaxed">
                We're committed to offering high-quality handmade jewelry at accessible prices. 
                Every piece is crafted with care, ensuring you receive a unique accessory that 
                combines artistry with affordability.
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
