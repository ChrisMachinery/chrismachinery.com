function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function withLinks(html: string) {
  return html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a class="underline underline-offset-2" href="$2">$1</a>',
  );
}

export function MarkdownBody({ text }: { text: string }) {
  return (
    <div>
      {text.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i} className="type-section mt-8">{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i} className="type-h3 mt-6 mb-1.5">{line.slice(4)}</h3>;
        if (line.startsWith("- ")) {
          return (
            <li key={i} className="type-body ms-5 list-disc" dangerouslySetInnerHTML={{ __html: withLinks(escapeHtml(line.slice(2))) }} />
          );
        }
        if (!line.trim()) return <br key={i} />;
        const html = withLinks(escapeHtml(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
        return <p key={i} className="type-body mt-3" dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}
