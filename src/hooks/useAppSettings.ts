import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface AppSettings {
  subscription_enabled: boolean;
  referral_discount_enabled: boolean;
  donation_enabled: boolean;
  free_until: string | null;
  base_price: number;
  referral_price: number;
  announcement_text: string | null;
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .eq("id", 1)
        .single();
        
      if (alive && !error && data) {
        setSettings(data as AppSettings);
      }
      if (alive) setLoading(false);
    };

    fetchSettings();

    // 🔥 Real-time listener: Admin সেভ করার সাথে সাথে পুরো অ্যাপে চেঞ্জ হয়ে যাবে
    const channel = supabase
      .channel("global-app-settings-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "app_settings", filter: "id=eq.1" },
        (payload) => {
          if (alive && payload.new) {
            setSettings(payload.new as AppSettings);
          }
        }
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
}