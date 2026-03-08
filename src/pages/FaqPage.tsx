import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What is Sohelix Tools?", a: "Sohelix Tools is a collection of free browser-based tools for images, PDFs, text processing, developer utilities, SEO, and calculations. All tools run directly in your browser." },
  { q: "Do tools upload my files?", a: "No. All tools run locally in your browser. Your files are never uploaded to any server." },
  { q: "Are the tools free?", a: "Yes. All tools on Sohelix Tools are completely free to use with no registration required." },
  { q: "Do I need to create an account?", a: "No. You can use all tools without signing up or creating an account." },
  { q: "Is my data safe?", a: "Yes. Since all processing happens locally in your browser, your data never leaves your device." },
  { q: "Can I suggest a new tool?", a: "Yes! Visit our Request Tool page to suggest a tool you'd like to see on the platform." },
  { q: "What browsers are supported?", a: "Sohelix Tools works on all modern browsers including Chrome, Firefox, Safari, and Edge." },
  { q: "Are the results accurate?", a: "We strive for accuracy, but results are provided for informational purposes. Please verify outputs before using them in critical applications." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const FaqPage = () => (
  <>
    <Helmet>
      <title>FAQ — Sohelix Tools</title>
      <meta name="description" content="Frequently asked questions about Sohelix Tools. Learn how our free browser-based tools work." />
      <link rel="canonical" href="https://sohelix.com/faq" />
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </>
);

export default FaqPage;
