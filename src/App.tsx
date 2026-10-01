import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppGate } from "./components/AppGate";
import AdmissionDashboard from "./page";

const Landing = lazy(() =>
  import("./pages/Landing").then((m) => ({ default: m.Landing })),
);
const Login = lazy(() =>
  import("./pages/Login").then((m) => ({ default: m.Login })),
);
const Admin = lazy(() =>
  import("./pages/Admin").then((m) => ({ default: m.Admin })),
);

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { err: Error | null }
> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) {
    return { err };
  }
  render() {
    if (this.state.err) {
      return (
        <div className="min-h-screen flex items-center justify-center text-sm font-bold text-rose-500 p-6 text-center">
          ⚠️ কিছু একটা ভুল হয়েছে — refresh করো। ({this.state.err.message})
        </div>
      );
    }
    return this.props.children;
  }
}

const Inner: React.FC = () => {
  const { session, profile, loading } = useAuth();
  const [route, setRoute] = useState<"landing" | "login" | "app" | "admin">(
    () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash.replace("#/", "").replace("#", "");
        if (hash === "admin") return "admin";
      }
      return "landing";
    },
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHash = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "");
      setRoute((prev) => {
        if (hash === "admin") return "admin";
        if (prev === "admin") return "app";
        return prev;
      });
    };
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("popstate", handleHash);
    return () => {
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("popstate", handleHash);
    };
  }, []);

  /* ✅ FIX: derived route — effect-এ setState নেই */
  const effectiveRoute = useMemo(() => {
    if (typeof window === "undefined") return route;
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref && !session) return "login";
    return route === "landing" ? "app" : route;
  }, [route, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1017] flex items-center justify-center text-slate-300 text-sm">
        লোড হচ্ছে...
      </div>
    );
  }

  const suspenseFallback = (
    <div className="min-h-screen animate-pulse bg-slate-100 dark:bg-[#0d1017]" />
  );

  if (!session) {
    return (
      <ErrorBoundary>
        <Suspense fallback={suspenseFallback}>
          {effectiveRoute === "login" ? (
            <Login onDone={() => setRoute("app")} />
          ) : (
            <Landing onGetStarted={() => setRoute("login")} />
          )}
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (effectiveRoute === "admin" && profile?.role === "admin") {
    return (
      <ErrorBoundary>
        <Suspense fallback={suspenseFallback}>
          <Admin
            onExit={() => {
              setRoute("app");
              const savedTab = localStorage.getItem("active_tab") || "home";
              window.location.hash = `/${savedTab}`;
            }}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={suspenseFallback}>
        <AppGate>
          <AdmissionDashboard />
        </AppGate>
      </Suspense>
    </ErrorBoundary>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
