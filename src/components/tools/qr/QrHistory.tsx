import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Trash2 } from "lucide-react";

const STORAGE_KEY = "sohelix-qr-history";
const MAX = 5;

export interface QrHistoryEntry {
  id: string;
  data: string;
  dataUrl: string;
  createdAt: number;
}

export const saveQrToHistory = (data: string, dataUrl: string) => {
  try {
    const stored: QrHistoryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const entry: QrHistoryEntry = { id: crypto.randomUUID(), data, dataUrl, createdAt: Date.now() };
    const updated = [entry, ...stored.filter(e => e.data !== data)].slice(0, MAX);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
};

const QrHistory = ({ onRegenerate }: { onRegenerate: (data: string) => void }) => {
  const [entries, setEntries] = useState<QrHistoryEntry[]>([]);

  useEffect(() => {
    try {
      setEntries(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {}
  }, []);

  const remove = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Recent QR Codes</h3>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {entries.map(e => (
          <div key={e.id} className="rounded-xl border border-border bg-card p-3 flex flex-col items-center gap-2">
            <img loading="lazy" src={e.dataUrl} alt="QR" className="w-full aspect-square rounded-lg object-contain" />
            <p className="text-[10px] text-muted-foreground truncate w-full text-center">{e.data.slice(0, 30)}</p>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                const a = document.createElement("a");
                a.href = e.dataUrl;
                a.download = "qrcode.png";
                a.click();
              }}>
                <Download className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onRegenerate(e.data)}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => remove(e.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QrHistory;
