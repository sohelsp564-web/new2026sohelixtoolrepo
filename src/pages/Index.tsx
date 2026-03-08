import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Shield, Zap, Globe, Lock, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ToolCard from "@/components/ToolCard";
import { tools, categories, searchTools } from "@/data/tools";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchTools>>([]);
  const navigate = useNavigate();

  const popularTools = tools.filter(t => t.isPopular);
  const trendingTools = tools.filter(t => t.isTrending);
  const newTools = tools.filter(t => t.isNew);

  const handleSearch = (q: string) => {
    setQuery(q);
    setResults(q.length > 1 ? searchTools(q) : []);
  };

  const benefits = [
    { icon: Shield, title: "100% Browser Processing", desc: "All tools run locally. Your files never leave your device." },
    { icon: Lock, title: "No Upload Required", desc: "Complete privacy. Zero data collection or file uploads." },
    { icon: Zap, title: "Fast & Secure", desc: "Instant processing with no server delays." },
    { icon: Globe, title: "Completely Free", desc: "All tools are free to use, forever. No registration." },
  ];

  return (
    <>
      <Helmet>
        <title>Sohelix Tools — Free Online Tools for Images, PDFs, Text & More</title>
        <meta name="description" content="Free online tools for images, PDFs, text, developers and calculations. All tools run directly in your browser. No uploads. No registration." />
        <link rel="canonical" href="https://sohelix.com/tools" />
        <meta property="og:title" content="Sohelix Tools — Free Online Tools" />
        <meta property="og:description" content="Free online tools that run in your browser. No uploads, no registration." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Ad placement: Header Banner */}
      <div className="w-full bg-muted/50 text-center py-2 text-xs text-muted-foreground">{/* Ad Slot: Header Banner */}</div>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'Space Grotesk' }}>
              Free Online Tools for{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Images, PDFs, Text, Developers</span>
              {" "}and Calculations
            </h1>
            <p className="mt-5 text-lg text-muted-foreground md:text-xl">All tools run directly in your browser. No uploads. No registration required.</p>
            <div className="relative mx-auto mt-8 max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-14 rounded-2xl pl-12 text-base shadow-lg shadow-primary/5 border-primary/20" placeholder="Search for a tool..." value={query} onChange={e => handleSearch(e.target.value)} />
              {results.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-xl border border-border bg-card shadow-xl z-10 max-h-80 overflow-y-auto">
                  {results.map(t => (
                    <button key={t.slug} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors" onClick={() => { navigate(`/tools/${t.slug}`); setQuery(""); setResults([]); }}>
                      <span className="font-medium">{t.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{t.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>🔥 Popular Tools</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularTools.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>📂 Tools by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map(cat => {
            const IconComp = (Icons as any)[cat.icon] || Icons.Folder;
            const count = tools.filter(t => t.categorySlug === cat.slug).length;
            return (
              <Link key={cat.slug} to={`/category/${cat.slug}`}>
                <Card className="group p-5 transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk' }}>{cat.name}</h3>
                      <p className="text-xs text-muted-foreground">{count} tools</p>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>📈 Trending Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingTools.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* Recently Added */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>🆕 Recently Added</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newTools.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* Why Sohelix */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10" style={{ fontFamily: 'Space Grotesk' }}>Why Sohelix Tools?</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="p-6 text-center h-full">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ad placement: Footer */}
      <div className="w-full bg-muted/50 text-center py-2 text-xs text-muted-foreground">{/* Ad Slot: Footer Banner */}</div>
    </>
  );
};

export default Index;
