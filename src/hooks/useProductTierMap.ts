import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCollectionByHandle } from "@/lib/shopify";

export const TIER_HANDLES = ["premium-tier", "pro-tier", "basic-tier"] as const;
export type TierHandle = (typeof TIER_HANDLES)[number];

// Fetches the three tier collections in parallel and returns a map of
// productId → tier handle. A product that appears in multiple tier
// collections resolves to the most prestigious tier (Premium > Pro > Basic),
// since TIER_HANDLES is iterated in that order and we never overwrite.
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
