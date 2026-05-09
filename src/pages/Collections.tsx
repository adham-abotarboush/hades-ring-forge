import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { SEO } from "@/components/SEO";
import { GreekMeander, GreekDivider } from "@/components/GreekOrnaments";

const HADES = "hsl(0 75% 55%)";
const PERSEPHONE = "hsl(130 55% 55%)";

const Collections = () => {
  return (
    <div className="min-h-screen bg-background page-transition">
      <SEO
        title="Collections — Hades Ring Forge"
        description="Explore two realms of handcrafted rings. The fire of Hades and the bloom of Persephone, forged in one place."
      />
      <Navigation />

      <main className="pt-40 pb-20 container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full shadow-lg">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <p className="text-sm font-semibold text-primary tracking-[0.3em]">HANDCRAFTED COLLECTIONS</p>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-heading font-bold mb-6 tracking-tighter leading-none">
            Two Realms,{" "}
            <span className="text-gradient bg-clip-text text-transparent">One Forge</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Choose your myth. Each realm carries a distinct soul — the fire of the Underworld's lord, or the verdant grace of its queen.
          </p>
          <div className="max-w-md mx-auto mt-10 text-muted-foreground/70">
            <GreekDivider color="hsl(45 90% 60%)" />
          </div>
        </div>

        {/* Realm Cards — Hades (red) & Persephone (green) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Hades — Red */}
          <Link to="/collections/hades" className="group block">
            <div
              className="relative rounded-3xl overflow-hidden border transition-all duration-500 hover-lift min-h-[560px] flex flex-col"
              style={{
                borderColor: `${HADES}33`,
                boxShadow: `0 0 0 transparent`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${HADES}99`;
                e.currentTarget.style.boxShadow = `0 25px 70px -15px ${HADES}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${HADES}33`;
                e.currentTarget.style.boxShadow = `0 0 0 transparent`;
              }}
            >
              {/* Layered Hades atmosphere */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-[hsl(0_60%_8%)]" />
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at top right, ${HADES}40, transparent 60%)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: `radial-gradient(circle at 20% 100%, hsl(15 80% 30% / 0.4), transparent 50%)`,
                }}
              />

              {/* Greek meander top border */}
              <div className="absolute top-0 left-0 right-0">
                <GreekMeander color={HADES} height={14} opacity={0.6} />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-14 pt-16">
                <div>
                  <div className="text-7xl mb-6 drop-shadow-[0_0_20px_hsl(0_75%_55%_/_0.5)]">🔥</div>
                  <div
                    className="inline-block mb-5 px-4 py-1.5 rounded-full border backdrop-blur-sm"
                    style={{
                      backgroundColor: `${HADES}22`,
                      borderColor: `${HADES}55`,
                    }}
                  >
                    <span
                      className="text-xs font-bold tracking-[0.35em] uppercase"
                      style={{ color: HADES }}
                    >
                      The Underworld
                    </span>
                  </div>
                  <h2
                    className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 tracking-tighter leading-none transition-colors duration-300"
                    style={{ textShadow: `0 0 40px ${HADES}55` }}
                  >
                    Hades
                  </h2>
                  <p
                    className="text-sm md:text-base font-medium mb-5 tracking-[0.4em] uppercase"
                    style={{ color: HADES, opacity: 0.85 }}
                  >
                    Lord of the Underworld
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                    Forged in ember and shadow. Rings that carry the weight of eternity — commanding, dark, and unyielding as the lord of the dead himself.
                  </p>
                </div>

                <div className="mt-10">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Crimson Ember", "Obsidian Forge", "Power & Dominion"].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full border"
                        style={{
                          backgroundColor: `${HADES}1A`,
                          borderColor: `${HADES}40`,
                          color: HADES,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="border-2 text-foreground group/btn text-base px-8 py-5 h-auto transition-all duration-300"
                    style={{
                      borderColor: `${HADES}80`,
                    }}
                  >
                    Enter the Underworld
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>

          {/* Persephone — Green */}
          <Link to="/collections/persephone" className="group block">
            <div
              className="relative rounded-3xl overflow-hidden border transition-all duration-500 hover-lift min-h-[560px] flex flex-col"
              style={{
                borderColor: `${PERSEPHONE}33`,
                boxShadow: `0 0 0 transparent`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${PERSEPHONE}99`;
                e.currentTarget.style.boxShadow = `0 25px 70px -15px ${PERSEPHONE}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${PERSEPHONE}33`;
                e.currentTarget.style.boxShadow = `0 0 0 transparent`;
              }}
            >
              {/* Layered Persephone atmosphere */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-[hsl(140_50%_8%)]" />
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at top right, ${PERSEPHONE}40, transparent 60%)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: `radial-gradient(circle at 80% 100%, hsl(110 50% 25% / 0.4), transparent 55%)`,
                }}
              />

              {/* Greek meander top border */}
              <div className="absolute top-0 left-0 right-0">
                <GreekMeander color={PERSEPHONE} height={14} opacity={0.6} />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-14 pt-16">
                <div>
                  <div className="text-7xl mb-6 drop-shadow-[0_0_20px_hsl(130_55%_55%_/_0.5)]">🌿</div>
                  <div
                    className="inline-block mb-5 px-4 py-1.5 rounded-full border backdrop-blur-sm"
                    style={{
                      backgroundColor: `${PERSEPHONE}22`,
                      borderColor: `${PERSEPHONE}55`,
                    }}
                  >
                    <span
                      className="text-xs font-bold tracking-[0.35em] uppercase"
                      style={{ color: PERSEPHONE }}
                    >
                      Queen of Spring
                    </span>
                  </div>
                  <h2
                    className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 tracking-tighter leading-none transition-colors duration-300"
                    style={{ textShadow: `0 0 40px ${PERSEPHONE}55` }}
                  >
                    Persephone
                  </h2>
                  <p
                    className="text-sm md:text-base font-medium mb-5 tracking-[0.4em] uppercase"
                    style={{ color: PERSEPHONE, opacity: 0.85 }}
                  >
                    Bloom in the Darkness
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                    Where blossoms meet shadow. Rings born of spring's defiance — delicate yet eternal, as radiant as the pomegranate's verdant seeds.
                  </p>
                </div>

                <div className="mt-10">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Verdant Bloom", "Olive Laurel", "Grace & Mystery"].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full border"
                        style={{
                          backgroundColor: `${PERSEPHONE}1A`,
                          borderColor: `${PERSEPHONE}40`,
                          color: PERSEPHONE,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="border-2 text-foreground group/btn text-base px-8 py-5 h-auto transition-all duration-300"
                    style={{
                      borderColor: `${PERSEPHONE}80`,
                    }}
                  >
                    Walk the Verdant Path
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Shop by Tier */}
        <div className="mt-32 animate-fade-in-up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full shadow-lg">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <p className="text-sm font-semibold text-primary tracking-[0.3em]">SHOP BY TIER</p>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 tracking-tighter leading-none">
              Choose Your <span className="text-gradient bg-clip-text text-transparent">Caliber</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              From approachable everyday pieces to singular hero rings — find the level that fits your story.
            </p>
            <div className="max-w-sm mx-auto mt-8 text-muted-foreground/60">
              <GreekDivider color="hsl(45 90% 60%)" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Premium Tier — placed first as the hero tier */}
            <TierCard
              to="/collections/premium-tier"
              color="hsl(45 90% 60%)"
              accentBg="hsl(45 70% 10%)"
              icon="👑"
              eyebrow="Hero Pieces"
              title="Premium Tier"
              description="One-of-one statement rings — singular, named, the crown of the forge."
              cta="Explore Premium"
            />

            {/* Pro Tier */}
            <TierCard
              to="/collections/pro-tier"
              color="hsl(170 60% 55%)"
              accentBg="hsl(170 50% 8%)"
              icon="⚜️"
              eyebrow="Mid-Tier"
              title="Pro Tier"
              description="Refined detail and deeper finishes — for those who walk between realms."
              cta="Explore Pro"
            />

            {/* Basic Tier */}
            <TierCard
              to="/collections/basic-tier"
              color="hsl(210 25% 75%)"
              accentBg="hsl(210 20% 10%)"
              icon="🔱"
              eyebrow="Entry"
              title="Basic Tier"
              description="Approachable everyday pieces — the same forge, lighter on the wallet."
              cta="Explore Basic"
            />
          </div>
        </div>

        {/* Myth quote */}
        <div className="text-center mt-24 animate-fade-in-up">
          <div className="max-w-2xl mx-auto px-8 py-8 border border-border/40 rounded-2xl bg-card/20 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 text-primary/30">
              <GreekMeander color="hsl(45 90% 60%)" height={12} opacity={0.4} />
            </div>
            <p className="text-muted-foreground italic font-light text-lg leading-relaxed pt-4">
              "She had eaten the pomegranate seeds — and in doing so, became both spring and shadow, forever bound to two worlds."
            </p>
            <div className="absolute bottom-0 left-0 right-0 rotate-180 text-primary/30">
              <GreekMeander color="hsl(45 90% 60%)" height={12} opacity={0.4} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const TierCard = ({
  to,
  color,
  accentBg,
  icon,
  eyebrow,
  title,
  description,
  cta,
}: {
  to: string;
  color: string;
  accentBg: string;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
}) => (
  <Link to={to} className="group block">
    <div
      className="relative h-full rounded-2xl overflow-hidden border transition-all duration-500 hover-lift min-h-[340px] flex flex-col"
      style={{ borderColor: `${color}33` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}99`;
        e.currentTarget.style.boxShadow = `0 20px 50px -15px ${color}55`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}33`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, hsl(var(--background)), hsl(var(--card)), ${accentBg})` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at top right, ${color}26, transparent 60%)` }}
      />
      <div className="absolute top-0 left-0 right-0">
        <GreekMeander color={color} height={12} opacity={0.5} />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full p-8 pt-12">
        <div>
          <div className="text-5xl mb-4">{icon}</div>
          <div
            className="inline-block mb-3 px-3 py-1 rounded-full border"
            style={{
              backgroundColor: `${color}1A`,
              borderColor: `${color}55`,
            }}
          >
            <span
              className="text-xs font-bold tracking-[0.35em] uppercase"
              style={{ color }}
            >
              {eyebrow}
            </span>
          </div>
          <h3
            className="text-3xl md:text-4xl font-heading font-bold mb-3 tracking-tighter transition-colors"
            style={{ color }}
          >
            {title}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <div
          className="mt-6 flex items-center gap-2 font-medium group-hover:gap-3 transition-all duration-300 text-sm"
          style={{ color }}
        >
          <span>{cta}</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </Link>
);

export default Collections;
