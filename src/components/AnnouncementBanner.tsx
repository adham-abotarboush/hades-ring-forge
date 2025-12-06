import { Gift } from "lucide-react";

export const AnnouncementBanner = () => {
  return (
    <div className="bg-primary text-primary-foreground py-2.5 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-90" />
      <div className="relative flex items-center justify-center gap-2 text-sm md:text-base font-medium">
        <Gift className="h-4 w-4 animate-pulse" />
        <span>Buy 2 Rings & Get Free Delivery!</span>
        <Gift className="h-4 w-4 animate-pulse" />
      </div>
    </div>
  );
};