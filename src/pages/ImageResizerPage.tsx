import { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getToolBySlug, getRelatedTools } from "@/data/tools";
import ToolInterface from "@/components/tools/ToolInterface";
import ShareButtons from "@/components/ShareButtons";
import ToolRating from "@/components/ToolRating";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { trackToolVisit } from "@/hooks/useRecentTools";

// ─── Premium SaaS styles scoped only to this page ──────────────────────────
const styles = `
  .ir-page {
    background: #f7f8fc;
    min-height: 100vh;
    font-family: 'Inter', 'Poppins', system-ui, sans-serif;
  }

  .ir-inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 20px 60px;
  }

  /* ── Hero / Tool Card ── */
  .ir-tool-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 36px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    margin-bottom: 28px;
  }

  /* ── Generic section card ── */
  .ir-card {
    background: #ffffff;
    border-radius: 14px;
    padding: 28px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    margin-bottom: 24px;
  }

  .ir-card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #222;
    margin-bottom: 16px;
  }

  /* ── Breadcrumb ── */
  .ir-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: #6b7280;
    padding: 24px 0 12px;
    flex-wrap: wrap;
  }
  .ir-breadcrumb a {
    color: #6b7280;
    text-decoration: none;
    transition: color 0.15s;
  }
  .ir-breadcrumb a:hover { color: #6c63ff; }
  .ir-breadcrumb-sep { color: #d1d5db; }
  .ir-breadcrumb-current { color: #374151; font-weight: 500; }

  /* ── Language tabs ── */
  .ir-lang-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px 0 4px;
  }
  .ir-lang-pill {
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
  .ir-lang-pill:hover { border-color: #6c63ff; color: #6c63ff; }
  .ir-lang-pill.active { background: #6c63ff; color: #fff; border-color: #6c63ff; }

  /* ── H1 area ── */
  .ir-h1 {
    font-size: clamp(1.5rem, 3vw, 2.1rem);
    font-weight: 800;
    color: #111827;
    margin: 0 0 8px;
    line-height: 1.25;
  }
  .ir-tagline {
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.7;
    margin: 10px 0 16px;
    max-width: 700px;
  }

  /* ── Ad slot placeholders ── */
  .ir-ad-slot {
    background: #f9fafb;
    border: 1px dashed #d1d5db;
    border-radius: 10px;
    min-height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    color: #d1d5db;
    margin-bottom: 24px;
  }

  /* ── How-to steps ── */
  .ir-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
  .ir-step { display: flex; align-items: flex-start; gap: 14px; }
  .ir-step-num {
    flex-shrink: 0;
    width: 34px; height: 34px;
    border-radius: 10px;
    background: #ede9ff;
    color: #6c63ff;
    font-weight: 700;
    font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center;
  }
  .ir-step-text { color: #4b5563; font-size: 0.95rem; padding-top: 6px; line-height: 1.6; }

  /* ── Benefits ── */
  .ir-benefits { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .ir-benefit { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: #4b5563; }
  .ir-benefit-check {
    flex-shrink: 0;
    width: 24px; height: 24px; border-radius: 8px;
    background: #ede9ff; color: #6c63ff;
    font-size: 0.75rem;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── Description card with highlight border ── */
  .ir-desc-block {
    border-left: 4px solid #6c63ff;
    padding-left: 16px;
    font-size: 0.95rem;
    line-height: 1.85;
    color: #374151;
  }
  .ir-desc-block p { margin: 0 0 12px; }
  .ir-desc-block p:last-child { margin-bottom: 0; }

  /* ── H2 sections ── */
  .ir-h2-section { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f3f4f6; }
  .ir-h2-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .ir-h2-title { font-size: 1rem; font-weight: 700; color: #1f2937; margin: 0 0 6px; }
  .ir-h2-text { font-size: 0.9rem; color: #6b7280; line-height: 1.7; margin: 0; }

  /* ── FAQ accordion override ── */
  .ir-faq [data-radix-accordion-trigger] {
    font-weight: 600;
    font-size: 0.95rem;
    color: #1f2937;
  }
  .ir-faq [data-state="open"] > button {
    color: #6c63ff;
  }

  /* ── Popular searches chips ── */
  .ir-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .ir-tag {
    background: #f1f3f9;
    border-radius: 20px;
    padding: 7px 14px;
    font-size: 0.82rem;
    color: #374151;
    cursor: default;
    transition: all 0.18s;
    border: 1px solid transparent;
  }
  .ir-tag:hover { background: #6c63ff; color: #fff; border-color: #6c63ff; }

  /* ── Related tools grid ── */
  .ir-related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 14px;
  }
  .ir-related-item {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    text-decoration: none;
    color: #222;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.875rem;
    font-weight: 500;
  }
  .ir-related-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(108,99,255,0.12);
    border-color: #6c63ff;
    color: #6c63ff;
  }
  .ir-related-icon {
    width: 36px; height: 36px;
    border-radius: 9px;
    background: #ede9ff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 1rem;
  }

  /* ── CTA Button ── */
  .ir-btn-primary {
    background: #6c63ff;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 12px 24px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.18s;
  }
  .ir-btn-primary:hover { background: #7c74ff; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ir-inner { padding: 0 15px 40px; }
    .ir-tool-card { padding: 20px; border-radius: 16px; }
    .ir-card { padding: 18px; }
    .ir-h1 { font-size: 1.4rem; }
    .ir-related-grid { grid-template-columns: 1fr 1fr; }
    .ir-tag { padding: 6px 11px; font-size: 0.78rem; }
  }

  @media (max-width: 480px) {
    .ir-related-grid { grid-template-columns: 1fr; }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .ir-related-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (min-width: 1025px) {
    .ir-related-grid { grid-template-columns: repeat(3, 1fr); }
  }
`;

