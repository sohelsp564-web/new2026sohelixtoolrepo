import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const BlogPage = () => (
  <>
    <Helmet>
      <title>Blog — Sohelix Tools</title>
      <meta name="description" content="Read helpful articles about online tools, image compression, QR codes, password security, and web productivity." />
      <link rel="canonical" href="https://sohelix.com/blog" />
    </Helmet>
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold mb-2 md:text-4xl" style={{ fontFamily: "Space Grotesk" }}>Blog</h1>
        <p className="text-muted-foreground mb-10 text-lg max-w-2xl">Helpful articles about online tools, productivity, and web technology.</p>
      </motion.div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, i) => (
          <motion.div key={post.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <Card className="p-6 h-full flex flex-col shadow-card border-transparent rounded-2xl">
              <time className="text-xs text-muted-foreground mb-2">{post.date}</time>
              <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "Space Grotesk" }}>{post.title}</h2>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{post.description}</p>
              <Link to={`/blog/${post.slug}`}>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full text-xs">
                  Read More <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </>
);

export default BlogPage;
