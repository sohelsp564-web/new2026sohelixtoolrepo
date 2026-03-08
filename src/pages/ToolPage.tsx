import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getToolBySlug, getRelatedTools } from "@/data/tools";
import ToolCard from "@/components/ToolCard";
import ToolInterface from "@/components/tools/ToolInterface";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const ToolPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = getToolBySlug(slug || "");

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Tool Not Found</h1>
        <p className="mt-4 text-muted-foreground">The tool you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const related = getRelatedTools(tool);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sohelix.com/" },
      { "@type": "ListItem", position: 2, name: tool.category, item: `https://sohelix.com/category/${tool.categorySlug}` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `https://sohelix.com/tools/${tool.slug}` },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{tool.name} — Free Online Tool | Sohelix Tools</title>
        <meta name="description" content={tool.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://sohelix.com/tools/${tool.slug}`} />
        <meta property="og:title" content={`${tool.name} — Sohelix Tools`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${tool.name} — Sohelix Tools`} />
        <meta name="twitter:description" content={tool.description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/category/${tool.categorySlug}`} className="hover:text-foreground transition-colors">{tool.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{tool.name}</span>
        </nav>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold mb-3 md:text-4xl" style={{ fontFamily: 'Space Grotesk' }}>{tool.name}</h1>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed max-w-2xl">{tool.description}</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            {/* Tool Interface */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card className="p-6 mb-8 shadow-card border-transparent rounded-2xl">
                <ToolInterface slug={tool.slug} />
              </Card>
            </motion.div>

            {/* How to Use */}
            <Card className="p-6 mb-6 shadow-card border-transparent rounded-2xl">
              <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Space Grotesk' }}>How to Use</h2>
              <ol className="space-y-4">
                {tool.howToUse.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary text-sm font-bold">{i + 1}</span>
                    <span className="text-muted-foreground pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Benefits */}
            <Card className="p-6 mb-6 shadow-card border-transparent rounded-2xl">
              <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Space Grotesk' }}>Benefits</h2>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  "100% free to use",
                  "No file uploads — everything runs in your browser",
                  "Fast and instant processing",
                  "No registration or sign-up required",
                  "Works on mobile and desktop",
                ].map((b, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent text-xs">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </Card>

            {/* FAQ */}
            <Card className="p-6 mb-6 shadow-card border-transparent rounded-2xl">
              <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Space Grotesk' }}>Frequently Asked Questions</h2>
              <div className="space-y-5">
                {tool.faqs.map((faq, i) => (
                  <div key={i}>
                    <h3 className="font-semibold mb-1.5">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="w-full bg-muted/30 text-center py-20 text-xs text-muted-foreground rounded-2xl border border-dashed border-border">{/* Ad Slot: Sidebar */}</div>
          </aside>
        </div>

        {/* Related Tools */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Related Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ToolPage;
