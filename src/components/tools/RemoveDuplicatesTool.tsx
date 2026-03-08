import { useState, useMemo, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import TextToolWrapper, { CopyResultButton } from "./TextToolWrapper";

const RemoveDuplicatesInner = ({
  text,
  autoProcess,
}: {
  text: string;
  autoProcess: boolean;
}) => {
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [ignoreSpaces, setIgnoreSpaces] = useState(false);
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(false);
  const [manualResult, setManualResult] = useState("");

  const process = useCallback(
    (input: string) => {
      if (!input) return "";
      const lines = input.split("\n");
      const seen = new Map<string, number>();
      lines.forEach((l) => {
        let key = ignoreSpaces ? l.replace(/\s+/g, "") : l;
        key = caseSensitive ? key : key.toLowerCase();
        seen.set(key, (seen.get(key) || 0) + 1);
      });
      if (showOnlyDuplicates) {
        const dupKeys = new Set<string>();
        return lines
          .filter((l) => {
            let key = ignoreSpaces ? l.replace(/\s+/g, "") : l;
            key = caseSensitive ? key : key.toLowerCase();
            if ((seen.get(key) || 0) > 1 && !dupKeys.has(key)) {
              dupKeys.add(key);
              return true;
            }
            return false;
          })
          .join("\n");
      }
      const addedKeys = new Set<string>();
      return lines
        .filter((l) => {
          let key = ignoreSpaces ? l.replace(/\s+/g, "") : l;
          key = caseSensitive ? key : key.toLowerCase();
          if (addedKeys.has(key)) return false;
          addedKeys.add(key);
          return true;
        })
        .join("\n");
    },
    [caseSensitive, ignoreSpaces, showOnlyDuplicates]
  );

  const autoResult = useMemo(() => (autoProcess ? process(text) : ""), [text, autoProcess, process]);
  const displayResult = autoProcess ? autoResult : manualResult;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={caseSensitive} onCheckedChange={setCaseSensitive} />
          <span className="text-sm">Case sensitive</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={ignoreSpaces} onCheckedChange={setIgnoreSpaces} />
          <span className="text-sm">Ignore spaces</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={showOnlyDuplicates} onCheckedChange={setShowOnlyDuplicates} />
          <span className="text-sm">Show only duplicates</span>
        </div>
      </div>
      {!autoProcess && (
        <Button onClick={() => setManualResult(process(text))} className="w-full">
          {showOnlyDuplicates ? "Find Duplicates" : "Remove Duplicates"}
        </Button>
      )}
      {displayResult && (
        <>
          <Textarea value={displayResult} readOnly rows={6} />
          <CopyResultButton text={displayResult} />
        </>
      )}
    </div>
  );
};

const RemoveDuplicatesTool = () => (
  <TextToolWrapper storageKey="remove-duplicates" placeholder="Paste lines of text...">
    {({ text, autoProcess }) => <RemoveDuplicatesInner text={text} autoProcess={autoProcess} />}
  </TextToolWrapper>
);

export default RemoveDuplicatesTool;
