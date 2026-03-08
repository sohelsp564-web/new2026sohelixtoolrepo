import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Shield, Zap, Globe, Lock, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ToolCard from "@/components/ToolCard";
import { tools, categories, searchTools } from "@/data/tools";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchTools>>([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const langPrefix = i18n.language && i18n.language !== "en" ? `/${i18n.language.split("-")[0]}` : "";

  const popularTools = tools.filter(t => t.isPopular);
  const trendingTools = tools.filter(t => t.isTrending);
  const newTools = tools.filter(t => t.isNew);

  const handleSearch = (q: string) => {
    setQuery(q);
    setResults(q.length > 1 ? searchTools(q) : []);
  };

  const benefits = [
    { icon: Shield, title: t("benefit_browser"), desc: t("benefit_browser_desc"), color: "from-blue-500/10 to-blue-600/5" },
    { icon: Lock, title: t("benefit_privacy"), desc: t("benefit_privacy_desc"), color: "from-purple-500/10 to-purple-600/5" },
    { icon: Zap, title: t("benefit_fast"), desc: t("benefit_fast_desc"), color: "from-amber-500/10 to-amber-600/5" },
    { icon: Globe, title: t("benefit_free"), desc: t("benefit_free_desc"), color: "from-emerald-500/10 to-emerald-600/5" },
  ];

  return (
    <>
      <Helmet>
        <title>Sohelix Tools — {t("home_title")}</title>
        <meta name="description" content={t("home_subtitle")} />
        <link rel="canonical" href="https://sohelix.com/tools" />
        <meta property="og:title" content={`Sohelix Tools — ${t("home_title")}`} />
        <meta property="og:description" content={t("home_subtitle")} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-hero-gradient">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/15 px-4 py-1.5 text-sm text-primary font-medium mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t("free_private")}
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1.1]" style={{ fontFamily: 'Space Grotesk' }}>
              {t("home_title")}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t("home_subtitle")}
            </p>
            <div className="relative mx-auto mt-10 max-w-xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-14 rounded-2xl pl-12 text-base shadow-elevated border-border/50 bg-card focus:shadow-glow focus:border-primary/30 transition-all"
                placeholder={t("search_for_tool")}
                value={query}
                onChange={e => handleSearch(e.target.value)}
              />
              {results.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-2xl border border-border bg-card shadow-elevated z-10 max-h-80 overflow-y-auto overflow-hidden">
                  {results.map(tool => (
                    <button key={tool.slug} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors" onClick={() => { navigate(`${langPrefix}/tools/${tool.slug}`); setQuery(""); setResults([]); }}>
                      <span className="font-medium">{tool.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{tool.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["Image Compressor", "JSON Formatter", "QR Code"].map(name => {
                const tool = tools.find(t => t.name.includes(name.split(" ")[0]));
                return tool ? (
                  <Link key={name} to={`${langPrefix}/tools/${tool.slug}`} className="rounded-full bg-muted/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    {name}
                  </Link>
                ) : null;
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{t("popular_tools")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("popular_tools_desc")}</p>
          </div>
          <Link to={`${langPrefix}/categories`} className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            {t("view_all")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularTools.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{t("browse_by_category")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("browse_by_category_desc")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat, i) => {
            const IconComp = (Icons as any)[cat.icon] || Icons.Folder;
            const count = tools.filter(t => t.categorySlug === cat.slug).length;
            return (
              <motion.div key={cat.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={`${langPrefix}/category/${cat.slug}`}>
                  <Card className="group p-4 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 border-transparent shadow-card">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/8 text-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary-glow group-hover:text-primary-foreground transition-all duration-300">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm" style={{ fontFamily: 'Space Grotesk' }}>{cat.name}</h3>
                        <p className="text-xs text-muted-foreground">{count} {t("tools_count")}</p>
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
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{t("trending_tools")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("trending_tools_desc")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingTools.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
        </div>
      </section>

      {/* Recently Added */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{t("recently_added")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("recently_added_desc")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newTools.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
        </div>
      </section>

      {/* Why Sohelix */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold md:text-3xl" style={{ fontFamily: 'Space Grotesk' }}>{t("why_sohelix")}</h2>
          <p className="text-muted-foreground mt-2">{t("why_sohelix_desc")}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="p-6 text-center h-full shadow-card border-transparent hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${b.color} text-primary`}>
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>{b.title}</h3>
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
