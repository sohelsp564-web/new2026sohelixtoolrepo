import { lazy, Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/layout/Header";

const Footer = lazy(() => import("@/components/layout/Footer"));
const CommandPalette = lazy(() => import("@/components/CommandPalette"));
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));
const PerfDashboard = lazy(() => import("./components/PerfDashboard"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <p className="text-sm text-muted-foreground">Loading...</p>
  </div>
);

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const gtag = (window as any).gtag;
      if (typeof gtag === "function") {
        gtag("config", "G-XZPPGF28V1", {
          page_path: location.pathname,
        });
      }
    }
  }, [location]);

  return null;
};

export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={null}><Toaster /></Suspense>
        <Suspense fallback={null}><Sonner /></Suspense>
        <AnalyticsTracker />
        <Suspense fallback={null}><CommandPalette /></Suspense>

        <div className="flex min-h-screen flex-col">
          <Header />

          <main className="flex-1">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </main>

          <Suspense fallback={null}>
            <Footer />
          </Suspense>

          <Suspense fallback={null}>
            <PerfDashboard />
          </Suspense>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
