import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { ChevronRight } from "lucide-react";
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

  const metaTitle =
    t?.meta_title ||
    tool.meta_title ||
    `${tool.name} | Sohelix`;

  const metaDescription =
    t?.meta_description ||
    tool.meta_description ||
    tool.description;

  const faqs = t?.faqs || tool.faqs;

  const toolPath = lang === "en" ? `/tools/${tool.slug}` : `/${lang}/tools/${tool.slug}`;
  const toolUrl = `https://tools.sohelix.com${toolPath}`;

  // Split description into paragraphs
  const descParagraphs = description
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description: description,
    url: toolUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const validFaqs = faqs.filter(f => f.q && f.a);
  const faqJsonLd = validFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://tools.sohelix.com/" },
      { "@type": "ListItem", position: 2, name: tool.category, item: `https://tools.sohelix.com/category/${tool.categorySlug}` },
      { "@type": "ListItem", position: 3, name: title, item: toolUrl },
    ],
  };

  const howToSteps = tool.howToUse.filter(Boolean);
  const howToJsonLd = howToSteps.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Use ${title}`,
    step: howToSteps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: text,
      text,
    })),
  } : null;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://tools.sohelix.com${toolPath}`} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tools.sohelix.com${toolPath}`} />
        <meta property="og:image" content="https://tools.sohelix.com/social-preview.webp" />
        <meta property="og:site_name" content="Sohelix Tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="https://tools.sohelix.com/social-preview.webp" />
        {/* hreflang tags for all supported languages */}
        {SUPPORTED_LANGS.map(l => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://tools.sohelix.com${l === "en" ? `/tools/${tool.slug}` : `/${l}/tools/${tool.slug}`}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`https://tools.sohelix.com/tools/${tool.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        {howToJsonLd && <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>}
      </Helmet>

      <div className="tp-page">
        <div className="tp-inner">

          {/* ── Language Selector ── */}
          <div className="tp-lang-row">
            {SUPPORTED_LANGS.map(l => (
              <Link
                key={l}
                to={l === "en" ? `/tools/${tool.slug}` : `/${l}/tools/${tool.slug}`}
                className={`tp-lang-pill${l === lang ? " active" : ""}`}
              >
                {LANG_NAMES[l]}
              </Link>
            ))}
          </div>

          {/* ── Breadcrumb ── */}
          <nav className="tp-breadcrumb" aria-label="breadcrumb">
            <Link to="/">Home</Link>
            <span className="tp-breadcrumb-sep">›</span>
            <Link to={`/category/${tool.categorySlug}`}>{tool.category}</Link>
            <span className="tp-breadcrumb-sep">›</span>
            <span className="tp-breadcrumb-current">{title}</span>
          </nav>

          {/* ══════════════════════════════════════════
              1. H1 → Rating + Share (hero top)
          ══════════════════════════════════════════ */}
          <motion.div className="tp-hero" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="tp-h1">{tool.h1Title || title}</h1>
            <div className="tp-hero-meta">
              <ToolRating />
              <ShareButtons title={title} />
            </div>
          </motion.div>

          {/* ── Ad Slot: Top Banner (existing) ── */}
          <AdSlot id="ad-top-banner" size="banner" className="mb-0" />

          {/* ── Empty ad space above tool ── */}
          <div className="tp-ad-space" aria-hidden="true" />

          {/* ══════════════════════════════════════════
              2. TOOL UI — primary focus
          ══════════════════════════════════════════ */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}>
            <div className="tp-tool-card">
              <ToolInterface slug={tool.slug} />
            </div>
          </motion.div>

          {/* ── Empty ad space below tool ── */}
          <div className="tp-ad-space" aria-hidden="true" />

          {/* ── Ad Slot: Below Tool (existing) ── */}
          <AdSlot id="ad-below-tool" size="banner" className="mb-0" />

          {/* ══════════════════════════════════════════
              3. DESCRIPTION CARD (below tool)
          ══════════════════════════════════════════ */}
          <div className="tp-card">
            <div className="tp-description-text">
              {descParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* ── How to Use ── */}
          <div className="tp-card">
            <h2 className="tp-card-title">How to Use</h2>
            <ol className="tp-steps">
              {tool.howToUse.map((step, i) => (
                <li key={i} className="tp-step">
                  <span className="tp-step-num">{i + 1}</span>
                  <span className="tp-step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Benefits ── */}
          <div className="tp-card">
            <h2 className="tp-card-title">Benefits</h2>
            <ul className="tp-benefits">
              {[
                "100% free to use",
                "No file uploads — everything runs in your browser",
                "Fast and instant processing",
                "No registration or sign-up required",
                "Works on mobile and desktop",
              ].map((b, i) => (
                <li key={i} className="tp-benefit">
                  <span className="tp-benefit-check">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ── H2 SEO Sections ── */}
          {tool.h2Sections && tool.h2Sections.length > 0 && (
            <div className="tp-card">
              {tool.h2Sections.map((section, i) => (
                <div key={i} className="tp-h2-section">
                  <h2 className="tp-h2-title">{section.title}</h2>
                  <p className="tp-h2-text">{section.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Empty ad space before FAQ ── */}
          <div className="tp-ad-space" aria-hidden="true" />

          {/* ── Ad Slot: Before FAQ (existing) ── */}
          <AdSlot id="ad-before-faq" size="banner" className="mb-0" />

          {/* ── FAQ ── */}
          {faqs && faqs.length > 0 && (
            <div className="tp-card tp-faq">
              <h2 className="tp-card-title">Frequently Asked Questions</h2>
              <Accordion type="multiple" defaultValue={["faq-0", "faq-1"]} className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{faq.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* ── Popular Searches ── */}
          {tool.keywords?.length > 0 && (
            <div className="tp-card">
              <h2 className="tp-card-title">Popular Searches</h2>
              <div className="tp-tags">
                {tool.keywords.map((k, i) => (
                  <span key={i} className="tp-tag">{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Empty ad space after popular searches ── */}
          <div className="tp-ad-space" aria-hidden="true" />

          {/* ── Related Tools ── */}
          {related.length > 0 && (
            <section>
              <h2 className="tp-card-title" style={{ marginBottom: "16px", marginTop: "8px" }}>Related Tools</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
};

export default ToolPage;
