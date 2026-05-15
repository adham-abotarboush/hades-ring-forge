import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Award, Users } from "lucide-react";
import { RealmDoor } from "@/components/RealmDoor";
import heroImage from "@/assets/hero-forge.jpg";
import { SEO } from "@/components/SEO";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { GreekDivider } from "@/components/GreekOrnaments";
import { fetchCollectionByHandle, ShopifyProduct } from "@/lib/shopify";
import { useProductTierMap, TierHandle, tierRank } from "@/hooks/useProductTierMap";

const HADES = "hsl(0 75% 55%)";
const PERSEPHONE = "hsl(130 55% 55%)";

const SHOWCASE_COUNT = 8;

type ShowcaseItem = { product: ShopifyProduct; realm: "hades" | "persephone" };

// Build the merged showcase: rank each source list by tier and availability,
// then interleave so the grid reads as one curated wall.
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

        <div className="relative z-10 container mx-auto max-w-[100vw] px-3 py-24 sm:px-4 sm:py-28 md:py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex max-w-[min(100%,22rem)] flex-wrap items-center justify-center gap-2 mt-10 mb-6 px-4 py-2.5 sm:max-w-none sm:mt-16 sm:mb-8 sm:gap-2 sm:px-6 sm:py-3 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full animate-fade-in shadow-lg">
              <Sparkles className="h-4 w-4 shrink-0 text-primary animate-pulse" />
              <p className="text-left text-[11px] font-semibold uppercase leading-snug tracking-wide text-primary sm:text-center sm:text-sm sm:tracking-wider">
                Handcrafted with ancient techniques
              </p>
            </div>

            <h1 className="text-[clamp(2.35rem,10.5vw,4.5rem)] sm:text-6xl md:text-7xl lg:text-9xl font-heading font-bold mb-6 sm:mb-8 leading-[0.95] animate-fade-in-up tracking-tighter px-1">
              Hades <span className="text-gradient bg-clip-text text-transparent">Underworld</span>
            </h1>

            <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-foreground/90 font-light mb-8 sm:mb-12 animate-fade-in-delay-1 tracking-wide max-w-4xl mx-auto leading-relaxed px-2">
              You Had To Eat The Pomegranate
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 animate-fade-in-delay-2 mb-12 sm:mb-16 px-2">
              <Link to="/collections" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="w-full text-base px-8 py-6 h-auto sm:w-auto sm:text-lg sm:px-10 sm:py-7 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Sparkles className="h-5 w-5 shrink-0" />
                    Explore Collections
                    <ArrowRight className="h-5 w-5 shrink-0 motion-safe:md:group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid max-w-md grid-cols-1 gap-6 mx-auto animate-fade-in-delay-2 sm:max-w-3xl sm:grid-cols-3 sm:gap-8">
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
      <section className="py-16 sm:py-24 md:py-28 container mx-auto max-w-[100vw] px-3 sm:px-4 relative">
        {/* Twin radial atmosphere — red on the left, green on the right, blending in the middle */}
        <div
          className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 15% 30%, ${HADES}55, transparent 55%), radial-gradient(ellipse at 85% 70%, ${PERSEPHONE}55, transparent 55%)`,
          }}
        />

        <div className="relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex max-w-[min(100%,20rem)] flex-wrap items-center justify-center gap-2 mb-4 px-3 py-2 sm:max-w-none sm:mb-5 sm:gap-3 sm:px-5 sm:py-2 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full shadow-lg">
              <span className="shrink-0" style={{ color: HADES }}>🔥</span>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary sm:text-xs sm:tracking-[0.35em]">One Forge · Two Myths</span>
              <span className="shrink-0" style={{ color: PERSEPHONE }}>🌿</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 sm:mb-5 tracking-tighter leading-none px-1">
              Today at <span className="text-gradient bg-clip-text text-transparent">the Forge</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed px-2">
              Pieces from <span style={{ color: HADES }}>Hades</span> and{" "}
              <span style={{ color: PERSEPHONE }}>Persephone</span> — the forge’s most considered work rises to the front first.
            </p>
            <div className="max-w-sm mx-auto mt-7 text-muted-foreground/60">
              <GreekDivider color="hsl(45 90% 60%)" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-14">
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
      <section className="relative py-16 sm:py-24 md:py-32 container mx-auto max-w-[100vw] px-3 sm:px-4">
        <div className="absolute inset-0 bg-gradient-forge opacity-30 blur-3xl" />

        <div className="relative z-10">
          <div className="text-center mb-12 sm:mb-20 px-1">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-heading font-bold mb-5 sm:mb-8 tracking-tighter leading-none">
              Mythic <span className="text-gradient bg-clip-text text-transparent">Craftsmanship</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Each ring is forged with care and inspired by ancient Greek legends
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 lg:gap-14">
            <div className="group text-center p-6 sm:p-10 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/60 hover:bg-card/50 transition-all duration-500 hover-lift hover:shadow-gold">
              <div className="text-5xl sm:text-7xl mb-6 sm:mb-8 group-hover:scale-125 transition-transform duration-500">♻️</div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4 sm:mb-5 group-hover:text-primary transition-colors">Sustainable</h3>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">Crafted with care and environmental consciousness, giving new life to materials</p>
            </div>

            <div className="group text-center p-6 sm:p-10 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/60 hover:bg-card/50 transition-all duration-500 hover-lift hover:shadow-gold">
              <div className="text-5xl sm:text-7xl mb-6 sm:mb-8 group-hover:scale-125 transition-transform duration-500">⚒️</div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4 sm:mb-5 group-hover:text-primary transition-colors">Handmade</h3>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">Each piece individually forged by skilled artisans using traditional techniques</p>
            </div>

            <div className="group text-center p-6 sm:p-10 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/60 hover:bg-card/50 transition-all duration-500 hover-lift hover:shadow-gold">
              <div className="text-5xl sm:text-7xl mb-6 sm:mb-8 group-hover:scale-125 transition-transform duration-500">🏛️</div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4 sm:mb-5 group-hover:text-primary transition-colors">Mythic Design</h3>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">Inspired by the timeless tales and symbols of ancient Greek mythology</p>
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
