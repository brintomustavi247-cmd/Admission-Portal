import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { UniversityUpdate } from "../types/admission";

export function useUniversityUpdates() {
  const [latestUpdate, setLatestUpdate] = useState<UniversityUpdate | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  /* ✅ pure fetch — কোনো setState নেই (effect-safe) */
  const fetchTop = useCallback(
    () =>
      supabase
        .from("university_updates")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(1),
    []
  );

  /* ✅ setState গুলো apply-এ — effect-এর .then callback থেকে safe */
  const applyLatest = useCallback((data: any[] | null, error: any) => {
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

  /* refetch (hook consumer-এর জন্য) — আগের মতোই setState সহ */
  const fetchLatest = useCallback(async () => {
    try {
      const { data, error } = await fetchTop();
      applyLatest(data, error);
    } catch (err) {
      console.error("Fetch exception:", err);
    }
  }, [fetchTop, applyLatest]);

  useEffect(() => {
    /* ✅ effect body-তে sync setState নেই — setState applyLatest-এ (.then callback) */
    let alive = true;
    fetchTop().then(
      ({ data, error }) => {
        if (alive) applyLatest(data, error);
      },
      (err) => {
        console.error("Fetch exception:", err);
      }
    );

    // Supabase Realtime Listener across all clients
    const channel = supabase
      .channel("public:university_updates_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "university_updates",
        },
        (payload: any) => {
          const item = (payload.new || payload.old) as UniversityUpdate;
          if (item && item.status === "published") {
            setLatestUpdate(item);
            setUnreadCount((c) => c + 1);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime university update channel active!");
        }
      });

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [fetchTop, applyLatest]);

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