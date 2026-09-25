import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { UniversityUpdate } from "../types/admission";

export function useUniversityUpdates() {
  const [latestUpdate, setLatestUpdate] = useState<UniversityUpdate | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchLatest = useCallback(async () => {
    const { data, error } = await supabase
      .from("university_updates")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Updates fetch error:", error);
      return;
    }

    if (data && data.length > 0) {
      const top = data[0] as UniversityUpdate;
      const dismissedId = localStorage.getItem("last_dismissed_update");
      if (dismissedId !== top.id) {
        setLatestUpdate(top);
      }
      setUnreadCount(data.length);
    }
  }, []);

  useEffect(() => {
    fetchLatest();

    // Supabase Realtime Listener (সবগুলো ইভেন্ট শুনবে)
    const channel = supabase
      .channel("realtime:university_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "university_updates",
        },
        (payload: any) => {
          const item = payload.new as UniversityUpdate;
          if (item && item.status === "published") {
            setLatestUpdate(item);
            setUnreadCount((c) => c + 1);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime update channel connected!");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLatest]);

  const dismissUpdate = (id: string) => {
    localStorage.setItem("last_dismissed_update", id);
    setLatestUpdate(null);
  };

  return {
    latestUpdate,
    unreadCount,
    dismissUpdate,
    refetch: fetchLatest,
  };
}