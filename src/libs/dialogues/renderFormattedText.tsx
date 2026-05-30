import React from "react";

type SupportedFormat = "key";

function renderFormattedPart(format: string, value: string, key: React.Key) {
  switch (format as SupportedFormat) {
    case "key":
      return (
        <span
          key={key}
          className="inline-flex min-w-[1.75rem] items-center justify-center rounded-md border border-zinc-300 bg-zinc-100 px-2 py-0.5 font-mono text-sm font-bold text-zinc-900 shadow-sm"
        >
          {value}
        </span>
      );

    default:
      return <span key={key}>{value}</span>;
  }
}

export function renderFormattedText(text: string): React.ReactElement {
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

    parts.push(renderFormattedPart(format.trim(), value, `tag-${startIndex}`));

    lastIndex = startIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return <span>{parts}</span>;
}
