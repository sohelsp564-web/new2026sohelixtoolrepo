import TextToolWrapper from "./TextToolWrapper";

const CharacterCounterTool = () => {
  return (
    <TextToolWrapper storageKey="character-counter" placeholder="Type or paste text..." rows={6}>
      {({ text }) => (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            ["With spaces", text.length],
            ["Without spaces", text.replace(/\s/g, "").length],
            ["Words", text.trim() ? text.trim().split(/\s+/).length : 0],
            ["Lines", text ? text.split("\n").length : 0],
          ] as [string, number][]).map(([l, v]) => (
            <div key={l} className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-bold text-primary">{v}</div>
              <div className="text-xs text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      )}
    </TextToolWrapper>
  );
};

export default CharacterCounterTool;
