import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Shipping Policy
          </h1>
          <p className="text-muted-foreground mb-12">Last Updated: November 2025</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-foreground leading-relaxed">
              Hades ships handcrafted rings from Borg El Arab, Alexandria, with operations managed from our HQ in New Cairo.
            </p>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Processing Time</h2>
              <p className="text-muted-foreground">
                • Orders take 1–3 business days to craft and prepare.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Shipping Times</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Greater Cairo & New Cairo: 2–4 business days</li>
                <li>• Alexandria & Delta: 2–4 business days</li>
                <li>• Upper Egypt: 4–7 business days</li>
                <li>• International Shipping: Not available yet</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Shipping Fees</h2>
              <p className="text-muted-foreground">
                • Calculated at checkout based on your region.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Lost or Delayed Shipments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Once your order is transferred to the courier, delivery speed is outside our control.
                If delayed, contact us and we will assist in tracking.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;
