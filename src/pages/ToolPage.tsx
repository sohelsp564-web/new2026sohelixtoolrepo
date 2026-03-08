import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getToolBySlug, getRelatedTools } from "@/data/tools";
import AdSlot from "@/components/AdSlot";
import ToolCard from "@/components/ToolCard";
import ToolRating from "@/components/ToolRating";
import ShareButtons from "@/components/ShareButtons";
import ToolInterface from "@/components/tools/ToolInterface";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useToolTranslation, SUPPORTED_LANGS, LANG_NAMES, isValidLang, type SupportedLang } from "@/hooks/useToolTranslation";
import { trackToolVisit } from "@/hooks/useRecentTools";

const ToolPage = () => {
  const { slug, lang: langParam } = useParams<{ slug: string; lang?: string }>();
  const lang: SupportedLang = langParam && isValidLang(langParam) ? langParam : "en";
  const tool = getToolBySlug(slug || "");
  const t = useToolTranslation(slug || "", lang);

  const related = useMemo(() => (tool ? getRelatedTools(tool) : []), [tool?.slug, tool?.categorySlug]);

  // Track tool visit for "Recently Used" feature
  useEffect(() => {
    if (tool?.slug) trackToolVisit(tool.slug);
  }, [tool?.slug]);

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Tool Not Found</h1>
        <p className="mt-4 text-muted-foreground">The tool you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  // Use translated content or fallback to tool data
  const title = t?.title || tool.name;
  const description = t?.description || tool.description;
  const metaTitle = t?.meta_title || `${tool.name} — Free Online Tool | Sohelix Tools`;
  const metaDescription = t?.meta_description || tool.description;
  const faqs = t?.faqs || tool.faqs;

  const toolPath = lang === "en" ? `/tools/${tool.slug}` : `/${lang}/tools/${tool.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description: description,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
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
      { "@type": "ListItem", position: 3, name: title, item: `https://sohelix.com${toolPath}` },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://sohelix.com${toolPath}`} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {/* hreflang tags for all supported languages */}
        {SUPPORTED_LANGS.map(l => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://sohelix.com${l === "en" ? `/tools/${tool.slug}` : `/${l}/tools/${tool.slug}`}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`https://sohelix.com/tools/${tool.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Language Selector */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {SUPPORTED_LANGS.map(l => (
            <Link
              key={l}
              to={l === "en" ? `/tools/${tool.slug}` : `/${l}/tools/${tool.slug}`}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                l === lang
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {LANG_NAMES[l]}
            </Link>
          ))}
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/category/${tool.categorySlug}`} className="hover:text-foreground transition-colors">{tool.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{title}</span>
        </nav>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold mb-2 md:text-4xl" style={{ fontFamily: 'Space Grotesk' }}>{title}</h1>
          <ToolRating />
          <p className="text-muted-foreground mb-4 mt-3 text-lg leading-relaxed max-w-2xl">{description}</p>
          <ShareButtons title={title} />
          <div className="mb-10" />
        </motion.div>

        {/* Ad Slot 1: Top Banner */}
        <AdSlot id="ad-top-banner" size="banner" className="mb-8" />

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            {/* Tool Interface */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card className="p-6 mb-8 shadow-card border-transparent rounded-2xl">
                <ToolInterface slug={tool.slug} />
              </Card>
            </motion.div>

            {/* Ad Slot 2: Below Tool Interface */}
            <AdSlot id="ad-below-tool" size="banner" className="mb-8" />

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

            {/* Ad Slot 3: Before FAQ */}
            <AdSlot id="ad-before-faq" size="banner" className="mb-6" />

            {/* FAQ */}
            <Card className="p-6 mb-6 shadow-card border-transparent rounded-2xl" itemScope itemType="https://schema.org/FAQPage">
              <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Space Grotesk' }}>Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base">
                      <span itemProp="name">{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                      <p itemProp="text" className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
