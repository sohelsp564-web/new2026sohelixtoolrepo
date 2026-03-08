import { useEffect, useState } from "react";

const STORAGE_KEY = "sohelix-recent-tools";
const MAX_RECENT = 6;

export const trackToolVisit = (slug: string) => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
    const updated = [slug, ...stored.filter(s => s !== slug)].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
};

export const useRecentTools = () => {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      setSlugs(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {}
  }, []);

  return slugs;
};
