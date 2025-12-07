import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Flame, Recycle, Sparkles, Heart, Users, Award, ArrowRight, MapPin } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Recycle,
      title: "Sustainable Craft",
      description: "Every ring begins its journey as a forgotten fork, destined for the landfill. We rescue these metal treasures and transform them into wearable art.",
      color: "text-emerald-400",
    },
    {
      icon: Flame,
      title: "Forged by Hand",
      description: "Like the ancient smiths of mythology, each piece is carefully heated, shaped, and polished by hand using traditional techniques passed down through generations.",
      color: "text-primary",
    },
    {
      icon: Sparkles,
      title: "Mythic Design",
      description: "Inspired by the tales of Greek gods and the mysteries of the underworld, our designs carry the weight of legends and the spark of divine creativity.",
      color: "text-amber-300",
    },
    {
      icon: Heart,
      title: "Made with Passion",
      description: "We're not just making jewelry—we're crafting stories. Each ring carries the passion of young artisans dreaming of something greater.",
      color: "text-red-400",
    },
  ];

  const stats = [
    { number: "500+", label: "Rings Forged" },
    { number: "100%", label: "Handcrafted" },
    { number: "5K+", label: "Happy Customers" },
    { number: "0", label: "Waste to Landfill" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-forge opacity-30 blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full animate-fade-in">
                <Flame className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary tracking-wider">OUR STORY</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 animate-fade-in-up tracking-tight">
                From the <span className="text-gradient">Underworld</span> Forge
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 animate-fade-in-delay-1">
                Born in New Cairo, Egypt, Hades is a student-built startup that transforms discarded forks
                into mythic rings. We believe that beauty can rise from the forgotten, and that every object
                deserves a second chance at glory.
              </p>

              <div className="flex items-center justify-center gap-2 text-muted-foreground animate-fade-in-delay-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-lg">New Cairo, Egypt 🇪🇬</span>
              </div>
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="py-20 container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
                  The <span className="text-gradient">Legend</span> Begins
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    In the depths of a kitchen drawer, forgotten forks lay waiting. Like souls in the underworld,
                    they yearned for purpose—for a chance to become something greater than they were.
                  </p>
                  <p>
                    We saw potential where others saw waste. With fire and determination, we began transforming
                    these humble utensils into rings worthy of the gods themselves.
                  </p>
                  <p>
                    Today, each ring we forge carries this origin story—a reminder that even the most ordinary
                    objects can become extraordinary when touched by passion and creativity.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-card via-muted to-card border border-border overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="text-8xl mb-6">⚒️</div>
                      <p className="text-xl font-heading font-semibold text-gradient">
                        Forged with Fire & Purpose
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-card/50 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our craft and define who we are
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group relative p-8 rounded-2xl bg-card/50 border border-border hover:border-primary/50 transition-all duration-500 hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-4 rounded-xl bg-background/50 border border-border mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className={`h-8 w-8 ${value.color}`} />
                </div>

                <h3 className="text-2xl font-heading font-bold mb-4 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </section>

        {/* Youth Entrepreneurship */}
        <section className="py-20 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-secondary/10 border border-secondary/30 rounded-full">
              <Users className="h-4 w-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary tracking-wider">YOUTH ENTREPRENEURSHIP</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 tracking-tight">
              Built by <span className="text-gradient">Students</span>,
              <br />Driven by <span className="text-gradient">Dreams</span>
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed mb-10">
              We're not just a jewelry brand—we're proof that young entrepreneurs can build
              meaningful businesses that make a difference. Every ring you wear supports a vision
              of sustainable creativity and youthful ambition.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold group text-lg px-8 py-6 h-auto">
                  <Award className="h-5 w-5 mr-2" />
                  Support Our Mission
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-6 h-auto">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
