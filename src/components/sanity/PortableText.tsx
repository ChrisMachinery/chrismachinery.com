import type { ReactNode } from "react";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { imageUrl } from "@/lib/sanity/client";
import { articleHeadingClass, looksLikeArticleHeading } from "@/lib/articleHeading";
import { cmsEdit, stegaText } from "@/lib/sanity/visual";

type Span = { _type?: string; _key?: string; text?: string; marks?: string[] };
type MarkDef = { _key?: string; _type?: string; href?: string };
type Block = {
  _type?: string;
  _key?: string;
  style?: string;
  listItem?: string;
  children?: Span[];
  markDefs?: MarkDef[];
  alt?: string;
};

function applyMarks(node: ReactNode, marks: string[] | undefined, markDefs: MarkDef[] | undefined, key: string) {
  let result = node;
  for (const mark of marks ?? []) {
    if (mark === "strong") {
      result = (
        <strong key={`${key}-s`} className="font-semibold [font-size:inherit] [line-height:inherit]">
          {result}
        </strong>
      );
    } else if (mark === "em") {
      result = <em key={`${key}-e`}>{result}</em>;
    } else if (mark === "underline") {
      result = <u key={`${key}-u`}>{result}</u>;
    } else if (mark === "code") {
      result = (
        <code key={`${key}-c`} className="rounded bg-black/5 px-1">
          {result}
        </code>
      );
    } else {
      const def = markDefs?.find((item) => item._key === mark);
      if (def?._type === "link" && def.href) {
        result = (
          <a
            key={`${key}-a`}
            href={def.href}
            className="font-semibold text-brand underline underline-offset-2"
            target={def.href.startsWith("http") ? "_blank" : undefined}
            rel={def.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {result}
          </a>
        );
      }
    }
  }
  return result;
}

function spansToLines(spans: Span[]): Span[][] {
  const lines: Span[][] = [[]];
  for (const span of spans) {
    if (span._type === "break") {
      lines.push([]);
      continue;
    }
    const pieces = (span.text ?? "").split("\n");
    pieces.forEach((piece, i) => {
      if (i > 0) lines.push([]);
      lines[lines.length - 1].push({ ...span, text: piece });
    });
  }
  return lines;
}

function lineText(spans: Span[]) {
  return spans.map((span) => span.text ?? "").join("");
}

function lineLooksLikeHeading(spans: Span[]) {
  const text = lineText(spans).trim();
  const marked = spans.filter((span) => (span.text ?? "").trim());
  const allStrong = marked.length > 0 && marked.every((span) => (span.marks ?? []).includes("strong"));
  return looksLikeArticleHeading(text, allStrong);
}

function Inline({
  spans,
  markDefs,
  documentId,
  documentType,
  path,
}: {
  spans: Span[];
  markDefs?: MarkDef[];
  documentId?: string;
  documentType?: string;
  path: string;
}) {
  return (
    <>
      {spans.map((span, i) => {
        const raw = span.text ?? "";
        const encoded =
          documentId && span._key
            ? stegaText(documentId, documentType || "blogPost", `${path}.children[_key=="${span._key}"]`, raw)
            : raw;
        return (
          <span key={span._key || i}>
            {applyMarks(encoded, span.marks, markDefs, `${span._key || i}`)}
          </span>
        );
      })}
    </>
  );
}

function ParagraphsFromSpans({
  spans,
  markDefs,
  documentId,
  documentType,
  path,
  edit,
  takeHeading,
}: {
  spans: Span[];
  markDefs?: MarkDef[];
  documentId?: string;
  documentType?: string;
  path: string;
  edit?: ReturnType<typeof cmsEdit>;
  takeHeading: () => boolean;
}) {
  const lines = spansToLines(spans);
  const groups: Span[][][] = [];
  let current: Span[][] = [];
  const flush = () => {
    if (current.length) groups.push(current);
    current = [];
  };
  for (const line of lines) {
    if (!lineText(line).trim()) {
      flush();
      continue;
    }
    current.push(line);
  }
  flush();

  if (!groups.length) return null;

  return (
    <>
      {groups.map((group, g) => (
        <div key={g} className={g === 0 ? undefined : "mt-4"} {...edit}>
          {group.map((line, i) => {
            const heading = lineLooksLikeHeading(line);
            const isLead = heading ? takeHeading() : false;
            const Tag = heading ? (isLead ? "h2" : "h3") : "p";
            const className = heading ? articleHeadingClass(isLead) : "type-body mt-3";
            return (
              <Tag key={i} className={className}>
                <Inline
                  spans={line}
                  markDefs={markDefs}
                  documentId={documentId}
                  documentType={documentType}
                  path={path}
                />
              </Tag>
            );
          })}
        </div>
      ))}
    </>
  );
}

function isTextBlock(block: Block) {
  return block._type === "block" || Array.isArray(block.children);
}

export function PortableText({
  value,
  documentId,
  documentType = "blogPost",
  pathPrefix = "body",
}: {
  value?: unknown[];
  documentId?: string;
  documentType?: string;
  pathPrefix?: string;
}) {
  if (!value?.length) return null;

  const nodes: ReactNode[] = [];
  let index = 0;
  let headingCount = 0;
  const takeHeading = () => {
    headingCount += 1;
    return headingCount === 1;
  };

  while (index < value.length) {
    const block = value[index] as Block;
    const key = block._key ?? String(index);
    const path = block._key ? `${pathPrefix}[_key=="${block._key}"]` : `${pathPrefix}[${index}]`;
    const edit = cmsEdit(documentId, documentType, path);

    if (block._type === "image") {
      nodes.push(
        <ImgPlaceholder
          key={key}
          documentId={documentId}
          documentType={documentType}
          path={path}
          alt={block.alt || ""}
          className="my-6 min-h-48 w-full rounded-lg"
          src={imageUrl(block)}
        />,
      );
      index += 1;
      continue;
    }

    if (!isTextBlock(block)) {
      index += 1;
      continue;
    }

    if (block.listItem === "bullet" || block.listItem === "number") {
      const kind = block.listItem;
      const items: Block[] = [];
      while (index < value.length && (value[index] as Block).listItem === kind) {
        items.push(value[index] as Block);
        index += 1;
      }
      const Tag = kind === "number" ? "ol" : "ul";
      nodes.push(
        <Tag
          key={key}
          className={`type-body mt-3 space-y-1.5 ps-5 ${kind === "number" ? "list-decimal" : "list-disc"}`}
        >
          {items.map((item, i) => {
            const itemPath = item._key
              ? `${pathPrefix}[_key=="${item._key}"]`
              : `${pathPrefix}[${index - items.length + i}]`;
            return (
              <li key={item._key || i} {...cmsEdit(documentId, documentType, itemPath)}>
                <Inline
                  spans={item.children ?? []}
                  markDefs={item.markDefs}
                  documentId={documentId}
                  documentType={documentType}
                  path={itemPath}
                />
              </li>
            );
          })}
        </Tag>,
      );
      continue;
    }

    const spans = block.children ?? [];
    if (!block.style || block.style === "normal") {
      nodes.push(
        <ParagraphsFromSpans
          key={key}
          spans={spans}
          markDefs={block.markDefs}
          documentId={documentId}
          documentType={documentType}
          path={path}
          edit={edit}
          takeHeading={takeHeading}
        />,
      );
      index += 1;
      continue;
    }

    const inline = (
      <Inline
        spans={spans}
        markDefs={block.markDefs}
        documentId={documentId}
        documentType={documentType}
        path={path}
      />
    );
    if (block.style === "h1" || block.style === "h2" || block.style === "h3" || block.style === "h4") {
      const isLead = takeHeading();
      const Tag = isLead ? "h2" : "h3";
      nodes.push(
        <Tag key={key} className={articleHeadingClass(isLead)} {...edit}>
          {inline}
        </Tag>,
      );
    } else if (block.style === "blockquote") {
      nodes.push(
        <blockquote key={key} className="type-body mt-4 whitespace-pre-wrap border-s-4 border-black/20 ps-4 italic" {...edit}>
          {inline}
        </blockquote>,
      );
    } else {
      nodes.push(
        <p key={key} className="type-body mt-3 whitespace-pre-wrap" {...edit}>
          {inline}
        </p>,
      );
    }
    index += 1;
  }

  return <div className="article-prose space-y-1">{nodes}</div>;
}
