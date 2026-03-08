import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import QRCodeStyling, {
  type DotType,
  type CornerSquareType,
  type CornerDotType,
} from "qr-code-styling";
import QrFrameOverlay, { type FrameConfig } from "./qr/QrFrameOverlay";
import QrBackgroundOptions, { type BgMode, type GradientConfig } from "./qr/QrBackgroundOptions";
import QrHistory, { saveQrToHistory } from "./qr/QrHistory";
import QrBatchGenerator from "./qr/QrBatchGenerator";

type QrType = "url" | "text" | "email" | "phone" | "wifi" | "sms" | "whatsapp" | "location";

const QrCodeTool = () => {
  const [qrType, setQrType] = useState<QrType>("url");
  const [text, setText] = useState("https://sohelix.com");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiEnc, setWifiEnc] = useState("WPA");
  const [smsBody, setSmsBody] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgMode, setBgMode] = useState<BgMode>("plain");
  const [gradient, setGradient] = useState<GradientConfig>({ from: "#3b82f6", to: "#8b5cf6" });
  const [dotStyle, setDotStyle] = useState<DotType>("square");
  const [cornerStyle, setCornerStyle] = useState<CornerSquareType>("square");
  const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>("square");
  const [size, setSize] = useState(300);
  const [logo, setLogo] = useState<string | undefined>();
  const [frame, setFrame] = useState<FrameConfig>({ template: "none", customText: "" });

  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  const getData = useCallback((): string => {
    switch (qrType) {
      case "url": return text;
      case "text": return text;
      case "email": return `mailto:${email}`;
      case "phone": return `tel:${phone}`;
      case "wifi": return `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};;`;
      case "sms": return `sms:${phone}?body=${encodeURIComponent(smsBody)}`;
      case "whatsapp": return `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;
      case "location": return `geo:${lat},${lng}`;
      default: return text;
    }
  }, [qrType, text, email, phone, wifiSsid, wifiPass, wifiEnc, smsBody, waMessage, lat, lng]);

  const effectiveBg = bgMode === "transparent" ? "#00000000" : bgMode === "plain" ? bgColor : bgColor;

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: size,
      height: size,
      data: getData(),
      dotsOptions: { color: fgColor, type: dotStyle },
      backgroundOptions: bgMode === "gradient"
        ? { color: gradient.from }
        : { color: effectiveBg },
      cornersSquareOptions: { type: cornerStyle },
      cornersDotOptions: { type: cornerDotStyle },
      imageOptions: { crossOrigin: "anonymous", margin: 6 },
      image: logo,
    });
    qrRef.current = qr;
    if (ref.current) {
      ref.current.innerHTML = "";
      qr.append(ref.current);
    }
  }, [getData, fgColor, effectiveBg, bgMode, gradient, dotStyle, cornerStyle, cornerDotStyle, size, logo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const download = async (ext: "png" | "svg" | "jpeg") => {
    qrRef.current?.download({ extension: ext, name: "qrcode" });
    // Save to history
    const raw = await qrRef.current?.getRawData("png");
    if (raw) {
      const blob = raw instanceof Blob ? raw : new Blob([raw as unknown as BlobPart]);
      const reader = new FileReader();
      reader.onload = () => saveQrToHistory(getData(), reader.result as string);
      reader.readAsDataURL(blob);
    }
  };

  const handleRegenerate = (data: string) => {
    setQrType("url");
    setText(data);
  };

  const dotStyles: DotType[] = ["square", "dots", "rounded", "extra-rounded", "classy", "classy-rounded"];
  const cornerStyles: CornerSquareType[] = ["square", "dot", "extra-rounded"];
  const cornerDotStyles: CornerDotType[] = ["square", "dot"];
  const sizePresets = [
    { label: "Small", value: 200 },
    { label: "Medium", value: 300 },
    { label: "Large", value: 400 },
  ];

  return (
    <div className="space-y-6">
      {/* QR Type */}
      <Tabs value={qrType} onValueChange={v => setQrType(v as QrType)}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {(["url", "text", "email", "phone", "wifi", "sms", "whatsapp", "location"] as QrType[]).map(t => (
            <TabsTrigger key={t} value={t} className="capitalize text-xs">{t === "url" ? "URL" : t === "sms" ? "SMS" : t === "whatsapp" ? "WhatsApp" : t === "wifi" ? "WiFi" : t.charAt(0).toUpperCase() + t.slice(1)}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="url" className="mt-4">
          <Input placeholder="https://example.com" value={text} onChange={e => setText(e.target.value)} />
        </TabsContent>
        <TabsContent value="text" className="mt-4">
          <Input placeholder="Enter text..." value={text} onChange={e => setText(e.target.value)} />
        </TabsContent>
        <TabsContent value="email" className="mt-4">
          <Input placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </TabsContent>
        <TabsContent value="phone" className="mt-4">
          <Input placeholder="+1234567890" value={phone} onChange={e => setPhone(e.target.value)} />
        </TabsContent>
        <TabsContent value="wifi" className="mt-4 space-y-3">
          <Input placeholder="Network name (SSID)" value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} />
          <Input placeholder="Password" value={wifiPass} onChange={e => setWifiPass(e.target.value)} />
          <Select value={wifiEnc} onValueChange={setWifiEnc}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA">WPA/WPA2</SelectItem>
              <SelectItem value="WEP">WEP</SelectItem>
              <SelectItem value="nopass">None</SelectItem>
            </SelectContent>
          </Select>
        </TabsContent>
        <TabsContent value="sms" className="mt-4 space-y-3">
          <Input placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input placeholder="Message" value={smsBody} onChange={e => setSmsBody(e.target.value)} />
        </TabsContent>
        <TabsContent value="whatsapp" className="mt-4 space-y-3">
          <Input placeholder="Phone number (with country code)" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input placeholder="Message" value={waMessage} onChange={e => setWaMessage(e.target.value)} />
        </TabsContent>
        <TabsContent value="location" className="mt-4 space-y-3">
          <Input placeholder="Latitude" value={lat} onChange={e => setLat(e.target.value)} />
          <Input placeholder="Longitude" value={lng} onChange={e => setLng(e.target.value)} />
        </TabsContent>
      </Tabs>

      {/* Customization Accordion */}
      <Accordion type="multiple" defaultValue={["style", "frame", "background", "logo", "size"]} className="w-full">
        <AccordionItem value="style">
          <AccordionTrigger className="text-sm font-semibold">Style</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label>QR Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="h-9 w-12 rounded border border-input cursor-pointer" />
                  <Input value={fgColor} onChange={e => setFgColor(e.target.value)} className="flex-1" />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Dot Style</Label>
                <Select value={dotStyle} onValueChange={v => setDotStyle(v as DotType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {dotStyles.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Eye Style</Label>
                <Select value={cornerStyle} onValueChange={v => setCornerStyle(v as CornerSquareType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {cornerStyles.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Eye Dot Style</Label>
                <Select value={cornerDotStyle} onValueChange={v => setCornerDotStyle(v as CornerDotType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {cornerDotStyles.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="background">
          <AccordionTrigger className="text-sm font-semibold">Background</AccordionTrigger>
          <AccordionContent>
            <QrBackgroundOptions bgMode={bgMode} bgColor={bgColor} gradient={gradient} onBgModeChange={setBgMode} onBgColorChange={setBgColor} onGradientChange={setGradient} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="frame">
          <AccordionTrigger className="text-sm font-semibold">Frame</AccordionTrigger>
          <AccordionContent>
            <QrFrameOverlay frame={frame} onChange={setFrame} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="logo">
          <AccordionTrigger className="text-sm font-semibold">Logo</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <Input type="file" accept="image/*" onChange={handleLogoUpload} />
              {logo && <Button variant="ghost" size="sm" onClick={() => setLogo(undefined)}>Remove logo</Button>}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger className="text-sm font-semibold">Size: {size}px</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {sizePresets.map(p => (
                  <Button key={p.label} variant={size === p.value ? "default" : "outline"} size="sm" onClick={() => setSize(p.value)}>
                    {p.label}
                  </Button>
                ))}
              </div>
              <Slider value={[size]} min={100} max={600} step={10} onValueChange={v => setSize(v[0])} className="flex-1" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Preview */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative rounded-2xl bg-card border border-border p-4 shadow-card flex flex-col items-center justify-center"
          style={bgMode === "gradient" ? { background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` } : undefined}
        >
          <div ref={ref} />
          {frame.template !== "none" && frame.customText && (
            <div className="mt-2 px-4 py-1.5 rounded-lg bg-foreground text-background text-sm font-semibold text-center">
              {frame.customText}
            </div>
          )}
        </div>

        {/* Download */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => download("png")} variant="outline">Download PNG</Button>
          <Button onClick={() => download("svg")} variant="outline">Download SVG</Button>
          <Button onClick={() => download("jpeg")} variant="outline">Download JPG</Button>
        </div>
      </div>

      {/* History */}
      <QrHistory onRegenerate={handleRegenerate} />

      {/* Batch Generator */}
      <QrBatchGenerator />
    </div>
  );
};

export default QrCodeTool;
