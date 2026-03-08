import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "porta", "nibh",
  "venenatis", "cras", "fermentum", "odio", "eu", "feugiat", "pretium",
  "vulputate", "sapien", "nec", "sagittis", "aliquam", "malesuada", "bibendum",
  "arcu", "vitae", "elementum", "curabitur", "tempus", "urna", "nunc", "faucibus",
  "ornare", "suspendisse", "potenti", "nullam", "ac", "tortor", "dignissim",
  "convallis", "aenean", "lacus", "viverra", "maecenas", "accumsan", "lacinia",
];

type GenType = "words" | "sentences" | "paragraphs";

const generateWords = (count: number): string => {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    result.push(i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
  }
  return result.join(" ") + ".";
};

const generateSentences = (count: number): string => {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    const wordCount = 8 + Math.floor(Math.random() * 10);
    sentences.push(generateWords(wordCount));
  }
  return sentences.join(" ");
};

const generateParagraphs = (count: number): string => {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    const sentenceCount = 3 + Math.floor(Math.random() * 4);
    paragraphs.push(generateSentences(sentenceCount));
  }
  return paragraphs.join("\n\n");
};

const LoremIpsumTool = () => {
  const [count, setCount] = useState("5");
  const [genType, setGenType] = useState<GenType>("paragraphs");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const n = Math.max(1, Math.min(500, parseInt(count) || 1));
    switch (genType) {
      case "words": setResult(generateWords(n)); break;
      case "sentences": setResult(generateSentences(n)); break;
      case "paragraphs": setResult(generateParagraphs(n)); break;
    }
  }, [count, genType]);

  const stats = useMemo(() => {
    if (!result) return { words: 0, chars: 0 };
    const words = result.trim().split(/\s+/).filter(Boolean).length;
    return { words, chars: result.length };
  }, [result]);

  const copyText = useCallback(async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const genTypes: { value: GenType; label: string }[] = [
    { value: "words", label: "Words" },
    { value: "sentences", label: "Sentences" },
    { value: "paragraphs", label: "Paragraphs" },
  ];

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <div className="space-y-1.5">
          <Label>Amount</Label>
          <Input
            type="number"
            value={count}
            onChange={e => setCount(e.target.value)}
            min={1}
            max={500}
            placeholder="Enter number..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Generate</Label>
          <div className="flex rounded-lg border border-input overflow-hidden h-10">
            {genTypes.map(t => (
              <button
                key={t.value}
                onClick={() => setGenType(t.value)}
                className={`px-3 text-xs font-medium transition-colors ${
                  genType === t.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="invisible">Action</Label>
          <Button onClick={generate} className="w-full h-10 gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </div>

      {/* Output */}
      {result && (
        <div className="space-y-3">
          {/* Stats */}
          <div className="flex items-center gap-4">
            <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Words: <span className="text-foreground font-semibold">{stats.words.toLocaleString()}</span>
            </span>
            <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Characters: <span className="text-foreground font-semibold">{stats.chars.toLocaleString()}</span>
            </span>
          </div>

          <Textarea value={result} readOnly rows={12} className="font-mono text-sm leading-relaxed" />

          <Button onClick={copyText} variant="outline" className="w-full gap-1.5">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Text"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoremIpsumTool;
