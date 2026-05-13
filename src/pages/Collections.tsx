import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { SEO } from "@/components/SEO";
import { RealmDoor } from "@/components/RealmDoor";
import { cn } from "@/lib/utils";
import { fetchCollectionByHandle, ShopifyProduct } from "@/lib/shopify";
import { useProductTierMap, TierHandle, tierRank } from "@/hooks/useProductTierMap";

const HADES = "hsl(0 75% 55%)";
const PERSEPHONE = "hsl(130 55% 55%)";
const SAMPLES = 4;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const REALM_META = {
  hades: {
    accent: HADES,
    icon: "🔥",
    badge: "The Underworld",
    title: "Hades",
    tagline: "Ember, shadow, and weight — pieces that read as command and permanence.",
    path: "/collections/hades",
    cta: "Open Hades vault",
    chipLabel: "Hades",
  },
  persephone: {
    accent: PERSEPHONE,
    icon: "🌿",
    badge: "Queen of Spring",
    title: "Persephone",
    tagline: "Growth, return, and light — the forge’s brighter mythic line.",
    path: "/collections/persephone",
    cta: "Open Persephone vault",
    chipLabel: "Persephone",
  },
} as const;

function sortProductsByTierThenStock(products: ShopifyProduct[], tierMap: Map<string, TierHandle>) {
  return [...products].sort((a, b) => {
    const aRank = tierRank(tierMap.get(a.node.id));
    const bRank = tierRank(tierMap.get(b.node.id));
    if (aRank !== bRank) return aRank - bRank;
    const aOk = a.node.variants.edges.some((v) => v.node.availableForSale);
    const bOk = b.node.variants.edges.some((v) => v.node.availableForSale);
    if (aOk && !bOk) return -1;
    if (!aOk && bOk) return 1;
    return 0;
  });
}

function useRealmCollection(handle: string) {
  return useQuery({
    queryKey: ["collections-page", handle],
    queryFn: () => fetchCollectionByHandle(handle, 50),
    staleTime: 1000 * 60 * 10,
  });
}

type RealmKey = keyof typeof REALM_META;

