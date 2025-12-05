import { useState, useEffect } from "react";
import { X, Gift, Mail } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const POPUP_STORAGE_KEY = "hades_email_popup_dismissed";
const POPUP_DELAY_MS = 5000; // 5 seconds after page load
const DISCOUNT_CODE = "HADES10";

export function EmailPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        // Check if popup was already dismissed
        const wasDismissed = localStorage.getItem(POPUP_STORAGE_KEY);
        if (wasDismissed) return;

        // Show popup after delay
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, POPUP_DELAY_MS);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        localStorage.setItem(POPUP_STORAGE_KEY, "true");
        setIsOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call - would integrate with email service
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setIsSubscribed(true);

        // Copy discount code to clipboard
        navigator.clipboard.writeText(DISCOUNT_CODE);
        toast.success("Discount code copied to clipboard!");

        // Dismiss after showing success
        setTimeout(() => {
            handleDismiss();
        }, 5000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-primary/20">
                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute right-4 top-4 z-10 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

                <div className="relative p-8 text-center">
                    {!isSubscribed ? (
                        <>
                            {/* Icon */}
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <Gift className="h-8 w-8 text-primary" />
                            </div>

                            {/* Heading */}
                            <h2 className="text-2xl font-heading font-bold mb-2">
                                Get <span className="text-primary">10% Off</span>
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Join our inner circle and receive exclusive offers, new arrivals, and a 10% discount on your first order.
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 text-base"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 text-base font-semibold"
                                >
                                    {isSubmitting ? "Subscribing..." : "Claim My Discount"}
                                </Button>
                            </form>

                            {/* Privacy Note */}
                            <p className="text-xs text-muted-foreground mt-4">
                                By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
                            </p>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Gift className="h-8 w-8 text-green-500" />
                            </div>

                            <h2 className="text-2xl font-heading font-bold mb-2">
                                Welcome to the <span className="text-primary">Underworld!</span>
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Your discount code has been copied to clipboard.
                            </p>

                            {/* Discount Code Display */}
                            <div className="bg-muted rounded-lg p-4 mb-4">
                                <p className="text-sm text-muted-foreground mb-1">Your discount code:</p>
                                <p className="text-2xl font-mono font-bold text-primary tracking-wider">
                                    {DISCOUNT_CODE}
                                </p>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Use this code at checkout for 10% off your first order.
                            </p>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
