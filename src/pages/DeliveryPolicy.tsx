import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const DeliveryPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-40 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Delivery Policy
          </h1>
          <p className="text-muted-foreground mb-12">Last Updated: November 2025</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <ul className="space-y-4 text-muted-foreground">
              <li>• Couriers will attempt delivery up to 2 times.</li>
              <li>• If delivery fails due to incorrect address or unavailable recipient, re-delivery fees may apply.</li>
              <li>• Inspect your items upon arrival and report issues within 24 hours.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeliveryPolicy;
