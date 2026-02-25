import * as React from "react";

type Node =
  | { type: "h4"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

function parseMarkdown(md: string): Node[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: Node[] = [];

  let list: string[] | null = null;

  const flushList = () => {
    if (list && list.length) out.push({ type: "ul", items: list });
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) {
      flushList();
      continue;
    }

    const h4 = /^####\s+(.*)$/.exec(line.trim());
    if (h4) {
      flushList();
      out.push({ type: "h4", text: h4[1].trim() });
      continue;
    }

    const li = /^[-*]\s+(.*)$/.exec(line.trim());
    if (li) {
      if (!list) list = [];
      list.push(li[1].trim());
      continue;
    }

    flushList();
    out.push({ type: "p", text: line.trim() });
  }

  flushList();
  return out;
}

export function Markdown({ children }: { children: string }) {
  const nodes = React.useMemo(() => parseMarkdown(children || ""), [children]);

  return (
    <div className="space-y-3">
      {nodes.map((n, idx) => {
        if (n.type === "h4") {
          return (
            <h4
              key={idx}
              className="text-sm font-bold"
              style={{ color: "var(--purple-500)" }}
            >
              {n.text}
            </h4>
          );
        }

        if (n.type === "ul") {
          return (
            <ul key={idx} className="list-disc space-y-1 pl-5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {n.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={idx} className="whitespace-pre-line text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {n.text}
          </p>
        );
      })}
    </div>
  );
}