// ─── Helpers ────────────────────────────────────────────────────────────────
const SUPPORTED_LANGS = ["en", "de", "es", "fr", "hi", "it", "pt"] as const;
const LANG_NAMES: Record<string, string> = {
  en: "English", de: "Deutsch", es: "Español",
  fr: "Français", hi: "हिन्दी", it: "Italiano", pt: "Português",
};

// ─── Page ────────────────────────────────────────────────────────────────────
const ImageResizerPage = () => {
  const tool = getToolBySlug("image-resizer");
  const related = useMemo(() => (tool ? getRelatedTools(tool) : []), []);

  useEffect(() => { trackToolVisit("image-resizer"); }, []);

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Tool Not Found</h1>
        <Link to="/" className="mt-6 inline-block text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const title        = tool.h1Title || tool.name;
  const description  = tool.description;
  const metaTitle    = tool.meta_title    || `${tool.name} | Sohelix`;
  const metaDesc     = tool.meta_description || tool.description;
  const faqs         = tool.faqs || [];
  const h2Sections   = tool.h2Sections || [];

  const toolPath = `/tools/${tool.slug}`;

  const jsonLd = {
    "@context": "https://schema.org", "@type": "SoftwareApplication",
    name: title, description, applicationCategory: "WebApplication",
    operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",         item: "https://tools.sohelix.com/" },
      { "@type": "ListItem", position: 2, name: tool.category,  item: `https://tools.sohelix.com/category/${tool.categorySlug}` },
      { "@type": "ListItem", position: 3, name: title,          item: `https://tools.sohelix.com${toolPath}` },
    ],
  };
  const howToJsonLd = {
    "@context": "https://schema.org", "@type": "HowTo",
    name: `How to Use ${title}`,
    step: tool.howToUse.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
  };

  return (
    <>
      <style>{styles}</style>

      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://tools.sohelix.com${toolPath}`} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tools.sohelix.com${toolPath}`} />
        <meta property="og:image" content="https://tools.sohelix.com/social-preview.webp" />
        <meta property="og:site_name" content="Sohelix Tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content="https://tools.sohelix.com/social-preview.webp" />
        {SUPPORTED_LANGS.map(l => (
          <link key={l} rel="alternate" hrefLang={l}
            href={`https://tools.sohelix.com${l === "en" ? `/tools/${tool.slug}` : `/${l}/tools/${tool.slug}`}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`https://tools.sohelix.com/tools/${tool.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
      </Helmet>

      <div className="ir-page">
        <div className="ir-inner">

          {/* ── Language Selector ── */}
          <div className="ir-lang-row">
            {SUPPORTED_LANGS.map(l => (
              <Link key={l}
                to={l === "en" ? `/tools/${tool.slug}` : `/${l}/tools/${tool.slug}`}
                className={`ir-lang-pill${l === "en" ? " active" : ""}`}
              >
                {LANG_NAMES[l]}
              </Link>
            ))}
          </div>

          {/* ── Breadcrumb ── */}
          <nav className="ir-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="ir-breadcrumb-sep">›</span>
            <Link to={`/category/${tool.categorySlug}`}>{tool.category}</Link>
            <span className="ir-breadcrumb-sep">›</span>
            <span className="ir-breadcrumb-current">{title}</span>
          </nav>

          {/* ── H1 + description ── */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="ir-h1">{title}</h1>
            <ToolRating />
            <p className="ir-tagline">{description}</p>
            <ShareButtons title={title} />
          </motion.div>

          {/* ── Ad Slot: Top Banner ── */}
          <div className="ir-ad-slot" aria-hidden="true">Advertisement</div>

          {/* ── Main Tool Card ── */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="ir-tool-card">
              <ToolInterface slug={tool.slug} />
            </div>
          </motion.div>

          {/* ── Ad Slot: Below Tool ── */}
          <div className="ir-ad-slot" aria-hidden="true">Advertisement</div>

          {/* ── How to Use ── */}
          <div className="ir-card">
            <h2 className="ir-card-title">How to Use</h2>
            <ol className="ir-steps">
              {tool.howToUse.map((step, i) => (
                <li key={i} className="ir-step">
                  <span className="ir-step-num">{i + 1}</span>
                  <span className="ir-step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Benefits ── */}
          <div className="ir-card">
            <h2 className="ir-card-title">Benefits</h2>
            <ul className="ir-benefits">
              {[
                "100% free to use",
                "No file uploads — everything runs in your browser",
                "Fast and instant processing",
                "No registration or sign-up required",
                "Works on mobile and desktop",
              ].map((b, i) => (
                <li key={i} className="ir-benefit">
                  <span className="ir-benefit-check">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ── SEO Description (H2 Sections) ── */}
          {h2Sections.length > 0 && (
            <div className="ir-card">
              <div className="ir-desc-block">
                {h2Sections.map((section, i) => (
                  <div key={i} className="ir-h2-section">
                    <h2 className="ir-h2-title">{section.title}</h2>
                    <p className="ir-h2-text">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Ad Slot: Before FAQ ── */}
          <div className="ir-ad-slot" aria-hidden="true">Advertisement</div>

          {/* ── FAQ ── */}
          {faqs.length > 0 && (
            <div className="ir-card ir-faq">
              <h2 className="ir-card-title">Frequently Asked Questions</h2>
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
            <div className="ir-card">
              <h2 className="ir-card-title">Popular Searches</h2>
              <div className="ir-tags">
                {tool.keywords.map((k, i) => (
                  <span key={i} className="ir-tag">{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Ad Slot: After Popular Searches ── */}
          <div className="ir-ad-slot" aria-hidden="true">Advertisement</div>

          {/* ── Related Tools ── */}
          {related.length > 0 && (
            <section>
              <h2 className="ir-card-title" style={{ marginBottom: "16px" }}>Related Tools</h2>
              <div className="ir-related-grid">
                {related.map((rt) => (
                  <Link key={rt.slug} to={`/tools/${rt.slug}`} className="ir-related-item">
                    <span className="ir-related-icon">🖼</span>
                    {rt.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
};

export default ImageResizerPage;
