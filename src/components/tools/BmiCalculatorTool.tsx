import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BmiCalculatorTool = () => {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [result, setResult] = useState<{ bmi: number; category: string; healthyRange: string } | null>(null);

  const calculate = () => {
    let w: number, hMeters: number;
    if (unit === "metric") {
      w = parseFloat(weight);
      hMeters = parseFloat(height) / 100;
    } else {
      w = parseFloat(weight) * 0.453592;
      const totalInches = parseFloat(feet) * 12 + (parseFloat(inches) || 0);
      hMeters = totalInches * 0.0254;
    }
    if (!w || !hMeters || hMeters <= 0) return;

    const bmi = w / (hMeters * hMeters);
    let category = "Obese";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";

    const minHealthy = Math.round(18.5 * hMeters * hMeters * 10) / 10;
    const maxHealthy = Math.round(24.9 * hMeters * hMeters * 10) / 10;
    const healthyRange = unit === "imperial"
      ? `${(minHealthy * 2.20462).toFixed(1)} – ${(maxHealthy * 2.20462).toFixed(1)} lbs`
      : `${minHealthy} – ${maxHealthy} kg`;

    setResult({ bmi: Math.round(bmi * 10) / 10, category, healthyRange });
  };

  const categoryColor = useMemo(() => {
    if (!result) return "";
    if (result.category === "Underweight") return "text-yellow-500";
    if (result.category === "Normal weight") return "text-green-500";
    if (result.category === "Overweight") return "text-orange-500";
    return "text-red-500";
  }, [result]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["metric", "imperial"] as const).map(u => (
          <button
            key={u}
            onClick={() => { setUnit(u); setResult(null); }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${unit === u ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {u === "metric" ? "Metric (kg / cm)" : "Imperial (lbs / ft)"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
          <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        {unit === "metric" ? (
          <div>
            <label className="text-sm font-medium mb-1 block">Height (cm)</label>
            <Input type="number" value={height} onChange={e => setHeight(e.target.value)} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Feet</label>
              <Input type="number" value={feet} onChange={e => setFeet(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Inches</label>
              <Input type="number" value={inches} onChange={e => setInches(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      <Button onClick={calculate} className="w-full">Calculate BMI</Button>

      {result && (
        <>
          <div className="rounded-lg bg-muted p-6 text-center space-y-2">
            <div className="text-4xl font-bold text-primary">{result.bmi}</div>
            <div className={`text-sm font-semibold ${categoryColor}`}>{result.category}</div>
            <div className="text-xs text-muted-foreground">Healthy weight range: {result.healthyRange}</div>
          </div>

          {/* BMI Category Scale */}
          <div className="rounded-lg bg-muted p-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-center">BMI Categories</h4>
            <div className="space-y-2">
              {([
                { label: "Underweight", range: "< 18.5", color: "bg-yellow-500", min: 0, max: 18.5 },
                { label: "Normal", range: "18.5 – 24.9", color: "bg-green-500", min: 18.5, max: 24.9 },
                { label: "Overweight", range: "25 – 29.9", color: "bg-orange-500", min: 25, max: 29.9 },
                { label: "Obese", range: "≥ 30", color: "bg-red-500", min: 30, max: 50 },
              ] as const).map(cat => {
                const isActive = result.bmi >= cat.min && result.bmi < (cat.max === 50 ? Infinity : cat.max + 0.1);
                return (
                  <div key={cat.label} className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive ? "bg-background ring-1 ring-border shadow-sm" : ""}`}>
                    <div className={`h-3 w-3 rounded-full ${cat.color} shrink-0`} />
                    <span className={`text-sm flex-1 ${isActive ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{cat.label}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{cat.range}</span>
                    {isActive && <span className="text-xs font-bold text-primary">← You</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Example Calculation */}
      <div className="rounded-lg border border-dashed border-border p-4">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">📌 Example Calculation</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><span className="font-medium text-foreground">Weight:</span> 70 kg</p>
          <p><span className="font-medium text-foreground">Height:</span> 175 cm</p>
          <div className="mt-3 pt-3 border-t border-border space-y-1">
            <p><span className="font-medium text-foreground">BMI:</span> 22.9</p>
            <p><span className="font-medium text-foreground">Category:</span> Normal weight</p>
            <p><span className="font-medium text-foreground">Healthy range:</span> 56.7 – 76.3 kg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculatorTool;
