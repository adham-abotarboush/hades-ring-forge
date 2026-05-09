import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-forge.jpg";
import { SEO } from "@/components/SEO";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { GreekMeander, GreekDivider } from "@/components/GreekOrnaments";

const HADES = "hsl(0 75% 55%)";
const PERSEPHONE = "hsl(130 55% 55%)";

const Index = () => {
  return (
    <div className="min-h-screen bg-background page-transition">
      <SEO
        title="Hades Ring Forge"
        description="Handcrafted rings inspired by Greek mythology and the realm of Hades. Each piece tells an ancient story."
      />
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
            <div className="inline-flex items-center gap-2 mt-16 mb-8 px-6 py-3 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full animate-fade-in shadow-lg">
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
                <p className="text-sm font-medium text-muted-foreground">200+ Happy Owners</p>
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

      {/* Collections Showcase */}
      <section className="py-32 container mx-auto px-4 relative">
        <div className="absolute inset-0 opacity-15 blur-3xl" style={{ background: "linear-gradient(135deg, hsl(38 90% 12%) 0%, hsl(330 80% 8%) 100%)" }} />

        <div className="relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full shadow-lg">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-bold tracking-widest uppercase text-primary">The Two Realms</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-heading font-bold mb-6 tracking-tighter leading-none">
              Choose Your <span className="text-gradient bg-clip-text text-transparent">Myth</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Two collections. Two destinies. Both forged from the same ancient legend.
            </p>
          </div>

          <div className="max-w-md mx-auto mb-12 text-muted-foreground/60">
            <GreekDivider color="hsl(45 90% 60%)" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Hades — Red */}
            <Link to="/collections/hades" className="group block">
              <div
                className="relative rounded-2xl overflow-hidden border transition-all duration-500 hover-lift min-h-[380px] flex flex-col"
                style={{ borderColor: `${HADES}33` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${HADES}99`;
                  e.currentTarget.style.boxShadow = `0 20px 60px -15px ${HADES}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${HADES}33`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-[hsl(0_60%_8%)]" />
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at bottom left, ${HADES}33, transparent 65%)` }}
                />
                <div className="absolute top-0 left-0 right-0">
                  <GreekMeander color={HADES} height={12} opacity={0.55} />
                </div>
                <div className="relative z-10 p-8 md:p-10 pt-12 flex flex-col justify-between h-full">
                  <div>
                    <div className="text-6xl mb-4 drop-shadow-[0_0_15px_hsl(0_75%_55%_/_0.5)]">🔥</div>
                    <p
                      className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
                      style={{ color: HADES, opacity: 0.85 }}
                    >
                      The Underworld
                    </p>
                    <h3
                      className="text-4xl md:text-5xl font-heading font-bold mb-3 tracking-tighter transition-colors duration-300"
                      style={{ textShadow: `0 0 30px ${HADES}55` }}
                    >
                      Hades
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Forged in ember and shadow — rings that carry the weight of eternity beneath Olympus.
                    </p>
                  </div>
                  <div
                    className="mt-8 flex items-center gap-2 font-medium group-hover:gap-3 transition-all duration-300"
                    style={{ color: HADES }}
                  >
                    <span>Enter the Underworld</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Persephone — Green */}
            <Link to="/collections/persephone" className="group block">
              <div
                className="relative rounded-2xl overflow-hidden border transition-all duration-500 hover-lift min-h-[380px] flex flex-col"
                style={{ borderColor: `${PERSEPHONE}33` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${PERSEPHONE}99`;
                  e.currentTarget.style.boxShadow = `0 20px 60px -15px ${PERSEPHONE}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${PERSEPHONE}33`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-[hsl(140_50%_8%)]" />
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at bottom right, ${PERSEPHONE}33, transparent 65%)` }}
                />
                <div className="absolute top-0 left-0 right-0">
                  <GreekMeander color={PERSEPHONE} height={12} opacity={0.55} />
                </div>
                <div className="relative z-10 p-8 md:p-10 pt-12 flex flex-col justify-between h-full">
                  <div>
                    <div className="text-6xl mb-4 drop-shadow-[0_0_15px_hsl(130_55%_55%_/_0.5)]">🌿</div>
                    <p
                      className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
                      style={{ color: PERSEPHONE, opacity: 0.85 }}
                    >
                      Queen of Spring
                    </p>
                    <h3
                      className="text-4xl md:text-5xl font-heading font-bold mb-3 tracking-tighter transition-colors duration-300"
                      style={{ textShadow: `0 0 30px ${PERSEPHONE}55` }}
                    >
                      Persephone
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Where verdant bloom meets eternal shadow — rings born of spring's defiance.
                    </p>
                  </div>
                  <div
                    className="mt-8 flex items-center gap-2 font-medium group-hover:gap-3 transition-all duration-300"
                    style={{ color: PERSEPHONE }}
                  >
                    <span>Walk the Verdant Path</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link to="/collections">
              <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary group text-lg px-8 py-6 h-auto">
                View All Collections
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
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
              <p className="text-muted-foreground leading-relaxed text-lg">Crafted with care and environmental consciousness, giving new life to materials</p>
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

      {/* Testimonials */}
      <TestimonialCarousel />

      <Footer />
    </div>
  );
};

export default Index;
