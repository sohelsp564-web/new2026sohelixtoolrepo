import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Globe, ChevronDown } from "lucide-react";
import { SUPPORTED_LANGUAGES, COUNTRY_MAP, loadLanguage } from "@/i18n";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState<"lang" | "country" | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language?.split("-")[0]) || SUPPORTED_LANGUAGES[0];

  const switchLanguage = async (code: string) => {
    await loadLanguage(code);
    i18n.changeLanguage(code);
    localStorage.setItem("siteLanguage", code);
    setOpen(null);

    // Update URL with language prefix
    const pathParts = location.pathname.split("/").filter(Boolean);
    const langCodes = SUPPORTED_LANGUAGES.map(l => l.code);
    if (langCodes.includes(pathParts[0])) {
      pathParts.shift();
    }
    const newPath = code === "en"
      ? `/${pathParts.join("/")}`
      : `/${code}/${pathParts.join("/")}`;
    navigate(newPath || "/", { replace: true });
  };

  const switchCountry = (lang: string) => {
    switchLanguage(lang);
  };

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      {/* Language */}
      <button
        onClick={() => setOpen(open === "lang" ? null : "lang")}
        className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLang.flag}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {open === "lang" && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-card shadow-elevated z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border">{t("language")}</div>
          <div className="max-h-64 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors ${
                  currentLang.code === lang.code ? "bg-primary/5 text-primary font-medium" : ""
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-border">
            <button
              onClick={() => setOpen("country")}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted transition-colors"
            >
              🌍 {t("country")}
              <ChevronDown className="h-3 w-3 ml-auto" />
            </button>
          </div>
        </div>
      )}

      {open === "country" && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-card shadow-elevated z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
            <button onClick={() => setOpen("lang")} className="hover:text-foreground">← {t("country")}</button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {COUNTRY_MAP.map(c => (
              <button
                key={c.country}
                onClick={() => switchCountry(c.lang)}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <span className="text-base">{c.flag}</span>
                <span>{c.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
