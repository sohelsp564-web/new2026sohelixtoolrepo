import { useRef, useEffect, useState } from "react";

export interface FrameConfig {
  template: string;
  customText: string;
}

const FRAME_TEMPLATES: Record<string, string> = {
  none: "",
  scan: "Scan Me",
  visit: "Visit Website",
  follow: "Follow Us",
  download: "Download App",
  custom: "",
};

interface Props {
  frame: FrameConfig;
  onChange: (f: FrameConfig) => void;
}

const QrFrameOverlay = ({ frame, onChange }: Props) => (
  <div className="space-y-3">
    <label className="text-sm font-medium">Frame Template</label>
    <div className="flex flex-wrap gap-1.5">
      {Object.keys(FRAME_TEMPLATES).map(key => (
        <button
          key={key}
          onClick={() => onChange({ template: key, customText: key === "custom" ? frame.customText : FRAME_TEMPLATES[key] })}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            frame.template === key
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {key === "none" ? "No Frame" : key === "custom" ? "Custom" : FRAME_TEMPLATES[key]}
        </button>
      ))}
    </div>
    {(frame.template === "custom" || (frame.template !== "none" && frame.customText)) && frame.template !== "none" && (
      <input
        type="text"
        value={frame.customText}
        onChange={e => onChange({ ...frame, customText: e.target.value })}
        placeholder="Enter frame text..."
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    )}
  </div>
);

export { FRAME_TEMPLATES };
export default QrFrameOverlay;
