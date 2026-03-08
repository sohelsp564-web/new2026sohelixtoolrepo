import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SUPPORTED_LANGUAGES } from "@/i18n";

const BASE_URL = "https://sohelix.com";

const HreflangTags = () => {
  const location = useLocation();

  // Strip language prefix from path to get the base path
  const pathParts = location.pathname.split("/").filter(Boolean);
  const langCodes = SUPPORTED_LANGUAGES.map(l => l.code);
  let basePath = location.pathname;
  if (langCodes.includes(pathParts[0])) {
    basePath = "/" + pathParts.slice(1).join("/");
  }
  if (basePath === "") basePath = "/";

  return (
    <Helmet>
      {SUPPORTED_LANGUAGES.map(lang => (
        <link
          key={lang.code}
          rel="alternate"
          hrefLang={lang.code}
          href={`${BASE_URL}${lang.code === "en" ? basePath : `/${lang.code}${basePath === "/" ? "" : basePath}`}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${basePath}`} />
    </Helmet>
  );
};

export default HreflangTags;
