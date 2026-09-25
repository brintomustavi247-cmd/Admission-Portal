import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { UniversityUpdate } from "../types/admission";

export function useUniversityUpdates() {
  const [latestUpdate, setLatestUpdate] = useState<UniversityUpdate | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchLatest = useCallback(async () => {
    const { data } = await supabase
      .from("university_updates")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(5);

    if (data && data.length > 0) {
      const top = data[0] as UniversityUpdate;
      // LocalStorage check so user doesn't see same dismissed update
      const dismissedId = localStorage.getItem("last_dismissed_update");
      if (dismissedId !== top.id) {
        setLatestUpdate(top);
      }
      setUnreadCount(data.length);
    }
  }, []);

  useEffect(() => {
    fetchLatest();

    // Supabase Realtime Listener
    const channel = supabase
      .channel("public:university_updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "university_updates",
        },
        (payload) => {
          const newUp = payload.new as UniversityUpdate;
          if (newUp.status === "published") {
            setLatestUpdate(newUp);
            setUnreadCount((c) => c + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "university_updates",
        },
        (payload) => {
          const updated = payload.new as UniversityUpdate;
          if (updated.status === "published") {
            setLatestUpdate(updated);
          }
        }
      )
      .subscribe();

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