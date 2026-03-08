import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Globe } from "lucide-react";

const AboutPage = () => (
  <>
    <Helmet>
      <title>About — Sohelix Tools</title>
      <meta name="description" content="Learn about Sohelix Tools, free online tools that run in your browser." />
    </Helmet>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>About Sohelix Tools</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-6">Sohelix Tools is a collection of free online utilities designed to help you with everyday tasks. All tools run 100% in your browser — your files never leave your device.</p>
        <div className="grid gap-4 sm:grid-cols-3 my-8">
          {[
            { icon: Shield, title: "Private", desc: "No data collection or uploads" },
            { icon: Zap, title: "Fast", desc: "Instant client-side processing" },
            { icon: Globe, title: "Free", desc: "No registration or payments" },
          ].map((b, i) => (
            <Card key={i} className="p-5 text-center">
              <b.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1" style={{ fontFamily: 'Space Grotesk' }}>{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground">We believe online tools should be simple, fast, and private. That's why every tool on Sohelix runs entirely in your web browser using modern JavaScript APIs. No server processing, no file uploads, no tracking.</p>
      </div>
    </div>
  </>
);

export default AboutPage;
