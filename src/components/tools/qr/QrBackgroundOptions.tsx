export type BgMode = "plain" | "gradient" | "transparent";

export interface GradientConfig {
  from: string;
  to: string;
}

const GRADIENT_PRESETS: { label: string; from: string; to: string }[] = [
  { label: "Blue → Purple", from: "#3b82f6", to: "#8b5cf6" },
  { label: "Teal → Cyan", from: "#14b8a6", to: "#06b6d4" },
  { label: "Orange → Pink", from: "#f97316", to: "#ec4899" },
  { label: "Green → Lime", from: "#22c55e", to: "#84cc16" },
];

interface Props {
  bgMode: BgMode;
  bgColor: string;
  gradient: GradientConfig;
  onBgModeChange: (m: BgMode) => void;
  onBgColorChange: (c: string) => void;
  onGradientChange: (g: GradientConfig) => void;
}

const QrBackgroundOptions = ({ bgMode, bgColor, gradient, onBgModeChange, onBgColorChange, onGradientChange }: Props) => (
  <div className="space-y-3">
    <label className="text-sm font-medium">Background</label>
    <div className="flex gap-1.5">
      {(["plain", "gradient", "transparent"] as BgMode[]).map(m => (
        <button
          key={m}
          onClick={() => onBgModeChange(m)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
            bgMode === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
    {bgMode === "plain" && (
      <div className="flex items-center gap-2">
        <input type="color" value={bgColor} onChange={e => onBgColorChange(e.target.value)} className="h-9 w-12 rounded border border-input cursor-pointer" />
        <input value={bgColor} onChange={e => onBgColorChange(e.target.value)} className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
    )}
    {bgMode === "gradient" && (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {GRADIENT_PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => onGradientChange({ from: p.from, to: p.to })}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <span className="h-3 w-6 rounded-sm" style={{ background: `linear-gradient(to right, ${p.from}, ${p.to})` }} />
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input type="color" value={gradient.from} onChange={e => onGradientChange({ ...gradient, from: e.target.value })} className="h-9 w-12 rounded border border-input cursor-pointer" />
          <span className="text-xs text-muted-foreground">→</span>
          <input type="color" value={gradient.to} onChange={e => onGradientChange({ ...gradient, to: e.target.value })} className="h-9 w-12 rounded border border-input cursor-pointer" />
        </div>
      </div>
    )}
  </div>
);

export default QrBackgroundOptions;
