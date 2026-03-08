import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TextToolWrapper, { CopyResultButton } from "./TextToolWrapper";

const cases = [
  { label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
  { label: "lowercase", fn: (s: string) => s.toLowerCase() },
  { label: "Title Case", fn: (s: string) => s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
  { label: "Sentence case", fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  { label: "aLtErNaTiNg", fn: (s: string) => s.split("").map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("") },
];

const TextCaseConverterTool = () => {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  return (
    <TextToolWrapper storageKey="text-case-converter" placeholder="Enter your text...">
      {({ text, autoProcess }) => {
        const result = useMemo(() => {
          if (selectedCase === null || !text) return "";
          return cases[selectedCase].fn(text);
        }, [text, selectedCase]);

        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {cases.map((c, i) => (
                <Button
                  key={c.label}
                  variant={selectedCase === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCase(i)}
                >
                  {c.label}
                </Button>
              ))}
            </div>
            {result && (
              <>
                <Textarea value={result} readOnly rows={5} />
                <CopyResultButton text={result} />
              </>
            )}
          </div>
        );
      }}
    </TextToolWrapper>
  );
};

export default TextCaseConverterTool;
