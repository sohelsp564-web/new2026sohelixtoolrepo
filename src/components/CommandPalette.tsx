import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import * as Icons from "lucide-react";
import { tools } from "@/data/tools";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (slug: string) => {
    setOpen(false);
    navigate(`/tools/${slug}`);
  };

  // Group tools by category
  const grouped = tools.reduce<Record<string, typeof tools>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search tools… (e.g. image compressor, JSON formatter)" />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        {Object.entries(grouped).map(([category, items]) => (
          <CommandGroup key={category} heading={category}>
            {items.map(tool => {
              const Icon = (Icons as any)[tool.icon] || Icons.Wrench;
              return (
                <CommandItem
                  key={tool.slug}
                  value={`${tool.name} ${tool.description}`}
                  onSelect={() => handleSelect(tool.slug)}
                  className="cursor-pointer"
                >
                  <Icon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{tool.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{tool.description}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
