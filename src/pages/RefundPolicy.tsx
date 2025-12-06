import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-40 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Refund Policy
          </h1>
          <p className="text-muted-foreground mb-12">Last Updated: November 2025</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-foreground leading-relaxed">
              At Hades, your satisfaction is our priority. If you are not fully satisfied with your purchase, we are here to help.
            </p>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Refund Eligibility</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Refunds are accepted within 7 days of receiving your order.</li>
                <li>• Items must be unused, in original condition, and returned with original packaging.</li>
                <li>• Proof of purchase is required.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Non-Refundable Items</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Customized or personalized items.</li>
                <li>• Items damaged due to misuse after delivery.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Refund Process</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• We will notify you once your return is received and inspected.</li>
                <li>• Approved refunds will be issued to your original payment method within 7–10 business days.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Return Shipping</h2>
              <p className="text-muted-foreground">
                • Customers are responsible for return shipping costs.
              </p>
            </section>

            <section className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground">
                For refund support, contact us at: <a href="mailto:hadesegy@gmail.com" className="text-primary hover:underline">hadesegy@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
