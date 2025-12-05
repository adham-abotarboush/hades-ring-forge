import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchTestimonials, Testimonial } from "@/lib/testimonials";

export function TestimonialCarousel() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        fetchTestimonials()
            .then(setTestimonials)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!isAutoPlaying || testimonials.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    const handlePrev = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handleDotClick = (index: number) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-background to-muted/30">
                <div className="container mx-auto px-4 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) return null;

    return (
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                        What Our <span className="text-primary">Warriors</span> Say
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of satisfied customers who wear our rings with pride
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation Buttons - hidden on mobile, use dots */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg hidden md:flex"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>

                    {/* Testimonial Card */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="w-full flex-shrink-0 px-4"
                                >
                                    <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center relative">
                                        {/* Quote Icon */}
                                        <div className="absolute top-6 left-6 text-primary/20">
                                            <Quote className="h-12 w-12" />
                                        </div>

                                        {/* Stars */}
                                        <div className="flex justify-center gap-1 mb-6">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                                            ))}
                                        </div>

                                        {/* Testimonial Text */}
                                        <blockquote className="text-lg md:text-xl text-foreground/90 mb-8 leading-relaxed">
                                            "{testimonial.text}"
                                        </blockquote>

                                        {/* Author */}
                                        <div className="space-y-1">
                                            <p className="font-semibold text-lg">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                                            {testimonial.product_name && (
                                                <p className="text-sm text-primary">Purchased: {testimonial.product_name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dot Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    index === currentIndex
                                        ? "bg-primary w-8"
                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                )}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
