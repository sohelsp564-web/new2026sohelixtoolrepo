import { lazy, Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommandPalette from "@/components/CommandPalette";

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
        <Toaster />
        <Sonner />
        <AnalyticsTracker />
        <CommandPalette />

        <div className="flex min-h-screen flex-col">
          <Header />

          <main className="flex-1">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </main>

          <Footer />

          <Suspense fallback={null}>
            <PerfDashboard />
          </Suspense>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
