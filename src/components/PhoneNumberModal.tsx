import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { phoneSchema } from "@/lib/validation";

interface PhoneNumberModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const PhoneNumberModal = ({ isOpen, onOpenChange, onSuccess }: PhoneNumberModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    try {
      // Validate phone number
      const validatedPhone = phoneSchema.parse(phoneNumber);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      // Use upsert to handle cases where profile might not exist
      const { error } = await supabase
        .from("profiles")
        .upsert({ 
          user_id: user.id,
          phone_number: validatedPhone 
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast.success("Phone number saved successfully!");
      setPhoneNumber("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      if (error.errors) {
        // Zod validation error
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to save phone number");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSaving && onOpenChange(open)}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-heading">Phone Number Required</DialogTitle>
          <DialogDescription>
            Please provide your phone number to complete your profile and place orders.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Required for order processing and delivery updates
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
