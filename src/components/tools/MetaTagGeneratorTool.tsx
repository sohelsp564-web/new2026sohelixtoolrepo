import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MetaTagGeneratorTool = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");

  const output = `<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${image}" />`;

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">Page Title</label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="My Page Title" /><span className="text-xs text-muted-foreground">{title.length}/60</span></div>
      <div><label className="text-sm font-medium mb-1 block">Description</label><Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Page description..." rows={3} /><span className="text-xs text-muted-foreground">{desc.length}/160</span></div>
      <div><label className="text-sm font-medium mb-1 block">URL</label><Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" /></div>
      <div><label className="text-sm font-medium mb-1 block">Image URL</label><Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/image.jpg" /></div>
      <Textarea value={output} readOnly rows={14} className="font-mono text-xs" />
      <Button onClick={() => navigator.clipboard.writeText(output)} variant="outline" className="w-full">Copy Meta Tags</Button>
    </div>
  );
};

export default MetaTagGeneratorTool;
