import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BmiCalculatorTool = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<{ bmi: number; category: string } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight), h = parseFloat(height) / 100;
    if (!w || !h) return;
    const bmi = w / (h * h);
    let category = "Obese";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    setResult({ bmi: Math.round(bmi * 10) / 10, category });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Weight (kg)</label><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">Height (cm)</label><Input type="number" value={height} onChange={e => setHeight(e.target.value)} /></div>
      </div>
      <Button onClick={calculate} className="w-full">Calculate BMI</Button>
      {result && (
        <div className="rounded-lg bg-muted p-6 text-center">
          <div className="text-4xl font-bold text-primary" style={{ fontFamily: 'Space Grotesk' }}>{result.bmi}</div>
          <div className="text-sm text-muted-foreground mt-1">{result.category}</div>
        </div>
      )}
    </div>
  );
};

export default BmiCalculatorTool;
