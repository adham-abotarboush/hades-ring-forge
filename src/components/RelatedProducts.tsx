import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

interface RelatedProductsProps {
    currentProductId: string;
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                // Fetch random products
                const allProducts = await fetchProducts(8, true);
                // Filter out current product and take top 4
                const related = allProducts
                    .filter(p => p.node.id !== currentProductId)
                    .slice(0, 4);
                setProducts(related);
            } catch (error) {
                console.error("Failed to load related products:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [currentProductId]);

    if (loading) {
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
