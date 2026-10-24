import { looksLikeArticleHeading, unwrapMarkdownBoldLine } from "@/lib/articleHeading";

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

function withInlineBold(html: string) {
  return html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function MarkdownBody({ text }: { text: string }) {
  return (
    <div className="article-prose">
      {text.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i} className="type-section mt-8">{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i} className="type-h3 mt-8">{line.slice(4)}</h3>;
        if (line.startsWith("- ")) {
          return (
            <li
              key={i}
              className="type-body ms-5 list-disc"
              dangerouslySetInnerHTML={{ __html: withLinks(withInlineBold(escapeHtml(line.slice(2)))) }}
            />
          );
        }
        if (!line.trim()) return <br key={i} />;
        const boldTitle = unwrapMarkdownBoldLine(line);
        const headingSource = boldTitle ?? line;
        if (looksLikeArticleHeading(headingSource) && (boldTitle || /^\d+\.\s+\S/.test(line))) {
          const Tag = i === 0 || !/^\d+\.\s+\S/.test(headingSource) ? "h2" : "h3";
          const className = Tag === "h2" ? "type-section mt-8" : "type-h3 mt-8";
          return <Tag key={i} className={className}>{headingSource}</Tag>;
        }
        return (
          <p
            key={i}
            className="type-body mt-3"
            dangerouslySetInnerHTML={{ __html: withLinks(withInlineBold(escapeHtml(line))) }}
          />
        );
      })}
    </div>
  );
}
