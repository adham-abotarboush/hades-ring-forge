import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Loader2, Package, User as UserIcon } from "lucide-react";
import { phoneSchema } from "@/lib/validation";

interface Profile {
  full_name: string;
  phone_number: string;
}

interface Order {
  id: string;
  total_amount: number;
  currency_code: string;
  status: string;
  created_at: string;
  order_data: any;
}

export default function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone_number: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setEmail(user.email || "");
    await loadProfile(user.id);
    await loadOrders(user.id);
    setIsLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error loading profile:", error);
      return;
    }

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        phone_number: data.phone_number || "",
      });
    }
  };

  const loadOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading orders:", error);
      return;
    }

    setOrders(data || []);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    try {
      // Validate phone number
      const validatedPhone = phoneSchema.parse(profile.phone_number);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name.trim(),
          phone_number: validatedPhone,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      if (error.errors) {
        // Zod validation error
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading text-foreground mb-2">Your Realm</h1>
            <p className="text-muted-foreground">Manage your divine artifacts and sacred information</p>
          </div>

          {!profile.phone_number && (
            <Card className="mb-6 border-destructive bg-destructive/5">
              <CardContent className="pt-6">
                <p className="text-destructive font-medium">
                  ⚠️ Phone number required: Please add your phone number to complete orders.
                </p>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="gap-2">
                <UserIcon className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                Order History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-heading">Personal Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="Enter your full name"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone_number">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={profile.phone_number}
                        onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
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
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-heading">Order History</CardTitle>
                  <CardDescription>View your past divine acquisitions</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your order history will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-foreground">
                                Order #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                {order.currency_code} {order.total_amount.toFixed(2)}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'completed' 
                                  ? 'bg-green-500/20 text-green-500' 
                                  : 'bg-yellow-500/20 text-yellow-500'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          {order.order_data?.items && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-sm text-muted-foreground mb-2">Items:</p>
                              <div className="space-y-1">
                                {order.order_data.items.map((item: any, idx: number) => (
                                  <p key={idx} className="text-sm text-foreground">
                                    {item.quantity}x {item.product?.node?.title || 'Product'}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
