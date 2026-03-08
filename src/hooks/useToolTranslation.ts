import { useState, useEffect } from "react";

export const SUPPORTED_LANGS = ["en", "hi", "es", "fr", "de", "it", "pt"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const LANG_NAMES: Record<SupportedLang, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
};

interface ToolTranslation {
  title: string;
  description: string;
  meta_title: string;
  meta_description: string;
  faqs: { q: string; a: string }[];
}

type TranslationBundle = Record<string, ToolTranslation>;

const cache: Partial<Record<SupportedLang, TranslationBundle>> = {};

async function loadBundle(lang: SupportedLang): Promise<TranslationBundle> {
  if (cache[lang]) return cache[lang]!;
  const loaders: Record<SupportedLang, () => Promise<{ default: TranslationBundle }>> = {
    en: () => import("@/locales/tools/en.json"),
    hi: () => import("@/locales/tools/hi.json"),
    es: () => import("@/locales/tools/es.json"),
    fr: () => import("@/locales/tools/fr.json"),
    de: () => import("@/locales/tools/de.json"),
    it: () => import("@/locales/tools/it.json"),
    pt: () => import("@/locales/tools/pt.json"),
  };
  const mod = await loaders[lang]();
  cache[lang] = mod.default;
  return mod.default;
}

export function isValidLang(lang: string): lang is SupportedLang {
  return SUPPORTED_LANGS.includes(lang as SupportedLang);
}

export function useToolTranslation(slug: string, lang: SupportedLang) {
  const [t, setT] = useState<ToolTranslation | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let bundle = await loadBundle(lang);
      let translation = bundle[slug];
      // Fallback to English
      if (!translation && lang !== "en") {
        bundle = await loadBundle("en");
        translation = bundle[slug];
      }
      if (!cancelled) setT(translation || null);
    })();
    return () => { cancelled = true; };
  }, [slug, lang]);

  return t;
}
