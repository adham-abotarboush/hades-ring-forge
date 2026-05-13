import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCollectionByHandle } from "@/lib/shopify";

export const TIER_HANDLES = ["premium-tier", "pro-tier", "basic-tier"] as const;
export type TierHandle = (typeof TIER_HANDLES)[number];

/** User-facing filter: Premium, Basic (Basic = former Pro + Basic in Shopify), or all */
export type ShopTierFilter = "all" | "premium" | "basic";

export function parseShopTierParam(raw: string | null): ShopTierFilter {
  if (!raw || raw === "all") return "all";
  const x = raw.toLowerCase();
  if (x === "premium" || x === "premium-tier") return "premium";
  if (x === "basic" || x === "basic-tier" || x === "pro" || x === "pro-tier") return "basic";
  return "all";
}

export function matchesShopTierFilter(
  map: Map<string, TierHandle>,
  productId: string,
  filter: ShopTierFilter,
): boolean {
  if (filter === "all") return true;
  const t = map.get(productId);
  if (filter === "premium") return t === "premium-tier";
  return t === "pro-tier" || t === "basic-tier";
}

// Featured sort: Premium (0) → Basic bucket incl. Pro (1) → untiered (2)
export function tierRank(tier: TierHandle | undefined): number {
  if (tier === "premium-tier") return 0;
  if (tier === "pro-tier" || tier === "basic-tier") return 1;
  return 2;
}

// Fetches the three tier collections in parallel and returns a map of
// productId → tier handle. A product that appears in multiple tier
// A product that appears in multiple tier collections resolves to the most
// prestigious tier (Premium wins over Basic bucket members), since TIER_HANDLES
// is iterated in that order and we never overwrite.
export function useProductTierMap(enabled: boolean = true) {
  const { data: tierCollections } = useQuery({
    queryKey: ["tier-collections-map"],
    queryFn: () =>
      Promise.all(TIER_HANDLES.map((h) => fetchCollectionByHandle(h, 100))),
    enabled,
    staleTime: 1000 * 60 * 10,
  });

  return useMemo(() => {
    const map = new Map<string, TierHandle>();
    if (!tierCollections) return map;
    TIER_HANDLES.forEach((handle, idx) => {
      const col = tierCollections[idx];
      col?.node.products.edges.forEach((p) => {
        if (!map.has(p.node.id)) map.set(p.node.id, handle);
      });
    });
    return map;
  }, [tierCollections]);
}
