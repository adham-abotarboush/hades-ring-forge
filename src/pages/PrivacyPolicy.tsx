import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-12">Last Updated: November 2025</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-foreground leading-relaxed">
              Your privacy matters. This policy explains how Hades collects and protects your personal information.
            </p>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Information We Collect</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Name</li>
                <li>• Email</li>
                <li>• Phone number</li>
                <li>• Billing & shipping address</li>
                <li>• Payment information (processed securely; we do not store card details)</li>
                <li>• Usage data (cookies, analytics)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">How We Use Your Information</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• To process and ship orders</li>
                <li>• To provide customer support</li>
                <li>• To improve our website and services</li>
                <li>• To send updates or promotional offers (only with consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We rely on secure payment gateways and modern protection tools. We do not sell or share personal data with third parties except courier services needed for delivery.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You may request data deletion or correction at any time: <a href="mailto:hadesegy@gmail.com" className="text-primary hover:underline">hadesegy@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
