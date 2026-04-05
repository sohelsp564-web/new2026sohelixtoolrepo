import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBlogPostBySlug } from "@/data/blogPosts";
import { Helmet } from "react-helmet-async";

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

  const postUrl = `https://tools.sohelix.com/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: postUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Sohelix Tools",
      url: "https://tools.sohelix.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Sohelix Tools",
      url: "https://tools.sohelix.com",
      logo: {
        "@type": "ImageObject",
        url: "https://tools.sohelix.com/favicon-192x192.png",
      },
    },
    image: {
      "@type": "ImageObject",
      url: "https://tools.sohelix.com/social-preview.webp",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return (
    <>
      <Helmet>
        <title>{post.title} — Sohelix Tools Blog</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`https://tools.sohelix.com/blog/${post.slug}`} />
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

        <div className="animate-hero">
          <time className="text-sm text-muted-foreground">{post.date}</time>
          <h1 className="text-3xl font-bold mt-2 mb-6 md:text-4xl" style={{ fontFamily: "Space Grotesk" }}>{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.description}</p>
        </div>

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

        {/* Useful Tools Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Space Grotesk" }}>Try Our Free Online Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Age Calculator", slug: "age-calculator", desc: "Calculate your exact age in years, months, and days instantly." },
              { name: "BMI Calculator", slug: "bmi-calculator", desc: "Check your body mass index and health category." },
              { name: "Loan Calculator", slug: "loan-emi-calculator", desc: "Calculate monthly payments, total interest, and amortization." },
              { name: "QR Code Generator", slug: "qr-code-generator", desc: "Create QR codes for links, text, WiFi, and more." },
              { name: "Password Generator", slug: "password-generator", desc: "Generate strong, secure passwords with custom options." },
              { name: "Image Compressor", slug: "image-compressor", desc: "Compress images without losing quality for faster loading." },
            ].map((tool) => (
              <Card key={tool.slug} className="p-5 border-transparent shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-semibold text-sm mb-1.5" style={{ fontFamily: "Space Grotesk" }}>{tool.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tool.desc}</p>
                <Button asChild size="sm" variant="outline" className="w-full gap-1.5 rounded-xl text-xs">
                  <Link to={`/tools/${tool.slug}`}>Use Tool <ArrowRight className="h-3 w-3" /></Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link to="/blog" className="text-primary hover:underline text-sm">← Back to all articles</Link>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
