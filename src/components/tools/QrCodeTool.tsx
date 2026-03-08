import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";

const QrCodeTool = () => {
  const [text, setText] = useState("https://sohelix.com");

  const download = () => {
    const canvas = document.querySelector("#qr-canvas canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const a = document.createElement("a"); a.href = canvas.toDataURL("image/png"); a.download = "qrcode.png"; a.click();
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Enter text or URL..." value={text} onChange={e => setText(e.target.value)} />
      {text && (
        <div className="flex flex-col items-center gap-4">
          <div id="qr-canvas" className="rounded-lg bg-white p-4">
            <QRCodeCanvas value={text} size={200} />
          </div>
          <Button onClick={download} variant="outline">Download QR Code</Button>
        </div>
      )}
    </div>
  );
};

export default QrCodeTool;
