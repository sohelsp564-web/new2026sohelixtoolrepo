import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommandPalette from "@/components/CommandPalette";

const Index = lazy(() => import("./pages/Index"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const DisclaimerPage = lazy(() => import("./pages/DisclaimerPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const RequestToolPage = lazy(() => import("./pages/RequestToolPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PerfDashboard = lazy(() => import("./components/PerfDashboard"));
const ImageResizerPage = lazy(() => import("./pages/ImageResizerPage"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <p className="text-sm text-muted-foreground">Loading...</p>
  </div>
);

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const gtag = (window as any).gtag;

    if (typeof gtag === "function") {
      gtag("config", "G-XZPPGF28V1", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AnalyticsTracker />
            <CommandPalette />

            <div className="flex min-h-screen flex-col">
              <Header />

              <main className="flex-1">
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/tools/image-resizer" element={<ImageResizerPage />} />
                    <Route path="/tools/:slug" element={<ToolPage />} />
                    <Route path="/:lang/tools/:slug" element={<ToolPage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/disclaimer" element={<DisclaimerPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/request-tool" element={<RequestToolPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>

              <Footer />

              <Suspense fallback={null}>
                <PerfDashboard />
              </Suspense>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;