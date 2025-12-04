import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden bg-card border-border h-full flex flex-col">
            {/* Image skeleton */}
            <div className="aspect-square relative overflow-hidden">
                <Skeleton className="w-full h-full absolute inset-0" />
            </div>

            {/* Content skeleton */}
            <CardContent className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <Skeleton className="h-6 w-3/4 mb-3" />

                {/* Description lines */}
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />

                {/* Price and button */}
                <div className="flex items-center justify-between gap-3 mt-auto">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-9 w-20" />
                </div>
            </CardContent>
        </Card>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image skeleton */}
            <Skeleton className="aspect-square rounded-lg" />

            {/* Content skeleton */}
            <div className="flex flex-col justify-center">
                {/* Title */}
                <Skeleton className="h-10 w-3/4 mb-4" />

                {/* Price */}
                <Skeleton className="h-8 w-32 mb-6" />

                {/* Description */}
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-8" />

                {/* Size selector */}
                <Skeleton className="h-5 w-24 mb-3" />
                <div className="flex gap-3 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <Skeleton key={i} className="h-10 w-14" />
                    ))}
                </div>

                {/* Quantity */}
                <Skeleton className="h-5 w-20 mb-3" />
                <div className="flex items-center gap-3 mb-8">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-6 w-10" />
                    <Skeleton className="h-10 w-10" />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <Skeleton className="h-12 w-36" />
                    <Skeleton className="h-12 w-32" />
                </div>
            </div>
        </div>
    );
}
