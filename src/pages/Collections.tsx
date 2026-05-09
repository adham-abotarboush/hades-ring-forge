import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import {
  GreekMeander,
  GreekDivider,
  MarbleBackground,
} from "@/components/GreekOrnaments";
import { useCollectionInsights, RealmInsight, TierInsight } from "@/hooks/useCollectionInsights";

const GOLD = "hsl(45 90% 60%)";
const SILVER = "hsl(210 15% 78%)";
const BRONZE = "hsl(28 55% 55%)";
const HADES = "hsl(0 75% 55%)";
const PERSEPHONE = "hsl(130 55% 55%)";

const Collections = () => {
  const { realms, tiers, isLoading } = useCollectionInsights();

  return (
    <div className="min-h-screen bg-background page-transition">
      <SEO
        title="Collections — Hades Ring Forge"
        description="Two realms, three tiers, one forge. Browse handcrafted Greek-mythology rings cast in marble, gold, and shadow."
      />
      <Navigation />

      <main className="relative pt-32 pb-24">
        <MarbleBackground className="opacity-90" />

        {/* Hero */}
        <section className="relative container mx-auto px-4 mb-20">
          <div className="text-center animate-fade-in-up">
            <div
              className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full border backdrop-blur-sm shadow-lg"
              style={{ borderColor: `${GOLD}55`, backgroundColor: `${GOLD}14` }}
            >
              <span style={{ color: GOLD }}>✦</span>
              <p
                className="text-[11px] font-bold tracking-[0.4em] uppercase"
                style={{ color: GOLD }}
              >
                The Pantheon of the Forge
              </p>
              <span style={{ color: GOLD }}>✦</span>
            </div>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-5 tracking-tighter leading-none"
              style={{
                background: `linear-gradient(180deg, hsl(0 0% 96%) 0%, ${GOLD} 55%, hsl(35 85% 45%) 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: `0 0 60px ${GOLD}33`,
              }}
            >
              Two Realms · Three Tiers
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto font-light leading-relaxed">
              Carved between shadow and bloom, every ring belongs to one realm and one tier.
              Choose your path through the marble.
            </p>

            <div className="max-w-md mx-auto mt-8 text-muted-foreground/60">
              <GreekMeander color={GOLD} height={14} opacity={0.55} />
            </div>
          </div>
        </section>

        {/* Realms — Hades / Persephone */}
        <section className="relative container mx-auto px-4 mb-20">
          <SectionLabel
            eyebrow="By Realm"
            title="The Two Myths"
            tagline="Each realm walks its own path through the forge."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <RealmTablet
              to="/collections/hades"
              color={HADES}
              accentBg="hsl(0 60% 8%)"
              icon="🔥"
              eyebrow="The Underworld"
              name="Hades"
              motto="Lord of Shadow"
              tagline="Forged in ember and obsidian — rings carrying the weight of eternity."
              insight={realms.hades}
              loading={isLoading}
            />
            <RealmTablet
              to="/collections/persephone"
              color={PERSEPHONE}
              accentBg="hsl(140 50% 8%)"
              icon="🌿"
              eyebrow="Queen of Spring"
              name="Persephone"
              motto="Bloom in Darkness"
              tagline="Born of pomegranate seed and verdant light — defiant grace, eternal."
              insight={realms.persephone}
              loading={isLoading}
            />
          </div>
        </section>

        {/* Greek key divider */}
        <div className="relative container mx-auto px-4 mb-20">
          <div className="max-w-3xl mx-auto" style={{ color: GOLD }}>
            <GreekDivider color={GOLD} />
          </div>
        </div>

        {/* Tiers — Premium / Pro / Basic */}
        <section className="relative container mx-auto px-4 mb-24">
          <SectionLabel
            eyebrow="By Tier"
            title="The Marble Pedestals"
            tagline="From the heroes of the forge to the everyday talisman."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <TierPedestal
              to="/collections/premium-tier"
              color={GOLD}
              icon="👑"
              eyebrow="Hero Pieces"
              name="Premium"
              tagline="One-of-one statement rings — the crown of the forge."
              insight={tiers["premium-tier"]}
              loading={isLoading}
            />
            <TierPedestal
              to="/collections/pro-tier"
              color={SILVER}
              icon="⚜️"
              eyebrow="Mid-Tier"
              name="Pro"
              tagline="Refined detail and deeper finishes — the devoted's chosen."
              insight={tiers["pro-tier"]}
              loading={isLoading}
            />
            <TierPedestal
              to="/collections/basic-tier"
              color={BRONZE}
              icon="🛡️"
              eyebrow="Entry"
              name="Basic"
              tagline="Approachable everyday pieces — the same forge, lighter on the wallet."
              insight={tiers["basic-tier"]}
              loading={isLoading}
            />
          </div>
        </section>

        {/* Marble plaque — myth quote */}
        <section className="relative container mx-auto px-4">
          <div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden border" style={{ borderColor: `${GOLD}33` }}>
            <MarbleBackground intensity={1.4} />
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-px"
              style={{ background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }}
            />
            <div className="relative px-8 py-10 md:px-12 md:py-14 text-center">
              <p className="text-3xl md:text-4xl mb-5" style={{ color: GOLD }}>
                ❝
              </p>
              <p className="text-lg md:text-xl text-foreground/85 italic font-light leading-relaxed max-w-2xl mx-auto">
                She had eaten the pomegranate seeds — and in doing so, became both spring and shadow,
                forever bound to two worlds.
              </p>
              <div className="mt-6 max-w-xs mx-auto" style={{ color: GOLD }}>
                <GreekMeander color={GOLD} height={10} opacity={0.55} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// ─── Section heading with gold eyebrow + serif title + meander ─────────────
const SectionLabel = ({
  eyebrow,
  title,
  tagline,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
}) => (
  <div className="text-center mb-10 max-w-2xl mx-auto">
    <p
      className="text-[11px] font-bold tracking-[0.45em] uppercase mb-3"
      style={{ color: GOLD, opacity: 0.85 }}
    >
      ✦ {eyebrow} ✦
    </p>
    <h2
      className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight leading-none mb-3"
      style={{
        background: `linear-gradient(180deg, hsl(0 0% 95%) 0%, hsl(0 0% 70%) 100%)`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {title}
    </h2>
    <p className="text-sm md:text-base text-muted-foreground font-light italic">{tagline}</p>
  </div>
);

// ─── Marble realm tablet — silver/gold framed card with realm-tinted soul ──
const RealmTablet = ({
  to,
  color,
  accentBg,
  icon,
  eyebrow,
  name,
  motto,
  tagline,
  insight,
  loading,
}: {
  to: string;
  color: string;
  accentBg: string;
  icon: string;
  eyebrow: string;
  name: string;
  motto: string;
  tagline: string;
  insight: RealmInsight | undefined;
  loading: boolean;
}) => (
  <Link to={to} className="group block">
    <article
      className="relative rounded-2xl overflow-hidden border transition-all duration-500 min-h-[420px] flex flex-col"
      style={{ borderColor: `${SILVER}28` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}88`;
        e.currentTarget.style.boxShadow = `0 28px 70px -22px ${color}55, inset 0 0 0 1px ${GOLD}22`;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${SILVER}28`;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Marble base */}
      <MarbleBackground intensity={1.1} />
      {/* Realm soul tint */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `linear-gradient(135deg, transparent 30%, ${accentBg} 100%), radial-gradient(ellipse at bottom right, ${color}22, transparent 65%)`,
        }}
      />
      {/* Gold capital + base lines */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[2px]"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD}99, transparent)` }}
      />
      {/* Top meander in realm color */}
      <div className="absolute top-1 left-0 right-0 px-6">
        <GreekMeander color={color} height={11} opacity={0.5} />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full p-9 md:p-11 pt-14">
        <div>
          <div
            className="text-6xl md:text-7xl mb-5"
            style={{
              filter: `drop-shadow(0 0 22px ${color}99)`,
            }}
          >
            {icon}
          </div>
          <p
            className="text-[10px] font-bold tracking-[0.5em] uppercase mb-2"
            style={{ color, opacity: 0.85 }}
          >
            {eyebrow}
          </p>
          <h3
            className="text-5xl md:text-6xl font-heading font-bold mb-2 tracking-tight leading-none"
            style={{
              background: `linear-gradient(180deg, hsl(0 0% 98%) 0%, ${color} 110%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: `0 0 40px ${color}55`,
            }}
          >
            {name}
          </h3>
          <p
            className="text-xs md:text-sm tracking-[0.35em] uppercase mb-4"
            style={{ color: SILVER, opacity: 0.75 }}
          >
            — {motto} —
          </p>
          <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed max-w-md">
            {tagline}
          </p>
        </div>

        {/* Smart stat strip */}
        <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${GOLD}22` }}>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <StatBlock
              label="Total"
              value={loading ? "—" : (insight?.total ?? 0).toString()}
              color={color}
              big
            />
            <TierMiniBars insight={insight} color={color} loading={loading} />
            <div
              className="flex items-center gap-2 font-medium text-sm group-hover:gap-3 transition-all duration-300"
              style={{ color }}
            >
              <span>Enter</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </article>
  </Link>
);

// ─── Marble tier pedestal ──────────────────────────────────────────────────
const TierPedestal = ({
  to,
  color,
  icon,
  eyebrow,
  name,
  tagline,
  insight,
  loading,
}: {
  to: string;
  color: string;
  icon: string;
  eyebrow: string;
  name: string;
  tagline: string;
  insight: TierInsight | undefined;
  loading: boolean;
}) => (
  <Link to={to} className="group block">
    <article
      className="relative rounded-2xl overflow-hidden border transition-all duration-500 min-h-[340px] flex flex-col"
      style={{ borderColor: `${SILVER}28` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}99`;
        e.currentTarget.style.boxShadow = `0 22px 55px -18px ${color}55, inset 0 0 0 1px ${color}22`;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${SILVER}28`;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <MarbleBackground intensity={1.1} />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse at top right, ${color}26, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[2px]"
        style={{ background: `linear-gradient(to right, transparent, ${color}88, transparent)` }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full p-7 md:p-8">
        <div>
          <div className="text-5xl mb-4" style={{ filter: `drop-shadow(0 0 15px ${color}99)` }}>
            {icon}
          </div>
          <p
            className="text-[10px] font-bold tracking-[0.45em] uppercase mb-1"
            style={{ color, opacity: 0.85 }}
          >
            {eyebrow}
          </p>
          <h3
            className="text-3xl md:text-4xl font-heading font-bold tracking-tighter leading-none mb-3"
            style={{
              background: `linear-gradient(180deg, hsl(0 0% 98%) 0%, ${color} 110%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {name}
          </h3>
          <p className="text-sm text-muted-foreground/85 leading-relaxed">{tagline}</p>
        </div>

        <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${color}22` }}>
          <div className="flex items-end justify-between gap-3">
            <StatBlock
              label="Pieces"
              value={loading ? "—" : (insight?.total ?? 0).toString()}
              color={color}
            />
            <RealmMiniSplit insight={insight} loading={loading} />
            <div
              className="flex items-center gap-1.5 font-medium text-sm group-hover:gap-2 transition-all duration-300"
              style={{ color }}
            >
              <span>View</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </article>
  </Link>
);

// ─── Tiny stat helpers ─────────────────────────────────────────────────────
const StatBlock = ({
  label,
  value,
  color,
  big = false,
}: {
  label: string;
  value: string;
  color: string;
  big?: boolean;
}) => (
  <div className="flex flex-col">
    <span
      className="text-[9px] font-bold tracking-[0.35em] uppercase text-muted-foreground/70"
    >
      {label}
    </span>
    <span
      className={`font-heading font-bold leading-none tabular-nums ${
        big ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
      }`}
      style={{ color }}
    >
      {value}
    </span>
  </div>
);

const TierMiniBars = ({
  insight,
  color,
  loading,
}: {
  insight: RealmInsight | undefined;
  color: string;
  loading: boolean;
}) => {
  const max = insight
    ? Math.max(
        insight.byTier["premium-tier"],
        insight.byTier["pro-tier"],
        insight.byTier["basic-tier"],
        1,
      )
    : 1;
  const items: { label: string; value: number; color: string }[] = [
    { label: "P", value: insight?.byTier["premium-tier"] ?? 0, color: GOLD },
    { label: "P", value: insight?.byTier["pro-tier"] ?? 0, color: SILVER },
    { label: "B", value: insight?.byTier["basic-tier"] ?? 0, color: BRONZE },
  ];

  return (
    <div className="flex items-end gap-3">
      {items.map((it, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div
            className="w-1.5 rounded-full transition-all"
            style={{
              height: `${loading ? 6 : 6 + (it.value / max) * 22}px`,
              backgroundColor: it.color,
              opacity: loading ? 0.4 : 0.85,
            }}
          />
          <span
            className="text-[10px] font-bold tabular-nums"
            style={{ color: it.color, opacity: 0.85 }}
          >
            {loading ? "—" : it.value}
          </span>
        </div>
      ))}
      {/* color is reserved for hover synergy; mark used to keep linter happy */}
      <span className="hidden" style={{ color }} />
    </div>
  );
};

const RealmMiniSplit = ({
  insight,
  loading,
}: {
  insight: TierInsight | undefined;
  loading: boolean;
}) => (
  <div className="flex items-center gap-3 text-[11px] font-medium tabular-nums">
    <div className="flex items-center gap-1" style={{ color: HADES }}>
      <span>🔥</span>
      <span className="font-bold">{loading ? "—" : insight?.byRealm.hades ?? 0}</span>
    </div>
    <span className="text-muted-foreground/40">·</span>
    <div className="flex items-center gap-1" style={{ color: PERSEPHONE }}>
      <span>🌿</span>
      <span className="font-bold">{loading ? "—" : insight?.byRealm.persephone ?? 0}</span>
    </div>
  </div>
);

export default Collections;
