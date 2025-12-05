import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageZoomProps {
    images: Array<{
        url: string;
        altText: string | null;
    }>;
    initialIndex?: number;
    isOpen: boolean;
    onClose: () => void;
}

export const ImageZoom = ({ images, initialIndex = 0, isOpen, onClose }: ImageZoomProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef({ startX: 0, startY: 0, scrollX: 0, scrollY: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentIndex(initialIndex);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, [initialIndex, isOpen]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.5, 4));
    };

    const handleZoomOut = () => {
        setScale((prev) => {
            const newScale = Math.max(prev - 0.5, 1);
            if (newScale === 1) setPosition({ x: 0, y: 0 });
            return newScale;
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale <= 1) return;
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            scrollX: position.x,
            scrollY: position.y,
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || scale <= 1) return;
        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;
        setPosition({
            x: dragRef.current.scrollX + deltaX,
            y: dragRef.current.scrollY + deltaY,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "Escape") onClose();
        if (e.key === "+") handleZoomIn();
        if (e.key === "-") handleZoomOut();
    };

    if (!images.length) return null;

    const currentImage = images[currentIndex];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none overflow-hidden"
                onKeyDown={handleKeyDown}
            >
                <VisuallyHidden>
                    <DialogTitle>Image Gallery - {currentImage?.altText || `Image ${currentIndex + 1}`}</DialogTitle>
                </VisuallyHidden>

                {/* Controls */}
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomOut}
                        disabled={scale <= 1}
                        className="bg-black/50 hover:bg-black/70 text-white"
                    >
                        <ZoomOut className="h-5 w-5" />
                    </Button>
                    <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomIn}
                        disabled={scale >= 4}
                        className="bg-black/50 hover:bg-black/70 text-white"
                    >
                        <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="bg-black/50 hover:bg-black/70 text-white ml-2"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation arrows */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white h-12 w-12"
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white h-12 w-12"
                        >
                            <ChevronRight className="h-8 w-8" />
                        </Button>
                    </>
                )}

                {/* Image */}
                <div
                    ref={imageRef}
                    className={`w-full h-full flex items-center justify-center overflow-hidden ${scale > 1 ? "cursor-grab" : ""} ${isDragging ? "cursor-grabbing" : ""}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <img
                        src={currentImage?.url}
                        alt={currentImage?.altText || "Product image"}
                        className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
                        style={{
                            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                        }}
                        draggable={false}
                    />
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 p-2 rounded-lg">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index);
                                    setScale(1);
                                    setPosition({ x: 0, y: 0 });
                                }}
                                className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${index === currentIndex ? "border-primary" : "border-transparent hover:border-white/50"
                                    }`}
                            >
                                <img
                                    src={img.url}
                                    alt={img.altText || `Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Image counter */}
                <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded">
                    {currentIndex + 1} / {images.length}
                </div>
            </DialogContent>
        </Dialog>
    );
};
