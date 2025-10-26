import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import artisan1 from "@/assets/team/artisan-1.jpg";
import artisan2 from "@/assets/team/artisan-2.jpg";
import artisan3 from "@/assets/team/artisan-3.jpg";
import artisan4 from "@/assets/team/artisan-4.jpg";

const teamMembers = [
  {
    name: "Thalia Ironhart",
    role: "Master Metalsmith",
    image: artisan1,
    description: "Thalia brings ancient forging techniques to life, specializing in intricate engravings that tell mythological stories.",
  },
  {
    name: "Leonidas Forge",
    role: "Lead Craftsman",
    image: artisan2,
    description: "With decades of experience, Leonidas ensures each ring meets our exacting standards of quality and artistry.",
  },
  {
    name: "Helena Mythos",
    role: "Design Director",
    image: artisan3,
    description: "Helena translates ancient Greek legends into wearable art, creating designs that honor the past while embracing modern aesthetics.",
  },
  {
    name: "Demetrius Stone",
    role: "Master Artisan",
    image: artisan4,
    description: "Demetrius oversees our sustainable practices, ensuring every fork finds new purpose as a timeless piece of jewelry.",
  },
];

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

          <div className="mb-20 bg-card border border-border rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-heading font-bold mb-6 text-center">The Forge</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
              In the depths of our workshop—our own underworld forge—we breathe new life into 
              forgotten forks and spoons. Using traditional metalworking techniques passed down 
              through generations, we craft rings that honor the ancient Greek pantheon. Every 
              curve, every engraving, every detail is carefully considered to bring you a piece 
              of mythology you can wear.
            </p>
          </div>

          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Meet the Artisans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team of master craftspeople combines ancient techniques with modern sustainability practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4 border border-border group-hover:border-primary/50 transition-colors">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
