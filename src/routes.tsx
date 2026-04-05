import { lazy } from "react";
import type { RouteRecord } from "vite-react-ssg";
import AppLayout from "./AppLayout";
import { tools, categories } from "./data/tools";
import { blogPosts } from "./data/blogPosts";

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
const ImageResizerPage = lazy(() => import("./pages/ImageResizerPage"));

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Index /> },

      {
        path: "tools/image-resizer",
        element: <ImageResizerPage />,
      },

      {
        path: "tools/:slug",
        element: <ToolPage />,
        getStaticPaths: () => tools.map((t) => `tools/${t.slug}`),
      },

      {
        path: ":lang/tools/:slug",
        element: <ToolPage />,
      },

      {
        path: "category/:slug",
        element: <CategoryPage />,
        getStaticPaths: () => categories.map((c) => `category/${c.slug}`),
      },

      { path: "categories", element: <CategoriesPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      { path: "privacy-policy", element: <PrivacyPage /> },
      { path: "terms-of-service", element: <TermsOfServicePage /> },
      { path: "disclaimer", element: <DisclaimerPage /> },
      { path: "faq", element: <FaqPage /> },
      { path: "request-tool", element: <RequestToolPage /> },
      { path: "blog", element: <BlogPage /> },

      {
        path: "blog/:slug",
        element: <BlogPostPage />,
        getStaticPaths: () => blogPosts.map((p) => `blog/${p.slug}`),
      },

      { path: "*", element: <NotFound /> },
    ],
  },
];
