import { Gift } from "lucide-react";

export const AnnouncementBanner = () => {
  return (
    <div className="relative bg-primary py-2 px-3 text-center text-primary-foreground sm:px-4 sm:py-2.5">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-90" />
      <div className="relative flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium leading-snug sm:gap-2 sm:text-sm md:text-base">
        <Gift className="h-3.5 w-3.5 shrink-0 animate-pulse sm:h-4 sm:w-4" />
        <span className="max-w-[min(100%,18rem)] sm:max-w-none">Buy 2 Rings & Get Free Delivery!</span>
        <Gift className="h-3.5 w-3.5 shrink-0 animate-pulse sm:h-4 sm:w-4" aria-hidden />
      </div>
    </div>
  );
};