function RealmCollectionPanel({
  realm,
  collection,
  sample,
  loading,
  tierMap,
}: {
  realm: RealmKey;
  collection: { node: { products: { edges: ShopifyProduct[] } } } | undefined;
  sample: ShopifyProduct[];
  loading: boolean;
  tierMap: Map<string, TierHandle>;
}) {
  const meta = REALM_META[realm];
  const total = collection?.node.products.edges.length ?? 0;

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card/40 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg",
      )}
      style={{
        borderColor: `${meta.accent}40`,
        boxShadow: `inset 0 1px 0 0 ${meta.accent}18`,
      }}
    >
      {/* Clip only decorations — avoids horizontal scroll + card shadow clipping */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${meta.accent}, ${meta.accent}88, transparent)`,
          }}
        />
        <div
          className="absolute -right-16 top-0 h-48 w-48 rounded-full opacity-[0.1] blur-3xl sm:-right-12 sm:h-56 sm:w-56"
          style={{ background: meta.accent }}
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col p-4 sm:p-6 md:p-7">
        <div className="mb-5 flex min-w-0 flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
          <div className="flex min-w-0 gap-3 sm:gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-inner sm:h-14 sm:w-14 sm:text-2xl md:h-16 md:w-16 md:text-3xl"
              style={{
                background: `linear-gradient(145deg, ${meta.accent}35, ${meta.accent}12)`,
                boxShadow: `0 0 0 1px ${meta.accent}44`,
              }}
            >
              {meta.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.35em] sm:text-xs"
                style={{ color: meta.accent }}
              >
                {meta.badge}
              </p>
              <h2
                className="mt-0.5 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
                style={{ color: meta.accent }}
              >
                {meta.title}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {meta.tagline}
              </p>
              {!loading && total > 0 && (
                <p className="mt-2 text-xs font-medium text-muted-foreground/90">
                  {total} {total === 1 ? "piece" : "pieces"} in this vault
                  {sample.length < total ? ` · showing ${sample.length}` : ""}
                </p>
              )}
            </div>
          </div>

          <Link
            to={meta.path}
            className={cn(
              focusRing,
              "inline-flex h-10 shrink-0 items-center justify-center gap-1.5 self-start rounded-md border-2 bg-background/90 px-4 text-sm font-semibold transition-colors active:opacity-90 sm:self-auto",
            )}
            style={{ borderColor: `${meta.accent}66`, color: meta.accent }}
          >
            View all
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:gap-5">
          {loading
            ? Array.from({ length: SAMPLES }).map((_, i) => <ProductCardSkeleton key={`${realm}-${i}`} />)
            : sample.length === 0
              ? (
                  <p className="col-span-full py-8 text-center text-sm text-muted-foreground sm:py-10">
                    No pieces in this vault yet.
                  </p>
                )
              : (
                  sample.map((product, index) => (
                    <div
                      key={product.node.id}
                      className="animate-fade-in-up min-w-0"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} tier={tierMap.get(product.node.id)} realm={realm} compact />
                    </div>
                  ))
                )}
        </div>

        <div className="mt-5 border-t border-border/60 pt-5 sm:mt-6 sm:pt-6">
          <Link
            to={meta.path}
            className={cn(
              focusRing,
              "flex min-h-12 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold shadow-md transition-[opacity,transform] active:scale-[0.99] sm:min-h-11 sm:text-base",
            )}
            style={{
              background: `linear-gradient(135deg, ${meta.accent}ee, ${meta.accent})`,
              color: "hsl(0 0% 100%)",
            }}
          >
            {meta.cta}
            <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

const Collections = () => {
  const tierMap = useProductTierMap();
  const { data: hadesCollection, isLoading: hadesLoading } = useRealmCollection("hades");
  const { data: persephoneCollection, isLoading: persephoneLoading } = useRealmCollection("persephone");
  const loading = hadesLoading || persephoneLoading;

  const hadesSample = useMemo(() => {
    const edges = hadesCollection?.node.products.edges ?? [];
    return sortProductsByTierThenStock(edges, tierMap).slice(0, SAMPLES);
  }, [hadesCollection, tierMap]);

  const persephoneSample = useMemo(() => {
    const edges = persephoneCollection?.node.products.edges ?? [];
    return sortProductsByTierThenStock(edges, tierMap).slice(0, SAMPLES);
  }, [persephoneCollection, tierMap]);

  return (
    <div className="min-h-screen bg-background page-transition">
      <SEO
        title="Collections — Hades Ring Forge"
        description="Explore two realms of handcrafted rings. The fire of Hades and the bloom of Persephone, forged in one place."
      />
      <Navigation />

      <main className="relative z-10 mx-auto max-w-7xl px-3 pb-20 pt-28 sm:px-4 md:pb-28">
        <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-10 md:mb-14">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground sm:mb-3 sm:text-xs sm:tracking-[0.4em]">
            Two realms · One forge
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Collections
          </h1>
          <p className="mx-auto mt-2 max-w-xl px-1 text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
            Pick a myth. Each vault is its own line — same craft, different story and palette.
          </p>

          <div className="mx-auto mt-6 flex max-w-lg flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              to={REALM_META.hades.path}
              className={cn(
                focusRing,
                "flex min-h-[52px] flex-1 items-center gap-3 rounded-2xl border-2 bg-background/90 px-4 py-3 text-left shadow-sm transition-shadow sm:min-h-0 sm:px-5 sm:py-4",
                "active:opacity-90 sm:hover:shadow-md",
              )}
              style={{ borderColor: `${HADES}55` }}
            >
              <span className="text-xl sm:text-2xl" aria-hidden>
                {REALM_META.hades.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                  {REALM_META.hades.badge}
                </p>
                <p className="truncate font-heading text-base font-bold sm:text-lg" style={{ color: HADES }}>
                  {REALM_META.hades.chipLabel}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
            <Link
              to={REALM_META.persephone.path}
              className={cn(
                focusRing,
                "flex min-h-[52px] flex-1 items-center gap-3 rounded-2xl border-2 bg-background/90 px-4 py-3 text-left shadow-sm transition-shadow sm:min-h-0 sm:px-5 sm:py-4",
                "active:opacity-90 sm:hover:shadow-md",
              )}
              style={{ borderColor: `${PERSEPHONE}55` }}
            >
              <span className="text-xl sm:text-2xl" aria-hidden>
                {REALM_META.persephone.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
                  {REALM_META.persephone.badge}
                </p>
                <p className="truncate font-heading text-base font-bold sm:text-lg" style={{ color: PERSEPHONE }}>
                  {REALM_META.persephone.chipLabel}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          <RealmCollectionPanel
            realm="hades"
            collection={hadesCollection}
            sample={hadesSample}
            loading={loading}
            tierMap={tierMap}
          />
          <RealmCollectionPanel
            realm="persephone"
            collection={persephoneCollection}
            sample={persephoneSample}
            loading={loading}
            tierMap={tierMap}
          />
        </div>

        <div className="mx-auto mt-10 max-w-3xl sm:mt-14">
          <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:mb-4 sm:text-xs sm:tracking-[0.25em]">
            Or step through a door
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <RealmDoor to="/collections/hades" color={HADES} icon="🔥" eyebrow="The Underworld" label="Enter Hades" />
            <RealmDoor
              to="/collections/persephone"
              color={PERSEPHONE}
              icon="🌿"
              eyebrow="Queen of Spring"
              label="Walk Persephone"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
