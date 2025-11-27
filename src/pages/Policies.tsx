import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const Policies = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Policies
          </h1>
          <p className="text-muted-foreground mb-12">Last Updated: November 2025</p>

          <div className="space-y-16">
            {/* Refund Policy */}
            <section id="refund" className="scroll-mt-32">
              <h2 className="text-3xl font-heading font-bold mb-6 text-gradient">
                Refund Policy
              </h2>
              <div className="prose prose-invert max-w-none space-y-6">
                <p className="text-foreground leading-relaxed">
                  We offer refunds under specific conditions to ensure fairness for both customers and our artisans.
                </p>

                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Eligibility for Refunds</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Refund requests must be made within 7 days of receiving your order.</li>
                    <li>• Items must be unused, unworn, and in their original packaging.</li>
                    <li>• Custom or personalized items are not eligible for refunds unless defective.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Non-Refundable Items</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Items showing signs of wear or damage</li>
                    <li>• Products without original packaging</li>
                    <li>• Orders beyond the 7-day return window</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Refund Process</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Once your return is received and inspected, we will notify you of the approval or rejection. 
                    Approved refunds will be processed within 7-10 business days to your original payment method.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Note:</strong> Customers are responsible for return shipping costs unless the item is defective or incorrect.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="text-foreground">
                    For refund requests: <a href="mailto:hadesegy@gmail.com" className="text-primary hover:underline">hadesegy@gmail.com</a>
                  </p>
                </div>
              </div>
            </section>

            {/* Exchange Policy */}
            <section id="exchange" className="scroll-mt-32">
              <h2 className="text-3xl font-heading font-bold mb-6 text-gradient">
                Exchange Policy
              </h2>
              <div className="prose prose-invert max-w-none space-y-6">
                <p className="text-foreground leading-relaxed">
                  We offer exchanges for size issues or manufacturing defects.
                </p>

                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Exchange Conditions</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Requests must be made within 7 days of delivery.</li>
                    <li>• Item must be unworn and in original condition.</li>
                    <li>• Exchanges depend on product availability.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Defective or Damaged Items</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If your item arrives damaged or defective, notify us within 48 hours with photos. We will replace it at no extra charge.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="text-foreground">
                    To request an exchange: <a href="mailto:hadesegy@gmail.com" className="text-primary hover:underline">hadesegy@gmail.com</a>
                  </p>
                </div>
              </div>
            </section>

            {/* Shipping Policy */}
            <section id="shipping" className="scroll-mt-32">
              <h2 className="text-3xl font-heading font-bold mb-6 text-gradient">
                Shipping Policy
              </h2>
              <div className="prose prose-invert max-w-none space-y-6">
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Processing Time</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Orders are processed within 1-3 business days. Handcrafted items may require additional time.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Shipping Times</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Greater Cairo & Alexandria: 2-4 business days</li>
                    <li>• Upper Egypt: 4-7 business days</li>
                    <li>• Currently, we do not offer international shipping</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Shipping Fees</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Shipping fees vary based on location and order size. Fees will be calculated at checkout.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Lost or Delayed Shipments</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If your order is delayed beyond the estimated delivery time, please contact us at <a href="mailto:hadesegy@gmail.com" className="text-primary hover:underline">hadesegy@gmail.com</a>
                  </p>
                </div>
              </div>
            </section>

            {/* Delivery Policy */}
            <section id="delivery" className="scroll-mt-32">
              <h2 className="text-3xl font-heading font-bold mb-6 text-gradient">
                Delivery Policy
              </h2>
              <div className="prose prose-invert max-w-none space-y-6">
                <ul className="space-y-4 text-muted-foreground">
                  <li>• Couriers will attempt delivery up to 2 times.</li>
                  <li>• If delivery fails due to incorrect address or unavailable recipient, re-delivery fees may apply.</li>
                  <li>• Inspect your items upon arrival and report issues within 24 hours.</li>
                </ul>
              </div>
            </section>

            {/* Privacy Policy */}
            <section id="privacy" className="scroll-mt-32">
              <h2 className="text-3xl font-heading font-bold mb-6 text-gradient">
                Privacy Policy
              </h2>
              <div className="prose prose-invert max-w-none space-y-6">
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Information We Collect</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Name, email, shipping address</li>
                    <li>• Payment information (processed securely)</li>
                    <li>• Order history and preferences</li>
                    <li>• Website usage data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">How We Use Your Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• To process and fulfill orders</li>
                    <li>• To provide customer support</li>
                    <li>• To improve our products and services</li>
                    <li>• To send promotional offers (with your consent)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Data Security</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement industry-standard security measures to protect your personal information. 
                    Your payment details are encrypted and never stored on our servers.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <p className="text-foreground">
                    For data requests or privacy concerns: <a href="mailto:hadesegy@gmail.com" className="text-primary hover:underline">hadesegy@gmail.com</a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Policies;
