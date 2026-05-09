import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-forge.jpg";
import { SEO } from "@/components/SEO";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { GreekDivider } from "@/components/GreekOrnaments";
import { fetchCollectionByHandle, ShopifyProduct } from "@/lib/shopify";
import { useProductTierMap, TierHandle, tierRank } from "@/hooks/useProductTierMap";

const HADES = "hsl(0 75% 55%)";
const PERSEPHONE = "hsl(130 55% 55%)";

const SHOWCASE_COUNT = 8;

type Realm = "hades" | "persephone";
type ShowcaseItem = { product: ShopifyProduct; realm: Realm };

// Build the merged showcase: rank each realm by tier (Premium → Pro → Basic,
// in-stock first), then interleave the two realms so Premium pairs with
// Premium, Pro with Pro, and so on. The result is a single grid that reads
// as one curated showcase, not two separate collections.
function buildShowcase(
  hades: ShopifyProduct[],
  persephone: ShopifyProduct[],
  tierMap: Map<string, TierHandle>,
  total: number,
): ShowcaseItem[] {
  const sortByTierThenStock = (a: ShopifyProduct, b: ShopifyProduct) => {
    const aRank = tierRank(tierMap.get(a.node.id));
    const bRank = tierRank(tierMap.get(b.node.id));
    if (aRank !== bRank) return aRank - bRank;
    const aOk = a.node.variants.edges.some((v) => v.node.availableForSale);
    const bOk = b.node.variants.edges.some((v) => v.node.availableForSale);
    if (aOk && !bOk) return -1;
    if (!aOk && bOk) return 1;
    return 0;
  };

  const sortedHades = [...hades].sort(sortByTierThenStock);
  const sortedPersephone = [...persephone].sort(sortByTierThenStock);

  const items: ShowcaseItem[] = [];
  const max = Math.max(sortedHades.length, sortedPersephone.length);
  for (let i = 0; i < max && items.length < total; i++) {
    if (i < sortedHades.length) items.push({ product: sortedHades[i], realm: "hades" });
    if (items.length >= total) break;
    if (i < sortedPersephone.length) items.push({ product: sortedPersephone[i], realm: "persephone" });
  }
  return items;
}

function useRealmCollection(handle: string) {
  return useQuery({
    queryKey: ["realm-collection", handle],
    queryFn: () => fetchCollectionByHandle(handle, 50),
    staleTime: 1000 * 60 * 10,
  });
}

const Index = () => {
  const tierMap = useProductTierMap();
  const { data: hadesCollection, isLoading: hadesLoading } = useRealmCollection("hades");
  const { data: persephoneCollection, isLoading: persephoneLoading } = useRealmCollection("persephone");
  const showcaseLoading = hadesLoading || persephoneLoading;

  const showcase = useMemo(
    () =>
      buildShowcase(
        hadesCollection?.node.products.edges ?? [],
        persephoneCollection?.node.products.edges ?? [],
        tierMap,
        SHOWCASE_COUNT,
      ),
    [hadesCollection, persephoneCollection, tierMap],
  );

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
                    Explore Rings
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

      {/* Unified Showcase — both realms in one grid */}
      <section className="py-28 container mx-auto px-4 relative">
        {/* Twin radial atmosphere — red on the left, green on the right, blending in the middle */}
        <div
          className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 15% 30%, ${HADES}55, transparent 55%), radial-gradient(ellipse at 85% 70%, ${PERSEPHONE}55, transparent 55%)`,
          }}
        />

        <div className="relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-5 px-5 py-2 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full shadow-lg">
              <span style={{ color: HADES }}>🔥</span>
              <span className="text-xs font-bold tracking-[0.35em] uppercase text-primary">One Forge · Two Myths</span>
              <span style={{ color: PERSEPHONE }}>🌿</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-5 tracking-tighter leading-none">
              Today at <span className="text-gradient bg-clip-text text-transparent">the Forge</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Pieces from <span style={{ color: HADES }}>Hades</span> and <span style={{ color: PERSEPHONE }}>Persephone</span>, ordered by their place in the forge — Premium, Pro, then Basic.
            </p>
            <div className="max-w-sm mx-auto mt-7 text-muted-foreground/60">
              <GreekDivider color="hsl(45 90% 60%)" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-14">
            {showcaseLoading
              ? Array.from({ length: SHOWCASE_COUNT }).map((_, i) => <ProductCardSkeleton key={i} />)
              : showcase.map(({ product, realm }, index) => (
                  <div
                    key={product.node.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <ProductCard product={product} tier={tierMap.get(product.node.id)} realm={realm} />
                  </div>
                ))}
          </div>

          {/* Realm doors — slim, side by side, replace the old huge cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <RealmDoor
              to="/collections/hades"
              color={HADES}
              icon="🔥"
              eyebrow="The Underworld"
              label="Enter Hades"
            />
            <RealmDoor
              to="/collections/persephone"
              color={PERSEPHONE}
              icon="🌿"
              eyebrow="Queen of Spring"
              label="Walk Persephone"
            />
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

const RealmDoor = ({
  to,
  color,
  icon,
  eyebrow,
  label,
}: {
  to: string;
  color: string;
  icon: string;
  eyebrow: string;
  label: string;
}) => (
  <Link to={to} className="group block">
    <div
      className="relative rounded-xl overflow-hidden border transition-all duration-300 hover-lift flex items-center gap-4 p-5"
      style={{ borderColor: `${color}33` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}99`;
        e.currentTarget.style.boxShadow = `0 12px 40px -12px ${color}55`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}33`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: `linear-gradient(135deg, transparent, ${color}22)` }}
      />
      <div className="relative z-10 flex items-center gap-4 w-full">
        <span
          className="text-3xl drop-shadow-[0_0_8px_currentColor]"
          style={{ color }}
        >
          {icon}
        </span>
        <div className="flex-1">
          <p
            className="text-[10px] font-bold tracking-[0.35em] uppercase mb-0.5"
            style={{ color, opacity: 0.85 }}
          >
            {eyebrow}
          </p>
          <p className="text-base md:text-lg font-heading font-semibold tracking-tight">{label}</p>
        </div>
        <ArrowRight
          className="h-5 w-5 group-hover:translate-x-1 transition-transform"
          style={{ color }}
        />
      </div>
    </div>
  </Link>
);

export default Index;
