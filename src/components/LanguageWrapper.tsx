import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, loadLanguage } from "@/i18n";

/**
 * Wrapper that reads /:lang from the URL and syncs it with i18n.
 * Renders children once the language is synced.
 */
const LanguageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const langCodes = SUPPORTED_LANGUAGES.map(l => l.code);
    if (lang && langCodes.includes(lang) && lang !== i18n.language?.split("-")[0]) {
      loadLanguage(lang).then(() => {
        i18n.changeLanguage(lang);
        localStorage.setItem("siteLanguage", lang);
      });
    }
  }, [lang, i18n]);

  return <>{children}</>;
};

export default LanguageWrapper;
