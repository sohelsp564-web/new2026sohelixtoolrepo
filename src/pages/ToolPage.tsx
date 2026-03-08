import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getToolBySlug, getRelatedTools } from "@/data/tools";
import ToolCard from "@/components/ToolCard";
import ToolInterface from "@/components/tools/ToolInterface";
import { Helmet } from "react-helmet-async";

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

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/category/${tool.categorySlug}`} className="hover:text-foreground transition-colors">{tool.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{tool.name}</span>
        </nav>

        {/* Ad slot */}
        <div className="w-full bg-muted/50 text-center py-2 text-xs text-muted-foreground rounded-lg mb-6">{/* Ad Slot: Header */}</div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2 md:text-4xl" style={{ fontFamily: 'Space Grotesk' }}>{tool.name}</h1>
        <p className="text-muted-foreground mb-8 text-lg">{tool.description}</p>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            {/* Tool Interface */}
            <Card className="p-6 mb-8">
              <ToolInterface slug={tool.slug} />
            </Card>

            {/* Ad slot */}
            <div className="w-full bg-muted/50 text-center py-2 text-xs text-muted-foreground rounded-lg mb-8">{/* Ad Slot: Below Tool */}</div>

            {/* How to Use */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>How to Use</h2>
              <ol className="space-y-3">
                {tool.howToUse.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">{i + 1}</span>
                    <span className="text-muted-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Benefits */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>Benefits</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>✅ 100% free to use</li>
                <li>✅ No file uploads — everything runs in your browser</li>
                <li>✅ Fast and instant processing</li>
                <li>✅ No registration or sign-up required</li>
                <li>✅ Works on mobile and desktop</li>
              </ul>
            </Card>

            {/* FAQ */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>Frequently Asked Questions</h2>
              <div className="space-y-4">
                {tool.faqs.map((faq, i) => (
                  <div key={i}>
                    <h3 className="font-semibold mb-1">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="w-full bg-muted/50 text-center py-20 text-xs text-muted-foreground rounded-lg">{/* Ad Slot: Sidebar */}</div>
          </aside>
        </div>

        {/* Related Tools */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Related Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map(t => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ToolPage;
