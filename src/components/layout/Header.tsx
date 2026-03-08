import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchTools } from "@/data/tools";
import LanguageSelector from "@/components/LanguageSelector";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchTools>>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const langPrefix = i18n.language && i18n.language !== "en" ? `/${i18n.language.split("-")[0]}` : "";

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setSearchResults(q.length > 1 ? searchTools(q).slice(0, 8) : []);
  };

  const navLinks = [
    { to: `${langPrefix}/`, label: t("home") },
    { to: `${langPrefix}/categories`, label: t("categories") },
    { to: `${langPrefix}/about`, label: t("about") },
    { to: `${langPrefix}/contact`, label: t("contact") },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-border bg-background/90 backdrop-blur-xl shadow-soft" : "border-transparent bg-background/60 backdrop-blur-md"}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={`${langPrefix}/`} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-lg transition-transform group-hover:scale-105" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>S</div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Sohelix Tools</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-muted/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("search_tools")}
              className="w-56 lg:w-64 pl-9 h-9 rounded-xl bg-muted/60 border-transparent focus:border-primary/30 focus:bg-card transition-all"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
                {searchResults.map(t => (
                  <button key={t.slug} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors" onClick={() => { navigate(`${langPrefix}/tools/${t.slug}`); setSearchQuery(""); setSearchResults([]); }}>
                    <span className="font-medium">{t.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{t.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <LanguageSelector />
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="shrink-0 rounded-xl h-9 w-9">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden rounded-xl h-9 w-9" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="relative mt-3 mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={t("search_tools")} className="pl-9 rounded-xl" value={searchQuery} onChange={e => handleSearch(e.target.value)} />
            {searchResults.length > 0 && (
              <div className="mt-1 rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
                {searchResults.map(tool => (
                  <button key={tool.slug} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted" onClick={() => { navigate(`${langPrefix}/tools/${tool.slug}`); setIsOpen(false); setSearchQuery(""); setSearchResults([]); }}>
                    <span className="font-medium">{tool.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
