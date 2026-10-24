import { articleHeadingClass, looksLikeArticleHeading, unwrapMarkdownBoldLine } from "@/lib/articleHeading";

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
  let headingCount = 0;
  return (
    <div className="article-prose">
      {text.split("\n").map((line, i) => {
        if (line.startsWith("## ") || line.startsWith("### ")) {
          const isLead = ++headingCount === 1;
          const Tag = isLead ? "h2" : "h3";
          return (
            <Tag key={i} className={articleHeadingClass(isLead)}>
              {line.replace(/^#{2,3}\s+/, "")}
            </Tag>
          );
        }
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
        if (looksLikeArticleHeading(headingSource, Boolean(boldTitle))) {
          const isLead = ++headingCount === 1;
          const Tag = isLead ? "h2" : "h3";
          return (
            <Tag key={i} className={articleHeadingClass(isLead)}>
              {headingSource}
            </Tag>
          );
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
