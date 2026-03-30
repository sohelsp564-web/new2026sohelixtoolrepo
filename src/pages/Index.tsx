import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Shield, Zap, Globe, Lock, ChevronRight, ArrowRight, Sparkles, Command, Folder } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ToolCard from "@/components/ToolCard";
import { tools, categories, searchTools, getToolBySlug } from "@/data/tools";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useRecentTools } from "@/hooks/useRecentTools";
import { getIconComponent } from "@/lib/iconMap";

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchTools>>([]);
  const navigate = useNavigate();
  const recentSlugs = useRecentTools();
  const recentTools = recentSlugs.map(s => getToolBySlug(s)).filter(Boolean);
  const popularTools = tools.filter(t => t.isPopular);
  const trendingTools = tools.filter(t => t.isTrending);
  const newTools = tools.filter(t => t.isNew);

  const handleSearch = (q: string) => {
    setQuery(q);
    setResults(q.length > 1 ? searchTools(q) : []);
  };

  const benefits = [
    { icon: Shield, title: "100% Browser Processing", desc: "All tools run locally. Your files never leave your device.", color: "from-primary/10 to-primary/5" },
    { icon: Lock, title: "No Upload Required", desc: "Complete privacy. Zero data collection or file uploads.", color: "from-primary-glow/10 to-primary-glow/5" },
    { icon: Zap, title: "Fast & Secure", desc: "Instant processing with no server delays.", color: "from-accent/10 to-accent/5" },
    { icon: Globe, title: "Completely Free", desc: "All tools are free to use, forever. No registration.", color: "from-accent/10 to-primary/5" },
  ];

  return (
    <>
      <Helmet>
        <title>50+ Free Online Tools – PDF, Image, Text & Developer Tools | Sohelix</title>
        <meta name="description" content="50+ free online tools for images, PDFs, text, developers and calculations. All tools run directly in your browser. No uploads. No registration." />
        <link rel="canonical" href="https://tools.sohelix.com/" />
        <meta property="og:title" content="Sohelix Tools — Free Online Tools" />
        <meta property="og:description" content="Free online tools that run in your browser. No uploads, no registration." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tools.sohelix.com/" />
        <meta property="og:image" content="https://tools.sohelix.com/social-preview.webp" />
        <meta property="og:site_name" content="Sohelix Tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://tools.sohelix.com/social-preview.webp" />
        <meta name="keywords" content="free online tools, browser tools, image tools, PDF tools, developer tools, client-side tools" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-hero-gradient">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/15 px-4 py-1.5 text-sm text-primary font-medium mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" />
              50+ Free Browser Tools
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
              All-in-One Free Online Tools for{" "}
              <span className="text-gradient">Images, PDFs, Text & Developers</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
              Fast, secure browser tools. No uploads. No registration required.
            </p>

            {/* Search bar */}
            <div className="relative mx-auto mt-10 max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-14 w-full rounded-2xl pl-12 pr-28 text-base shadow-elevated border-border/50 bg-card focus:shadow-glow focus:border-primary/30 transition-all"
                placeholder="Search for a tool (e.g. image compressor, JSON formatter)"
                value={query}
                onChange={e => handleSearch(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/80 rounded-lg px-2.5 py-1.5 border border-border/50">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
              {results.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-2xl border border-border bg-card shadow-elevated z-10 max-h-80 overflow-y-auto">
                  {results.map(t => (
                    <button key={t.slug} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors first:rounded-t-2xl last:rounded-b-2xl" onClick={() => { navigate(`/tools/${t.slug}`); setQuery(""); setResults([]); }}>
                      <span className="font-medium">{t.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{t.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["Image Compressor", "JSON Formatter", "QR Code", "Password Generator"].map(name => {
                const tool = tools.find(t => t.name.includes(name.split(" ")[0]));
                return tool ? (
                  <Link key={name} to={`/tools/${tool.slug}`} className="rounded-full bg-muted/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    {name}
                  </Link>
                ) : null;
              })}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Ad Slot: Homepage Top Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <AdSlot id="ad-homepage-banner" size="banner" />
      </div>

      {/* Recently Used Tools */}
      {recentTools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 pb-0">
          <div className="mb-10">
            <h2 className="text-2xl font-bold md:text-3xl">Recently Used</h2>
            <p className="text-sm text-muted-foreground mt-1.5">Pick up where you left off</p>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentTools.map((t, i) => <ToolCard key={t!.slug} tool={t!} index={i} />)}
          </div>
        </section>
      )}

      {/* Tool Categories SEO */}
     <section className="mx-auto max-w-5xl px-4 py-16 text-center">
  <h2 className="text-2xl font-bold mb-4">
    Explore Our Free Online Tool Categories
  </h2>

  <p className="text-muted-foreground leading-relaxed">
    Our free online tools include powerful PDF tools, image tools,
    developer utilities, text tools, SEO tools and calculator tools.
    These browser-based tools help you complete everyday tasks quickly
    without installing any software.
  </p>
      </section>

      {/* Popular Tools */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Popular Tools</h2>
            <p className="text-sm text-muted-foreground mt-1.5">Most used tools by our community</p>
          </div>
          <Link to="/categories" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popularTools.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold md:text-3xl">Browse by Category</h2>
          <p className="text-sm text-muted-foreground mt-1.5">Find the right tool for your task</p>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat, i) => {
            const IconComp = getIconComponent(cat.icon, Folder);
            const count = tools.filter(t => t.categorySlug === cat.slug).length;
            return (
              <motion.div key={cat.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={`/category/${cat.slug}`}>
                  <Card className="group p-4 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 border-transparent shadow-card">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/8 text-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary-glow group-hover:text-primary-foreground transition-all duration-300">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground">{count} tools</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold md:text-3xl">Trending Tools</h2>
          <p className="text-sm text-muted-foreground mt-1.5">What's popular right now</p>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trendingTools.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
        </div>
      </section>

      {/* Recently Added */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold md:text-3xl">Recently Added</h2>
          <p className="text-sm text-muted-foreground mt-1.5">Fresh tools just added to the collection</p>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {newTools.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
        </div>
      </section>

  {/* SEO Content Section */}
   <section className="mx-auto max-w-4xl px-4 py-16 text-center">
  <h2 className="text-2xl font-bold mb-4">
    Free Online Tools for Everyday Tasks
  </h2>

  <p className="text-muted-foreground leading-relaxed">
    Sohelix Tools provides a powerful collection of free online tools
    including PDF tools, image tools, developer tools, text utilities,
    calculators and QR code generators. All tools run directly in your
    browser without uploading files, ensuring complete privacy and security.

    Whether you need to compress images, format JSON, convert PDFs,
    generate QR codes or analyze text, Sohelix offers fast and secure
    browser-based tools that work on any device.
  </p>
    </section>

      {/* Why Sohelix */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold md:text-3xl">Why Sohelix Tools?</h2>
          <p className="text-muted-foreground mt-2">Built for privacy, speed, and simplicity</p>
        </div>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="p-6 text-center h-full shadow-card border-transparent hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${b.color} text-primary`}>
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;
