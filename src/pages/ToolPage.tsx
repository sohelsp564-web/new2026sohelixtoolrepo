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

// ─── Scoped styles matching Image Resizer layout ──────────────────────────────
const toolPageStyles = `
  .tp-page {
    background: #f7f8fc;
    min-height: 100vh;
    font-family: 'Inter', 'Poppins', system-ui, sans-serif;
  }

  .tp-inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 20px 60px;
  }

  /* ── Language tabs ── */
  .tp-lang-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px 0 4px;
  }
  .tp-lang-pill {
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.15s;
    border: 1px solid #e5e7eb;
    color: #6b7280;
    background: #fff;
  }
  .tp-lang-pill:hover { border-color: #6c63ff; color: #6c63ff; }
  .tp-lang-pill.active { background: #6c63ff; color: #fff; border-color: #6c63ff; }

  /* ── Breadcrumb ── */
  .tp-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: #6b7280;
    padding: 16px 0 8px;
    flex-wrap: wrap;
  }
  .tp-breadcrumb a { color: #6b7280; text-decoration: none; transition: color 0.15s; }
  .tp-breadcrumb a:hover { color: #6c63ff; }
  .tp-breadcrumb-sep { color: #d1d5db; }
  .tp-breadcrumb-current { color: #374151; font-weight: 500; }

  /* ── H1 ── */
  .tp-h1 {
    font-size: clamp(1.5rem, 3vw, 2.1rem);
    font-weight: 800;
    color: #111827;
    margin: 0 0 6px;
    line-height: 1.25;
  }

  /* ── Hero block ── */
  .tp-hero { padding: 20px 0 12px; }
  .tp-hero-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }

  /* ── Empty ad spaces ── */
  .tp-ad-space {
    margin: 20px 0;
    min-height: 100px;
    width: 100%;
  }

  /* ── Tool card ── */
  .tp-tool-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 36px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  }

  /* ── Section cards ── */
  .tp-card {
    background: #ffffff;
    border-radius: 14px;
    padding: 28px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    margin-top: 24px;
  }
  .tp-card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #222;
    margin: 0 0 16px;
  }

  /* ── Description block ── */
  .tp-description-text {
    font-size: 0.95rem;
    line-height: 1.85;
    color: #374151;
    border-left: 4px solid #6c63ff;
    padding-left: 16px;
  }
  .tp-description-text p { margin: 0 0 14px; }
  .tp-description-text p:last-child { margin-bottom: 0; }

  /* ── How-to steps ── */
  .tp-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
  .tp-step { display: flex; align-items: flex-start; gap: 14px; }
  .tp-step-num {
    flex-shrink: 0;
    width: 34px; height: 34px;
    border-radius: 10px;
    background: #ede9ff;
    color: #6c63ff;
    font-weight: 700;
    font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center;
  }
  .tp-step-text { color: #4b5563; font-size: 0.95rem; padding-top: 6px; line-height: 1.6; }

  /* ── Benefits ── */
  .tp-benefits { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .tp-benefit { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: #4b5563; }
  .tp-benefit-check {
    flex-shrink: 0;
    width: 24px; height: 24px; border-radius: 8px;
    background: #ede9ff; color: #6c63ff;
    font-size: 0.75rem;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── H2 SEO sections ── */
  .tp-h2-section { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f3f4f6; }
  .tp-h2-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .tp-h2-title { font-size: 1rem; font-weight: 700; color: #1f2937; margin: 0 0 6px; }
  .tp-h2-text { font-size: 0.9rem; color: #6b7280; line-height: 1.7; margin: 0; }

  /* ── FAQ ── */
  .tp-faq [data-state="open"] > button { color: #6c63ff; }

  /* ── Popular searches chips ── */
  .tp-tags { display: flex; flex-wrap: wrap; gap: 10px; }
  .tp-tag {
    background: #f3f4f8;
    border-radius: 999px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 500;
    color: #333333;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.25s ease;
    border: 1px solid transparent;
    display: inline-block;
    line-height: 1;
    user-select: none;
  }
  .tp-tag:hover {
    background: #6c63ff;
    color: #ffffff;
    border-color: #6c63ff;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(108, 99, 255, 0.25);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .tp-inner { padding: 0 15px 40px; }
    .tp-tool-card { padding: 20px; border-radius: 16px; }
    .tp-card { padding: 18px; }
    .tp-h1 { font-size: 1.4rem; }
    .tp-tag { padding: 8px 14px; font-size: 12px; }
    .tp-tags { gap: 8px; }
    .tp-ad-space { min-height: 80px; }
  }

  /* ══════════════════════════════════════════
     DARK MODE OVERRIDES
  ══════════════════════════════════════════ */

  /* Page background */
  .dark .tp-page {
    background: #0F0F0F;
  }

  /* Tool card */
  .dark .tp-tool-card {
    background: #181818;
    border: 1px solid #2A2A2A;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  /* Section cards */
  .dark .tp-card {
    background: #181818;
    border: 1px solid #2A2A2A;
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }

  /* Headings */
  .dark .tp-h1 { color: #FFFFFF; }
  .dark .tp-card-title { color: #FFFFFF; }

  /* Breadcrumb */
  .dark .tp-breadcrumb { color: #999999; }
  .dark .tp-breadcrumb a { color: #999999; }
  .dark .tp-breadcrumb a:hover { color: #7c6fff; }
  .dark .tp-breadcrumb-sep { color: #444444; }
  .dark .tp-breadcrumb-current { color: #CCCCCC; }

  /* Language pills */
  .dark .tp-lang-pill {
    background: #1E1E1E;
    color: #CCCCCC;
    border-color: #333333;
  }
  .dark .tp-lang-pill:hover { border-color: #7c6fff; color: #7c6fff; }
  .dark .tp-lang-pill.active { background: #6c63ff; color: #fff; border-color: #6c63ff; }

  /* Description text */
  .dark .tp-description-text { color: #CCCCCC; }
  .dark .tp-description-text p { color: #CCCCCC; }

  /* How-to steps */
  .dark .tp-step-text { color: #CCCCCC; }
  .dark .tp-step-num {
    background: #2A2A2A;
    color: #7c6fff;
  }

  /* Benefits */
  .dark .tp-benefit { color: #CCCCCC; }
  .dark .tp-benefit-check {
    background: #2A2A2A;
    color: #7c6fff;
  }

  /* H2 SEO sections */
  .dark .tp-h2-section { border-bottom-color: #2A2A2A; }
  .dark .tp-h2-title { color: #FFFFFF; }
  .dark .tp-h2-text { color: #999999; }

  /* FAQ */
  .dark .tp-faq [role="button"],
  .dark .tp-faq button {
    color: #CCCCCC;
  }
  .dark .tp-faq [data-state="open"] > button { color: #7c6fff; }
  .dark .tp-faq [data-radix-collection-item] { border-color: #2A2A2A; }
  .dark .tp-faq .border-b { border-color: #2A2A2A; }
  .dark .tp-faq p { color: #CCCCCC !important; }

  /* Popular searches tags */
  .dark .tp-tag {
    background: #222222;
    color: #CCCCCC;
    border-color: #2A2A2A;
  }
  .dark .tp-tag:hover {
    background: #6c63ff;
    color: #ffffff;
    border-color: #6c63ff;
  }

  /* Input fields inside tool cards (dark mode) */
  .dark .tp-tool-card input,
  .dark .tp-tool-card textarea,
  .dark .tp-tool-card select,
  .dark .tp-tool-card input[type="date"],
  .dark .tp-tool-card input[type="time"],
  .dark .tp-tool-card input[type="text"],
  .dark .tp-tool-card input[type="number"],
  .dark .tp-tool-card input[type="email"] {
    background: #1E1E1E !important;
    color: #FFFFFF !important;
    border: 1px solid #333333 !important;
  }
  .dark .tp-tool-card input::placeholder,
  .dark .tp-tool-card textarea::placeholder {
    color: #888888 !important;
  }

  /* Result / example sections inside tool cards */
  .dark .tp-tool-card [class*="result"],
  .dark .tp-tool-card [class*="output"],
  .dark .tp-tool-card [class*="example"],
  .dark .tp-tool-card [class*="preview"] {
    background: #1A1A1A;
    border-color: #2A2A2A;
    color: #CCCCCC;
  }
`;

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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://tools.sohelix.com/" },
      { "@type": "ListItem", position: 2, name: tool.category, item: `https://tools.sohelix.com/category/${tool.categorySlug}` },
      { "@type": "ListItem", position: 3, name: title, item: `https://tools.sohelix.com${toolPath}` },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Use ${title}`,
    step: tool.howToUse.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };

  return (
    <>
      <style>{toolPageStyles}</style>

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
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
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
          <nav className="tp-breadcrumb" aria-label="Breadcrumb">
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
              <Accordion type="single" collapsible className="w-full">
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
