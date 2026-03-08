import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const langPrefix = i18n.language && i18n.language !== "en" ? `/${i18n.language.split("-")[0]}` : "";

  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold" style={{ fontFamily: 'Space Grotesk' }}>S</div>
              <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>Sohelix Tools</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("footer_desc")}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: 'Space Grotesk' }}>{t("quick_links")}</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to={`${langPrefix}/`} className="hover:text-foreground transition-colors">{t("home")}</Link></li>
              <li><Link to={`${langPrefix}/categories`} className="hover:text-foreground transition-colors">{t("categories")}</Link></li>
              <li><Link to={`${langPrefix}/about`} className="hover:text-foreground transition-colors">{t("about")}</Link></li>
              <li><Link to={`${langPrefix}/contact`} className="hover:text-foreground transition-colors">{t("contact")}</Link></li>
              <li><Link to={`${langPrefix}/faq`} className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to={`${langPrefix}/request-tool`} className="hover:text-foreground transition-colors">{t("request_tool")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: 'Space Grotesk' }}>{t("popular_tools_footer")}</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to={`${langPrefix}/tools/image-compressor`} className="hover:text-foreground transition-colors">Image Compressor</Link></li>
              <li><Link to={`${langPrefix}/tools/json-formatter`} className="hover:text-foreground transition-colors">JSON Formatter</Link></li>
              <li><Link to={`${langPrefix}/tools/qr-code-generator`} className="hover:text-foreground transition-colors">QR Code Generator</Link></li>
              <li><Link to={`${langPrefix}/tools/word-counter`} className="hover:text-foreground transition-colors">Word Counter</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: 'Space Grotesk' }}>{t("legal")}</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to={`${langPrefix}/privacy-policy`} className="hover:text-foreground transition-colors">{t("privacy_policy")}</Link></li>
              <li><Link to={`${langPrefix}/terms-of-service`} className="hover:text-foreground transition-colors">{t("terms_of_service")}</Link></li>
              <li><Link to={`${langPrefix}/disclaimer`} className="hover:text-foreground transition-colors">{t("disclaimer")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sohelix Tools. {t("all_rights_reserved")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
