const AdSlot = ({
  id,
  className = "",
  size = "banner",
}: {
  id: string;
  className?: string;
  size?: "banner" | "rectangle" | "leaderboard";
}) => {
  const sizeClasses = {
    banner: "h-[100px] sm:h-[90px] max-w-[728px]",
    rectangle: "h-[250px] max-w-[336px]",
    leaderboard: "h-[100px] sm:h-[90px] max-w-[728px]",
  };

  return (
    <div
      id={id}
      className={`mx-auto w-full ${sizeClasses[size]} rounded-xl bg-muted/30 border border-dashed border-border/50 ${className}`}
      aria-hidden="true"
      data-ad-slot={id}
    >
      {/* Future AdSense placement */}
    </div>
  );
};

export default AdSlot;
