import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getBlogPostBySlug } from "@/data/blogPosts";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || "");

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Space Grotesk" }}>Article Not Found</h1>
        <p className="mt-4 text-muted-foreground">This article doesn't exist.</p>
        <Link to="/blog" className="mt-6 inline-block text-primary hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    publisher: { "@type": "Organization", name: "Sohelix Tools" },
  };

  return (
    <>
      <Helmet>
        <title>{post.title} — Sohelix Tools Blog</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`https://sohelix.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate">{post.title}</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <time className="text-sm text-muted-foreground">{post.date}</time>
          <h1 className="text-3xl font-bold mt-2 mb-6 md:text-4xl" style={{ fontFamily: "Space Grotesk" }}>{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.description}</p>
        </motion.div>

        <Card className="p-6 sm:p-8 shadow-card border-transparent rounded-2xl">
          <div className="space-y-8">
            {post.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "Space Grotesk" }}>{section.heading}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "Space Grotesk" }}>Conclusion</h2>
              <p className="text-muted-foreground leading-relaxed">{post.conclusion}</p>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Link to="/blog" className="text-primary hover:underline text-sm">← Back to all articles</Link>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
