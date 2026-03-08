import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchTools } from "@/data/tools";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchTools>>([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>S</div>
          <span className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Sohelix Tools</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/categories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Categories</Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">About</Link>
          <Link to="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              className="w-64 pl-9"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                {searchResults.map(t => (
                  <button key={t.slug} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg" onClick={() => { navigate(`/tools/${t.slug}`); setSearchQuery(""); setSearchResults([]); }}>
                    <span className="font-medium">{t.name}</span>
                    <span className="text-xs text-muted-foreground">— {t.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="shrink-0">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <div className="relative mt-3 mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search tools..." className="pl-9" value={searchQuery} onChange={e => handleSearch(e.target.value)} />
            {searchResults.length > 0 && (
              <div className="mt-1 rounded-lg border border-border bg-card shadow-lg">
                {searchResults.map(t => (
                  <button key={t.slug} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted" onClick={() => { navigate(`/tools/${t.slug}`); setIsOpen(false); setSearchQuery(""); setSearchResults([]); }}>
                    <span className="font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <nav className="flex flex-col gap-2">
            <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/categories" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>Categories</Link>
            <Link to="/about" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted" onClick={() => setIsOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
