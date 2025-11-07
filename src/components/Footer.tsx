import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-card border-t border-border mt-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-forge opacity-30" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-3xl font-heading font-bold text-gradient mb-4">HADES</h3>
            <p className="text-muted-foreground leading-relaxed">
              Forging mythic rings from recycled forks, inspired by ancient Greek legends and the eternal flames of the underworld.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Home</span>
                </a>
              </li>
              <li>
                <a href="/shop" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Shop</span>
                </a>
              </li>
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">About Us</span>
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Contact</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-background/50 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-background/50 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-background/50 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Hades Ring Forge. All rights reserved. Forged with passion in the depths of creativity.
          </p>
        </div>
      </div>
    </footer>
  );
};
