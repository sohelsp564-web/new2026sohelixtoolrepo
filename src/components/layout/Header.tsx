import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, Search, Command, ChevronDown, Image, FileText, Type, Code, SearchIcon, Calculator, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, searchTools } from "@/data/tools";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const categoryIcons: Record<string, React.ElementType> = {
  "image-tools": Image,
  "pdf-tools": FileText,
  "text-tools": Type,
  "developer-tools": Code,
  "seo-tools": SearchIcon,
  "calculator-tools": Calculator,
  "utilities": Wrench,
};

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchTools>>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();

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

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  };

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setSearchResults(q.length > 1 ? searchTools(q).slice(0, 8) : []);
  }, []);

  const handleDropdownEnter = (name: string) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Blog" },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-border bg-background/90 backdrop-blur-xl shadow-soft" : "border-transparent bg-background/60 backdrop-blur-md"}`}>
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-lg transition-transform group-hover:scale-105">
            S
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline">Sohelix Tools</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-8">
          {/* Home */}
          <Link
            to="/"
            className="px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-muted/60"
          >
            Home
          </Link>

          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("tools")}
            onMouseLeave={handleDropdownLeave}
          >
            <button className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-muted/60">
              Tools
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeDropdown === "tools" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "tools" && (
              <div className="absolute top-full left-0 mt-1 w-72 rounded-xl border border-border bg-card shadow-elevated overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="p-2">
                  {categories.map((cat) => {
                    const Icon = categoryIcons[cat.slug] || Wrench;
                    return (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted/80 transition-colors group/item"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary/15 transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{cat.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{cat.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="border-t border-border p-2">
                  <Link
                    to="/categories"
                    className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    View All Tools
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter("categories")}
            onMouseLeave={handleDropdownLeave}
          >
            <button className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-muted/60">
              Categories
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeDropdown === "categories" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "categories" && (
              <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-border bg-card shadow-elevated overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="p-2">
                  {categories.map((cat) => {
                    const Icon = categoryIcons[cat.slug] || Wrench;
                    return (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}`}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-muted/80 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Blog */}
          <Link
            to="/blog"
            className="px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-muted/60"
          >
            Blog
          </Link>
        </nav>

        {/* Right side: search + actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Desktop search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search tools..."
              className="w-56 lg:w-64 pl-9 h-9 rounded-xl bg-muted/60 border-transparent focus:border-primary/30 focus:bg-card transition-all"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full rounded-xl border border-border bg-card shadow-elevated overflow-hidden z-50">
                {searchResults.map((t) => (
                  <button
                    key={t.slug}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors"
                    onClick={() => {
                      navigate(`/tools/${t.slug}`);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    <span className="font-medium">{t.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{t.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ctrl+K button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={openCommandPalette}
            className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground rounded-xl h-9 px-3 border border-border/50"
          >
            <Command className="h-3 w-3" />
            <span>K</span>
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="shrink-0 rounded-xl h-9 w-9">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-xl h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader className="p-4 pb-2 border-b border-border">
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>

              {/* Mobile search */}
              <div className="p-4 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search tools..."
                    className="pl-9 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-2 rounded-xl border border-border bg-card shadow-elevated overflow-hidden max-h-48 overflow-y-auto">
                    {searchResults.map((t) => (
                      <button
                        key={t.slug}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors"
                        onClick={() => {
                          navigate(`/tools/${t.slug}`);
                          setMobileOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <span className="font-medium">{t.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{t.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile nav links */}
              <nav className="flex flex-col px-2 py-2">
                <Link
                  to="/"
                  className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </Link>

                {/* Mobile Tools collapsible */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted transition-colors">
                    Tools
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-4 flex flex-col border-l border-border pl-2">
                      {categories.map((cat) => {
                        const Icon = categoryIcons[cat.slug] || Wrench;
                        return (
                          <Link
                            key={cat.slug}
                            to={`/category/${cat.slug}`}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {cat.name}
                          </Link>
                        );
                      })}
                      <Link
                        to="/categories"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        View All Tools
                      </Link>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Mobile Categories collapsible */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted transition-colors">
                    Categories
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-4 flex flex-col border-l border-border pl-2">
                      {categories.map((cat) => {
                        const Icon = categoryIcons[cat.slug] || Wrench;
                        return (
                          <Link
                            key={cat.slug}
                            to={`/category/${cat.slug}`}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {cat.name}
                          </Link>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Link
                  to="/blog"
                  className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Blog
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
