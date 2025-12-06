import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { useProducts } from "@/contexts/ProductsContext";

interface RelatedProductsProps {
    currentProductId: string;
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    const { getRelatedProducts, isLoading } = useProducts();
    const products = getRelatedProducts(currentProductId, 4);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-16 border-t border-border/50">
            <h2 className="text-3xl font-heading font-bold mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.node.id} product={product} />
                ))}
            </div>
        </section>
    );
}
