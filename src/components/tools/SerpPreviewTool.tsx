import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SerpPreviewTool = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("https://example.com");
  const [desc, setDesc] = useState("");

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">Title</label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Page Title" /><span className="text-xs text-muted-foreground">{title.length}/60</span></div>
      <div><label className="text-sm font-medium mb-1 block">URL</label><Input value={url} onChange={e => setUrl(e.target.value)} /></div>
      <div><label className="text-sm font-medium mb-1 block">Description</label><Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} /><span className="text-xs text-muted-foreground">{desc.length}/160</span></div>
      <div className="rounded-xl border border-border p-4 bg-card">
        <p className="text-sm text-muted-foreground">{url}</p>
        <h3 className="text-lg text-primary hover:underline cursor-pointer">{title || "Page Title"}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{desc || "Page description will appear here..."}</p>
      </div>
    </div>
  );
};

export default SerpPreviewTool;
