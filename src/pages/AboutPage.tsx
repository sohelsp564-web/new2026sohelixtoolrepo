import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Globe } from "lucide-react";

const AboutPage = () => (
  <>
    <Helmet>
      <title>About — Sohelix Tools</title>
      <meta name="description" content="Learn about Sohelix Tools, a free platform providing browser-based utilities for images, PDFs, text, developer tools, and calculators." />
      <link rel="canonical" href="https://tools.sohelix.com/about" />
    </Helmet>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>About Sohelix Tools</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-6">Sohelix Tools is a free platform providing browser-based utilities for images, PDFs, text processing, developer tools, SEO tools, and calculators. All tools run directly in your browser to protect your privacy — your files never leave your device.</p>
        <div className="grid gap-4 sm:grid-cols-3 my-8">
          {[
            { icon: Shield, title: "Private & Secure", desc: "No data collection or file uploads" },
            { icon: Zap, title: "Fast Processing", desc: "Instant client-side processing" },
            { icon: Globe, title: "Completely Free", desc: "No registration or payments required" },
          ].map((b, i) => (
            <Card key={i} className="p-5 text-center">
              <b.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1" style={{ fontFamily: 'Space Grotesk' }}>{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground">We believe online tools should be simple, fast, and private. That's why every tool on Sohelix runs entirely in your web browser using modern JavaScript APIs. No server processing, no file uploads, no tracking.</p>
        <p className="text-muted-foreground mt-4">Have questions or feedback? Reach out to us at <a href="mailto:sohel.contact@gmail.com" className="text-primary hover:underline">sohel.contact@gmail.com</a>.</p>
      </div>
    </div>
  </>
);

export default AboutPage;
