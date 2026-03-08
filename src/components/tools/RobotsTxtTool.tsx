import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const RobotsTxtTool = () => {
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const [allowAll, setAllowAll] = useState(true);

  const output = `User-agent: *
${allowAll ? "Allow: /" : "Disallow: /"}

Sitemap: ${sitemap}`;

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">Sitemap URL</label><Input value={sitemap} onChange={e => setSitemap(e.target.value)} /></div>
      <div className="flex items-center gap-2"><Switch checked={allowAll} onCheckedChange={setAllowAll} /><span className="text-sm">{allowAll ? "Allow all crawling" : "Disallow all crawling"}</span></div>
      <Textarea value={output} readOnly rows={5} className="font-mono text-xs" />
      <Button onClick={() => navigator.clipboard.writeText(output)} variant="outline" className="w-full">Copy robots.txt</Button>
    </div>
  );
};

export default RobotsTxtTool;
