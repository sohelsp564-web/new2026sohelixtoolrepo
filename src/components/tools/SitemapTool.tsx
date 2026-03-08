import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SitemapTool = () => {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about");

  const output = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.split("\n").filter(u => u.trim()).map(u => `  <url>
    <loc>${u.trim()}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
</urlset>`;

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">URLs (one per line)</label><Textarea value={urls} onChange={e => setUrls(e.target.value)} rows={5} /></div>
      <Textarea value={output} readOnly rows={12} className="font-mono text-xs" />
      <Button onClick={() => navigator.clipboard.writeText(output)} variant="outline" className="w-full">Copy Sitemap XML</Button>
    </div>
  );
};

export default SitemapTool;
