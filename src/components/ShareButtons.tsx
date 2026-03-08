import { Share2, MessageCircle, Twitter, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const ShareButtons = ({ title, url }: { title: string; url?: string }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const text = `Check out ${title} — a free online tool on Sohelix Tools!`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
        <Share2 className="h-3.5 w-3.5" /> Share this tool
      </span>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1.5 rounded-full text-xs"
        onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + shareUrl)}`, "_blank", "noopener,noreferrer")}
      >
        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1.5 rounded-full text-xs"
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank")}
      >
        <Twitter className="h-3.5 w-3.5" /> Twitter
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1.5 rounded-full text-xs"
        onClick={copyLink}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
};

export default ShareButtons;
