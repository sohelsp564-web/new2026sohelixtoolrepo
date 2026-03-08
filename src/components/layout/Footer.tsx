import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold" style={{ fontFamily: 'Space Grotesk' }}>S</div>
            <span className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk' }}>Sohelix Tools</span>
          </div>
          <p className="text-sm text-muted-foreground">Free online tools that run entirely in your browser. No uploads, no registration.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li><Link to="/categories" className="hover:text-foreground transition-colors">Categories</Link></li>
            <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>Popular Tools</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/tools/image-compressor" className="hover:text-foreground transition-colors">Image Compressor</Link></li>
            <li><Link to="/tools/json-formatter" className="hover:text-foreground transition-colors">JSON Formatter</Link></li>
            <li><Link to="/tools/qr-code-generator" className="hover:text-foreground transition-colors">QR Code Generator</Link></li>
            <li><Link to="/tools/word-counter" className="hover:text-foreground transition-colors">Word Counter</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Sohelix Tools. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
