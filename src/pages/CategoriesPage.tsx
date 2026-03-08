import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";
import { categories, tools } from "@/data/tools";
import { Helmet } from "react-helmet-async";

const CategoriesPage = () => (
  <>
    <Helmet>
      <title>All Tool Categories — Sohelix Tools</title>
      <meta name="description" content="Browse all free online tool categories at Sohelix Tools." />
    </Helmet>
    <div className="container mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Categories</span>
      </nav>
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Space Grotesk' }}>All Categories</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(cat => {
          const IconComp = (Icons as any)[cat.icon] || Icons.Folder;
          const count = tools.filter(t => t.categorySlug === cat.slug).length;
          return (
            <Link key={cat.slug} to={`/category/${cat.slug}`}>
              <Card className="group p-6 transition-all hover:shadow-md hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk' }}>{cat.name}</h2>
                    <p className="text-sm text-muted-foreground">{count} tools — {cat.description}</p>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-primary" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  </>
);

export default CategoriesPage;
