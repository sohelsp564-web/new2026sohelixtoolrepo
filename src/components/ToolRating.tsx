import { Star } from "lucide-react";

const ToolRating = ({ rating = 4.8, count = 2400 }: { rating?: number; count?: number }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`h-4 w-4 ${i <= Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : i - rating < 1 ? "fill-yellow-400/50 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        ))}
      </div>
      <span className="font-medium text-foreground">{rating}</span>
      <span>/ 5</span>
      <span className="text-muted-foreground/70">({count.toLocaleString()} users)</span>
    </div>
  );
};

export default ToolRating;
