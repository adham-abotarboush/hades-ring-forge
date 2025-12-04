import { useState, useEffect, useRef, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
    src: string;
    alt: string;
    /** Optional low-quality placeholder URL. If not provided, uses a blurred version of main image */
    placeholderSrc?: string;
    /** Blur intensity for placeholder (default: 20) */
    blurRadius?: number;
    /** Container class name for aspect ratio or sizing */
    containerClassName?: string;
    /** Whether to enable lazy loading (default: true) */
    lazy?: boolean;
    /** Root margin for intersection observer (default: "100px") */
    rootMargin?: string;
}

export function ProgressiveImage({
    src,
    alt,
    placeholderSrc,
    blurRadius = 20,
    containerClassName,
    className,
    lazy = true,
    rootMargin = "100px",
    ...props
}: ProgressiveImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(!lazy);
    const [currentSrc, setCurrentSrc] = useState<string | null>(null);
    const imgRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!lazy || isInView) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin, threshold: 0.01 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [lazy, rootMargin, isInView]);

    // Load image when in view
    useEffect(() => {
        if (!isInView) return;

        const img = new Image();
        img.src = src;
        img.onload = () => {
            setCurrentSrc(src);
            setIsLoaded(true);
        };
        img.onerror = () => {
            // Still set the src so the img element can show its error state
            setCurrentSrc(src);
            setIsLoaded(true);
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, isInView]);

    // Generate a simple placeholder using CSS blur on a tiny version or gradient
    const placeholderStyle = !isLoaded
        ? {
            filter: `blur(${blurRadius}px)`,
            transform: "scale(1.1)", // Prevent blur edges from showing
        }
        : {};

    return (
        <div ref={imgRef} className={cn("overflow-hidden relative", containerClassName)}>
            {/* Placeholder/Loading State */}
            {!isLoaded && (
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse",
                        className
                    )}
                    style={placeholderStyle}
                >
                    {placeholderSrc && isInView && (
                        <img
                            src={placeholderSrc}
                            alt=""
                            aria-hidden="true"
                            className="w-full h-full object-cover"
                            style={placeholderStyle}
                        />
                    )}
                </div>
            )}

            {/* Main Image */}
            {currentSrc && (
                <img
                    src={currentSrc}
                    alt={alt}
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-500",
                        isLoaded ? "opacity-100" : "opacity-0",
                        className
                    )}
                    {...props}
                />
            )}
        </div>
    );
}
