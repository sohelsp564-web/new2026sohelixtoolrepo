import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const PasswordGeneratorTool = () => {
  const [length, setLength] = useState([16]);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    let chars = "";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
    const arr = new Uint32Array(length[0]);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, v => chars[v % chars.length]).join(""));
  };

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium mb-1 block">Length: {length[0]}</label><Slider value={length} onValueChange={setLength} min={4} max={128} /></div>
      <div className="grid grid-cols-2 gap-3">
        {[["Uppercase", upper, setUpper], ["Lowercase", lower, setLower], ["Numbers", numbers, setNumbers], ["Symbols", symbols, setSymbols]].map(([label, val, setter]) => (
          <div key={label as string} className="flex items-center gap-2"><Switch checked={val as boolean} onCheckedChange={setter as any} /><span className="text-sm">{label as string}</span></div>
        ))}
      </div>
      <Button onClick={generate} className="w-full">Generate Password</Button>
      {password && (
        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
          <code className="flex-1 font-mono text-sm break-all">{password}</code>
          <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(password)}>Copy</Button>
        </div>
      )}
    </div>
  );
};

export default PasswordGeneratorTool;
