import TextToolWrapper from "./TextToolWrapper";

const WordCounterTool = () => {
  return (
    <TextToolWrapper storageKey="word-counter" placeholder="Type or paste your text here..." rows={8}>
      {({ text }) => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, "").length;
        const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
        const paragraphs = text.trim() ? text.split(/\n\n+/).filter((p) => p.trim()).length : 0;
        const readTime = Math.ceil(words / 200);

        return (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {([
              ["Words", words],
              ["Characters", chars],
              ["No Spaces", charsNoSpace],
              ["Sentences", sentences],
              ["Paragraphs", paragraphs],
              ["Read Time", `${readTime}m`],
            ] as [string, string | number][]).map(([label, val]) => (
              <div key={label} className="rounded-lg bg-muted p-3 text-center">
                <div className="text-2xl font-bold text-primary">{val}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        );
      }}
    </TextToolWrapper>
  );
};

export default WordCounterTool;
