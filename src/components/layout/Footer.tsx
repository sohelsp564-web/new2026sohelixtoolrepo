import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 mt-20">
    <div className="container mx-auto px-4 py-14">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold" style={{ fontFamily: 'Space Grotesk' }}>S</div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>Sohelix Tools</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">Free online tools that run entirely in your browser. No uploads, no registration.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: 'Space Grotesk' }}>Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li><Link to="/categories" className="hover:text-foreground transition-colors">Categories</Link></li>
            <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            <li><Link to="/request-tool" className="hover:text-foreground transition-colors">Request Tool</Link></li>
            <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: 'Space Grotesk' }}>Popular Tools</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/tools/image-compressor" className="hover:text-foreground transition-colors">Image Compressor</Link></li>
            <li><Link to="/tools/json-formatter" className="hover:text-foreground transition-colors">JSON Formatter</Link></li>
            <li><Link to="/tools/qr-code-generator" className="hover:text-foreground transition-colors">QR Code Generator</Link></li>
            <li><Link to="/tools/word-counter" className="hover:text-foreground transition-colors">Word Counter</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: 'Space Grotesk' }}>Legal</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            <li><Link to="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Sohelix Tools. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
