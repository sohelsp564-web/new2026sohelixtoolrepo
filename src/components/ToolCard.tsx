import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import type { Tool } from "@/data/tools";

const ToolCard = ({ tool }: { tool: Tool }) => {
  const IconComponent = (Icons as any)[tool.icon] || Icons.Wrench;
  return (
    <Link to={`/tools/${tool.slug}`}>
      <Card className="group relative overflow-hidden p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate" style={{ fontFamily: 'Space Grotesk' }}>{tool.name}</h3>
              {tool.isNew && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">New</Badge>}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ToolCard;
