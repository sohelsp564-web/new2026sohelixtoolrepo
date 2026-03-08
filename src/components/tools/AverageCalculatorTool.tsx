import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const AverageCalculatorTool = () => {
  const [input, setInput] = useState("");

  const numbers = input.split(/[,\n\s]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  const count = numbers.length;
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = count > 0 ? sum / count : 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const median = count > 0
    ? count % 2 === 0 ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2 : sorted[Math.floor(count / 2)]
    : 0;
  const min = count > 0 ? sorted[0] : 0;
  const max = count > 0 ? sorted[count - 1] : 0;

  return (
    <div className="space-y-4">
      <Textarea placeholder="Enter numbers separated by commas, spaces, or new lines..." value={input} onChange={e => setInput(e.target.value)} rows={4} />
      {count > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            ["Count", count], ["Sum", sum.toFixed(2)], ["Mean", mean.toFixed(2)],
            ["Median", median.toFixed(2)], ["Min", min], ["Max", max],
          ].map(([label, val]) => (
            <div key={label as string} className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xl font-bold text-primary">{val}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AverageCalculatorTool;
