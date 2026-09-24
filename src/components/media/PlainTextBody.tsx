import { vercelStegaClean } from "@vercel/stega";
import { cmsEdit, stegaText } from "@/lib/sanity/visual";

function isBullet(line: string) {
  return /^[-*•]\s+/.test(line);
}

function isNumbered(line: string) {
  return /^\d+\.\s*\S/.test(line);
}

function bulletText(line: string) {
  return line.replace(/^[-*•]\s+/, "");
}

function headingText(line: string) {
  const match = line.match(/^(#{2,3})\s+(.+)$/);
  return match ? match[2].trim() : null;
}

function headingLevel(line: string): 2 | 3 | null {
  const match = line.match(/^(#{2,3})\s+(.+)$/);
  if (!match) return null;
  return match[1] === "##" ? 2 : 3;
}

function Inline({
  text,
  encode,
}: {
  text: string;
  encode: (value: string) => string;
}) {
  const parts = text.split(/(\*\*[^*]+?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*([^*]+?)\*\*$/);
        if (bold) {
          return (
            <strong key={i} className="font-semibold text-brand">
              {encode(bold[1])}
            </strong>
          );
        }
        return <span key={i}>{encode(part)}</span>;
      })}
    </>
  );
}

function NumberedLine({
  line,
  encode,
}: {
  line: string;
  encode: (value: string) => string;
}) {
  const match = line.match(/^(\d+)\.\s*(.+)$/);
  if (!match) return <Inline text={line} encode={encode} />;
  const rest = match[2];
  const labeled = rest.match(/^(.+?)([:：])\s*(.*)$/);
  if (labeled) {
    return (
      <>
        <strong className="font-semibold text-brand">{encode(`${labeled[1]}${labeled[2]} `)}</strong>
        <Inline text={labeled[3]} encode={encode} />
      </>
    );
  }
  return <Inline text={rest} encode={encode} />;
}

function headingClass(level: 2 | 3 | null, extra = "") {
  return `${level === 2 ? "type-section" : "type-h3"} ${extra}`.trim();
}

export function PlainTextBody({
  text,
  documentId,
  documentType = "pageContent",
  path,
  className = "mt-4",
}: {
  text: string;
  documentId?: string;
  documentType?: string;
  path?: string;
  className?: string;
}) {
  const clean = vercelStegaClean(text)
    .replace(/\r\n/g, "\n")
    .replace(/\s*(#{2,3}\s+)/g, "\n\n$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!clean) return null;

  const encode = (value: string) =>
    documentId && path ? stegaText(documentId, documentType, path, value) : value;

  const blocks = clean.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const edit = documentId && path ? cmsEdit(documentId, documentType, path) : undefined;
  const merged: string[][] = [];
  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const prev = merged[merged.length - 1];
    if (prev && prev.every(isNumbered) && lines.every(isNumbered)) {
      prev.push(...lines);
    } else {
      merged.push(lines);
    }
  }

  return (
    <div className={className} {...edit}>
      {merged.map((lines, i) => {
        const onlyHeading = lines.length === 1 ? headingText(lines[0]) : null;
        const onlyLevel = lines.length === 1 ? headingLevel(lines[0]) : null;

        if (onlyHeading) {
          const Tag = onlyLevel === 2 ? "h2" : "h3";
          const gap = i === 0 ? "" : onlyLevel === 2 ? "mt-8" : "mt-6 mb-1.5";
          return (
            <Tag key={i} className={headingClass(onlyLevel, gap)}>
              {encode(onlyHeading)}
            </Tag>
          );
        }

        if (lines.every(isNumbered)) {
          return (
            <ol key={i} className={`type-body list-decimal space-y-2.5 ps-5 ${i === 0 ? "" : "mt-2"}`}>
              {lines.map((line, j) => (
                <li key={j}>
                  <NumberedLine line={line} encode={encode} />
                </li>
              ))}
            </ol>
          );
        }

        const listStart = lines.findIndex((line) => isBullet(line) || isNumbered(line));
        const intro = listStart === -1 ? lines : lines.slice(0, listStart);
        const listLines = listStart === -1 ? [] : lines.slice(listStart);
        const bullets = listLines.filter(isBullet);
        const numbered = listLines.filter(isNumbered);
        const extra = listLines.filter((line) => !isBullet(line) && !isNumbered(line));

        return (
          <div key={i} className={i === 0 ? undefined : "mt-4"}>
            {intro.map((line, j) => {
              const heading = headingText(line);
              const level = headingLevel(line);
              if (heading) {
                const Tag = level === 2 ? "h2" : "h3";
                const extraClass =
                  j === 0 && (bullets.length || numbered.length) ? "mb-1.5" : j === 0 ? "" : level === 2 ? "mt-8" : "mt-6 mb-1.5";
                return (
                  <Tag key={`h-${j}`} className={headingClass(level, extraClass)}>
                    {encode(heading)}
                  </Tag>
                );
              }
              return (
                <p key={`p-${j}`} className={j === 0 ? "type-body" : "type-body mt-3"}>
                  <Inline text={line} encode={encode} />
                </p>
              );
            })}
            {numbered.length ? (
              <ol className={`type-body list-decimal space-y-2.5 ps-5 ${intro.length ? "mt-2" : ""}`}>
                {numbered.map((line, j) => (
                  <li key={j}>
                    <NumberedLine line={line} encode={encode} />
                  </li>
                ))}
              </ol>
            ) : null}
            {bullets.length ? (
              <ul className={`type-body list-disc space-y-1.5 ps-5 ${intro.length || numbered.length ? "mt-2" : ""}`}>
                {bullets.map((line, j) => (
                  <li key={j}>
                    <Inline text={bulletText(line)} encode={encode} />
                  </li>
                ))}
              </ul>
            ) : null}
            {extra.map((line, j) => (
              <p key={`e-${j}`} className="type-body mt-3">
                <Inline text={line} encode={encode} />
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
