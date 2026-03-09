import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, getToolsByCategory } from "@/data/tools";
import ToolCard from "@/components/ToolCard";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || "");
  const categoryTools = getToolsByCategory(slug || "");

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Category Not Found</h1>
        <Link to="/" className="mt-6 inline-block text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} — Free Online Tools | Sohelix</title>
        <meta name="description" content={category.description} />
        <link rel="canonical" href={`https://tools.sohelix.com/category/${category.slug}`} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold mb-3 md:text-4xl" style={{ fontFamily: 'Space Grotesk' }}>{category.name}</h1>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">{category.description}</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
