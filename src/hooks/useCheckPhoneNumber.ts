import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCheckPhoneNumber = () => {
  const [hasPhoneNumber, setHasPhoneNumber] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPhoneNumber();
  }, []);

  const checkPhoneNumber = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("phone_number")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking phone number:", error);
      setIsLoading(false);
      return;
    }

    setHasPhoneNumber(!!data?.phone_number);
    setIsLoading(false);
  };

  return { hasPhoneNumber, isLoading, recheck: checkPhoneNumber };
};
