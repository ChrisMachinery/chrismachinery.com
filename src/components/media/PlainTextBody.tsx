import { vercelStegaClean } from "@vercel/stega";
import { cmsEdit, stegaText } from "@/lib/sanity/visual";

function isBullet(line: string) {
  return /^[-*•]\s+/.test(line);
}

function bulletText(line: string) {
  return line.replace(/^[-*•]\s+/, "");
}

function headingText(line: string) {
  const match = line.match(/^(#{2,3})\s+(.+)$/);
  return match ? match[2].trim() : null;
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

  return (
    <div className={className} {...edit}>
      {blocks.map((block, i) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const onlyHeading = lines.length === 1 ? headingText(lines[0]) : null;
        if (onlyHeading) {
          return (
            <h3 key={i} className={`type-card ${i === 0 ? "" : "mt-6"}`}>
              {encode(onlyHeading)}
            </h3>
          );
        }

        const bulletStart = lines.findIndex(isBullet);
        const intro = bulletStart === -1 ? lines : lines.slice(0, bulletStart);
        const bullets = bulletStart === -1 ? [] : lines.slice(bulletStart).filter(isBullet);
        const extra = bulletStart === -1 ? [] : lines.slice(bulletStart).filter((line) => !isBullet(line));

        return (
          <div key={i} className={i === 0 ? undefined : "mt-4"}>
            {intro.map((line, j) => {
              const heading = headingText(line);
              if (heading) {
                return (
                  <h3 key={`h-${j}`} className={j === 0 ? "type-card" : "type-card mt-6"}>
                    {encode(heading)}
                  </h3>
                );
              }
              const introHeading = j === intro.length - 1 && bullets.length > 0;
              if (introHeading) {
                return (
                  <p key={`s-${j}`} className="type-body font-semibold text-black/80">
                    {encode(line)}
                  </p>
                );
              }
              return (
                <p key={`p-${j}`} className={j === 0 ? "type-body" : "type-body mt-3"}>
                  {encode(line)}
                </p>
              );
            })}
            {bullets.length ? (
              <ul className={`type-body list-disc space-y-1.5 ps-5 ${intro.length ? "mt-2" : ""}`}>
                {bullets.map((line, j) => (
                  <li key={j}>{encode(bulletText(line))}</li>
                ))}
              </ul>
            ) : null}
            {extra.map((line, j) => (
              <p key={`e-${j}`} className="type-body mt-3">
                {encode(line)}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
