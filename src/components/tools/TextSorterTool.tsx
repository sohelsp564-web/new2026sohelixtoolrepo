import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TextToolWrapper, { CopyResultButton } from "./TextToolWrapper";

const TextSorterTool = () => {
  const [sortType, setSortType] = useState<string | null>(null);

  return (
    <TextToolWrapper storageKey="text-sorter" placeholder="Enter lines of text...">
      {({ text, autoProcess }) => {
        const sort = (desc = false, numeric = false) => {
          const lines = text.split("\n").filter((l) => l.trim());
          lines.sort((a, b) => {
            if (numeric) return desc ? parseFloat(b) - parseFloat(a) : parseFloat(a) - parseFloat(b);
            return desc ? b.localeCompare(a) : a.localeCompare(b);
          });
          return lines.join("\n");
        };

        const result = useMemo(() => {
          if (!text || !sortType) return "";
          const lines = text.split("\n").filter((l) => l.trim());
          const desc = sortType === "za" || sortType === "90";
          const numeric = sortType === "09" || sortType === "90";
          lines.sort((a, b) => {
            if (numeric) return desc ? parseFloat(b) - parseFloat(a) : parseFloat(a) - parseFloat(b);
            return desc ? b.localeCompare(a) : a.localeCompare(b);
          });
          return lines.join("\n");
        }, [text, sortType]);

        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant={sortType === "az" ? "default" : "outline"} size="sm" onClick={() => setSortType("az")}>A → Z</Button>
              <Button variant={sortType === "za" ? "default" : "outline"} size="sm" onClick={() => setSortType("za")}>Z → A</Button>
              <Button variant={sortType === "09" ? "default" : "outline"} size="sm" onClick={() => setSortType("09")}>0 → 9</Button>
              <Button variant={sortType === "90" ? "default" : "outline"} size="sm" onClick={() => setSortType("90")}>9 → 0</Button>
            </div>
            {result && (
              <>
                <Textarea value={result} readOnly rows={6} />
                <CopyResultButton text={result} />
              </>
            )}
          </div>
        );
      }}
    </TextToolWrapper>
  );
};

export default TextSorterTool;
