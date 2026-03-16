import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/data/tools";
import { motion } from "framer-motion";
import { getIconComponent } from "@/lib/iconMap";

const ToolCard = ({ tool, index = 0 }: { tool: Tool; index?: number }) => {
  const IconComponent = getIconComponent(tool.icon);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link to={`/tools/${tool.slug}`}>
        <Card className="group relative overflow-hidden p-5 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1.5 hover:border-primary/20 border-transparent shadow-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/8 text-primary transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary-glow group-hover:text-primary-foreground group-hover:shadow-glow group-hover:scale-105">
              <IconComponent className="h-5 w-5" />
            </div>
            <div className="min-w-0 pt-0.5">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-semibold text-sm truncate" style={{ fontFamily: 'Space Grotesk' }}>{tool.name}</h3>
                {tool.isNew && <Badge className="text-[10px] px-1.5 py-0 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">New</Badge>}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ToolCard;
