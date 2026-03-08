import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug, getToolsByCategory } from "@/data/tools";
import ToolCard from "@/components/ToolCard";
import { Helmet } from "react-helmet-async";

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
        <link rel="canonical" href={`https://sohelix.com/category/${category.slug}`} />
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2 md:text-4xl" style={{ fontFamily: 'Space Grotesk' }}>{category.name}</h1>
        <p className="text-muted-foreground mb-8 text-lg">{category.description}</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
