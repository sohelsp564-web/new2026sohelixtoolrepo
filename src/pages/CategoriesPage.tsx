import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";
import { categories, tools } from "@/data/tools";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CategoriesPage = () => {
  const { t, i18n } = useTranslation();
  const langPrefix = i18n.language && i18n.language !== "en" ? `/${i18n.language.split("-")[0]}` : "";

  return (
    <>
      <Helmet>
        <title>{t("all_categories")} — Sohelix Tools</title>
        <meta name="description" content={t("browse_tools_by_category")} />
        <link rel="canonical" href="https://sohelix.com/categories" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link to={`${langPrefix}/`} className="hover:text-foreground transition-colors">{t("home")}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{t("categories")}</span>
        </nav>
        <div className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl" style={{ fontFamily: 'Space Grotesk' }}>{t("all_categories")}</h1>
          <p className="text-muted-foreground mt-2">{t("browse_tools_by_category")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const IconComp = (Icons as any)[cat.icon] || Icons.Folder;
            const count = tools.filter(t => t.categorySlug === cat.slug).length;
            return (
              <motion.div key={cat.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`${langPrefix}/category/${cat.slug}`}>
                  <Card className="group p-6 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 border-transparent shadow-card">
                    <div className="flex items-center gap-4">
                      <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/8 text-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary-glow group-hover:text-primary-foreground transition-all duration-300">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>{cat.name}</h2>
                        <p className="text-sm text-muted-foreground">{count} {t("tools_count")} — {cat.description}</p>
                      </div>
                      <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
