import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCollectionByHandle } from "@/lib/shopify";
import { useProductTierMap, TierHandle, TIER_HANDLES } from "@/hooks/useProductTierMap";

type Realm = "hades" | "persephone";

type TierBreakdown = Record<TierHandle | "untiered", number>;

export type RealmInsight = {
  total: number;
  byTier: TierBreakdown;
};

export type TierInsight = {
  total: number;
  byRealm: Record<Realm, number>;
};

// Fetches both realm collections (alongside the tier map) and computes piece
// counts plus the realm × tier intersection. Powers the "smart" stat lines
// on the Collections page so each card surfaces how many rings live inside
// it and how those rings break down across the other axis.
export function useCollectionInsights() {
  const tierMap = useProductTierMap();

  const hades = useQuery({
    queryKey: ["realm-collection", "hades"],
    queryFn: () => fetchCollectionByHandle("hades", 100),
    staleTime: 1000 * 60 * 10,
  });
  const persephone = useQuery({
    queryKey: ["realm-collection", "persephone"],
    queryFn: () => fetchCollectionByHandle("persephone", 100),
    staleTime: 1000 * 60 * 10,
  });

  return useMemo(() => {
    const hadesIds = hades.data?.node.products.edges.map((p) => p.node.id) ?? [];
    const persephoneIds = persephone.data?.node.products.edges.map((p) => p.node.id) ?? [];

    const tierBreakdown = (ids: string[]): TierBreakdown => {
      const counts: TierBreakdown = {
        "premium-tier": 0,
        "pro-tier": 0,
        "basic-tier": 0,
        untiered: 0,
      };
      ids.forEach((id) => {
        const t = tierMap.get(id);
        if (t) counts[t]++;
        else counts.untiered++;
      });
      return counts;
    };

    const realms: Record<Realm, RealmInsight> = {
      hades: { total: hadesIds.length, byTier: tierBreakdown(hadesIds) },
      persephone: { total: persephoneIds.length, byTier: tierBreakdown(persephoneIds) },
    };

    const tiers = TIER_HANDLES.reduce(
      (acc, tierHandle) => {
        const inHades = hadesIds.filter((id) => tierMap.get(id) === tierHandle).length;
        const inPersephone = persephoneIds.filter((id) => tierMap.get(id) === tierHandle).length;
        acc[tierHandle] = {
          total: inHades + inPersephone,
          byRealm: { hades: inHades, persephone: inPersephone },
        };
        return acc;
      },
      {} as Record<TierHandle, TierInsight>,
    );

    return {
      realms,
      tiers,
      isLoading: hades.isLoading || persephone.isLoading,
    };
  }, [hades.data, hades.isLoading, persephone.data, persephone.isLoading, tierMap]);
}
