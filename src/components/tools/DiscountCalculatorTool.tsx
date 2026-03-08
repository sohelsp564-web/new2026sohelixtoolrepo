import { useState } from "react";
import { Input } from "@/components/ui/input";

const DiscountCalculatorTool = () => {
  const [price, setPrice] = useState("100");
  const [discount, setDiscount] = useState("20");

  const p = parseFloat(price) || 0, d = parseFloat(discount) || 0;
  const savings = p * d / 100;
  const final_ = p - savings;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-1 block">Original Price</label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1 block">Discount (%)</label><Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">You Save</div>
          <div className="text-2xl font-bold text-accent">{savings.toFixed(2)}</div>
        </div>
        <div className="rounded-lg bg-muted p-4 text-center">
          <div className="text-xs text-muted-foreground mb-1">Final Price</div>
          <div className="text-2xl font-bold text-primary">{final_.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCalculatorTool;
