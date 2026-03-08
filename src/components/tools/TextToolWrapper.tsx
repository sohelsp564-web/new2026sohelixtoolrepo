import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Copy, ClipboardPaste, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";

interface TextToolWrapperProps {
  children: (props: {
    text: string;
    setText: (t: string) => void;
    autoProcess: boolean;
  }) => React.ReactNode;
  storageKey: string;
  placeholder?: string;
  rows?: number;
  hideInput?: boolean;
}

const TextToolWrapper = ({
  children,
  storageKey,
  placeholder = "Type or paste your text here...",
  rows = 6,
  hideInput = false,
}: TextToolWrapperProps) => {
  const [text, setText] = useState("");
  const [autoProcess, setAutoProcess] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore from history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sohelix_history_${storageKey}`);
      if (saved) setText(saved);
    } catch {}
  }, [storageKey]);

  // Save to history (debounced)
  useEffect(() => {
    if (!text) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(`sohelix_history_${storageKey}`, text);
      } catch {}
    }, 1000);
    return () => clearTimeout(t);
  }, [text, storageKey]);

  const stats = useMemo(() => {
    const lines = text ? text.split("\n").length : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    return { lines, words, chars };
  }, [text]);

  const handlePaste = useCallback(async () => {
    try {
      const clip = await navigator.clipboard.readText();
      setText(clip);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Could not read clipboard");
    }
  }, []);

  const handleClear = useCallback(() => {
    setText("");
    toast.success("Cleared");
  }, []);

  const handleRestore = useCallback(() => {
    try {
      const saved = localStorage.getItem(`sohelix_history_${storageKey}`);
      if (saved) {
        setText(saved);
        toast.success("Previous input restored");
      } else {
        toast.info("No history found");
      }
    } catch {}
  }, [storageKey]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        // trigger re-process by toggling text slightly — tools auto-process on text change
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePaste}>
          <ClipboardPaste className="h-3.5 w-3.5" /> Paste
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleClear}>
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleRestore}>
          <Undo2 className="h-3.5 w-3.5" /> Restore
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Switch checked={autoProcess} onCheckedChange={setAutoProcess} id="auto-process" />
          <label htmlFor="auto-process" className="text-xs text-muted-foreground cursor-pointer select-none">
            Auto Process
          </label>
        </div>
      </div>

      {/* Input */}
      {!hideInput && (
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={rows}
        />
      )}

      {/* Live stats */}
      {text && (
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>Lines: <strong className="text-foreground">{stats.lines}</strong></span>
          <span>Words: <strong className="text-foreground">{stats.words}</strong></span>
          <span>Characters: <strong className="text-foreground">{stats.chars}</strong></span>
        </div>
      )}

      {/* Tool-specific content */}
      {children({ text, setText, autoProcess })}
    </div>
  );
};

export const CopyResultButton = ({ text }: { text: string }) => (
  <Button
    variant="outline"
    className="w-full gap-1.5"
    onClick={() => {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }}
  >
    <Copy className="h-3.5 w-3.5" /> Copy Result
  </Button>
);

export default TextToolWrapper;
