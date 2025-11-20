import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const ExchangePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Exchange Policy
          </h1>
          <p className="text-muted-foreground mb-12">Last Updated: November 2025</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-foreground leading-relaxed">
              We offer exchanges for size issues or manufacturing defects.
            </p>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Exchange Conditions</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Requests must be made within 7 days of delivery.</li>
                <li>• Item must be unworn and in original condition.</li>
                <li>• Exchanges depend on product availability.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Defective or Damaged Items</h2>
              <p className="text-muted-foreground leading-relaxed">
                If your item arrives damaged or defective, notify us within 48 hours with photos. We will replace it at no extra charge.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground">
                To request an exchange: <a href="mailto:hadesegy@gmail.com" className="text-primary hover:underline">hadesegy@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExchangePolicy;
