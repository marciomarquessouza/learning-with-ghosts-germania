type SupportedFormat = "key" | "audio" | "target";

type RenderFormattedTextOptions = {
  audioIcon?: React.ReactNode;
  playAudio?: (audio: string) => void;
};

function renderFormattedPart(
  format: string,
  value: string,
  key: React.Key,
  options?: RenderFormattedTextOptions,
) {
  switch (format.trim() as SupportedFormat) {
    case "key":
      return (
        <span
          key={key}
          className="inline-flex min-w-[1.75rem] items-center justify-center rounded-md border border-zinc-300 bg-zinc-100 px-2 py-0.5 font-mono text-sm font-bold text-zinc-900 shadow-sm"
        >
          {value}
        </span>
      );

    case "audio":
      return (
        <button
          key={key}
          type="button"
          className={[
            "pointer-events-auto cursor-pointer",
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md",
            " hover:font-bold disabled:opacity-50 disabled:cursor-not-allowed",
            "underline decoration-dotted",
          ].join(" ")}
          onClick={() => options?.playAudio?.(value)}
          disabled={!options?.playAudio}
        >
          {value}
          <span aria-hidden>{options?.audioIcon}</span>
        </button>
      );
    case "target":
      return (
        <span
          key={key}
          className="rounded-sm border-b-2 border-yellow-500 bg-yellow-100 px-1 font-bold text-yellow-950"
        >
          {value}
        </span>
      );

    default:
      return <span key={key}>{value}</span>;
  }
}

export function renderFormattedText(
  text: string,
  options?: RenderFormattedTextOptions,
): React.ReactElement {
  const regex = /\{\{([^|}]+)\|([^}]+)\}\}/g;
  const parts: React.ReactNode[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, format, value] = match;
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex, startIndex)}
        </span>,
      );
    }

    parts.push(
      renderFormattedPart(format, value, `tag-${startIndex}`, options),
    );

    lastIndex = startIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return <span>{parts}</span>;
}
