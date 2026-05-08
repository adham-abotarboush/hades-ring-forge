import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { SEO } from "@/components/SEO";

const Collections = () => {
  return (
    <div className="min-h-screen bg-background page-transition">
      <SEO
        title="Collections — Hades Ring Forge"
        description="Explore two realms of handcrafted rings. The dark power of Hades and the blooming grace of Persephone, forged in one place."
      />
      <Navigation />

      <main className="pt-40 pb-20 container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full shadow-lg">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <p className="text-sm font-semibold text-primary tracking-wider">HANDCRAFTED COLLECTIONS</p>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-heading font-bold mb-6 tracking-tighter leading-none">
            Two Realms,{" "}
            <span className="text-gradient bg-clip-text text-transparent">One Forge</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Choose your myth. Each collection carries a distinct soul — the iron will of the Underworld's lord, or the blooming grace of its queen.
          </p>
        </div>

        {/* Collection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

          {/* Hades Collection Card */}
          <Link to="/collections/hades" className="group block">
            <div className="relative rounded-3xl overflow-hidden border border-primary/20 hover:border-primary/60 transition-all duration-500 hover-lift hover:shadow-[0_20px_60px_-15px_hsl(38_90%_55%_/_0.4)] min-h-[520px] flex flex-col">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-[hsl(38_90%_8%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38_90%_20%_/_0.3),transparent_60%)]" />

              {/* Decorative Greek border top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-14">
                <div>
                  <div className="text-6xl mb-6">⚡</div>
                  <div className="inline-block mb-4 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full">
                    <span className="text-xs font-bold tracking-widest uppercase text-primary">The Underworld</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-heading font-bold mb-5 tracking-tighter leading-none text-foreground group-hover:text-primary transition-colors duration-300">
                    Hades
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                    Forged in shadow and flame. Rings that carry the weight of eternity — dark, commanding, unyielding as the lord of the dead himself.
                  </p>
                </div>

                <div className="mt-10">
                  <div className="flex flex-wrap gap-3 mb-8">
                    {["Obsidian Dark", "Gold Accents", "Power & Dominion"].map((tag) => (
                      <span key={tag} className="px-3 py-1 text-xs font-medium bg-primary/10 border border-primary/20 rounded-full text-primary/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary group/btn text-base px-8 py-5 h-auto transition-all duration-300"
                  >
                    Enter the Underworld
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>

          {/* Persephone Collection Card */}
          <Link to="/collections/persephone" className="group block">
            <div
              className="relative rounded-3xl overflow-hidden border border-[hsl(330_80%_60%_/_0.2)] hover:border-[hsl(330_80%_60%_/_0.6)] transition-all duration-500 hover-lift min-h-[520px] flex flex-col"
              style={{ "--hover-shadow": "0 20px 60px -15px hsl(330 80% 60% / 0.4)" } as React.CSSProperties}
            >
              {/* Use inline style for hover shadow since CSS var can't be used in Tailwind class */}
              <style>{`.persephone-card:hover { box-shadow: 0 20px 60px -15px hsl(330 80% 60% / 0.4); }`}</style>

              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-[hsl(330_80%_6%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(330_80%_18%_/_0.3),transparent_60%)]" />

              {/* Decorative Greek border top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(330_80%_60%)] to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-14">
                <div>
                  <div className="text-6xl mb-6">🌸</div>
                  <div className="inline-block mb-4 px-4 py-1.5 bg-[hsl(330_80%_60%_/_0.15)] border border-[hsl(330_80%_60%_/_0.3)] rounded-full">
                    <span className="text-xs font-bold tracking-widest uppercase text-[hsl(330_80%_70%)]">Queen of the Underworld</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-heading font-bold mb-5 tracking-tighter leading-none text-foreground group-hover:text-[hsl(330_80%_70%)] transition-colors duration-300">
                    Persephone
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                    Where blossoms meet darkness. Rings born of spring's defiance — delicate yet eternal, as radiant as the pomegranate's crimson seeds.
                  </p>
                </div>

                <div className="mt-10">
                  <div className="flex flex-wrap gap-3 mb-8">
                    {["Pomegranate Rose", "Floral Motifs", "Grace & Mystery"].map((tag) => (
                      <span key={tag} className="px-3 py-1 text-xs font-medium bg-[hsl(330_80%_60%_/_0.1)] border border-[hsl(330_80%_60%_/_0.2)] rounded-full text-[hsl(330_80%_70%_/_0.8)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="border-[hsl(330_80%_60%_/_0.5)] text-foreground hover:bg-[hsl(330_80%_60%)] hover:text-white hover:border-[hsl(330_80%_60%)] group/btn text-base px-8 py-5 h-auto transition-all duration-300"
                  >
                    Bloom in the Darkness
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Myth quote */}
        <div className="text-center mt-20 animate-fade-in-up">
          <div className="max-w-2xl mx-auto px-8 py-6 border border-border/40 rounded-2xl bg-card/20 backdrop-blur-sm">
            <p className="text-muted-foreground italic font-light text-lg leading-relaxed">
              "She had eaten the pomegranate seeds — and in doing so, became both spring and shadow, forever bound to two worlds."
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
