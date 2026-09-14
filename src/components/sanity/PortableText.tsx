import { stegaText } from "@/lib/sanity/visual";

type Span = { _type?: string; text?: string; marks?: string[] };
type Block = {
  _type?: string;
  _key?: string;
  style?: string;
  listItem?: string;
  children?: Span[];
};

export function PortableText({
  value,
  documentId,
  documentType = "blogPost",
}: {
  value?: unknown[];
  documentId?: string;
  documentType?: string;
}) {
  if (!value?.length) return null;

  return (
    <div className="space-y-3">
      {value.map((raw, index) => {
        const block = raw as Block;
        if (block._type !== "block") return null;
        const text = (block.children ?? []).map((child) => child.text ?? "").join("");
        const key = block._key ?? String(index);
        const path = block._key ? `body[_key=="${block._key}"]` : `body[${index}]`;
        const encoded = stegaText(documentId, documentType, path, text);
        if (block.style === "h2") return <h2 key={key} className="type-section mt-8">{encoded}</h2>;
        if (block.style === "h3") return <h3 key={key} className="type-sub mt-6">{encoded}</h3>;
        if (block.listItem === "bullet") return <li key={key} className="ms-5 list-disc">{encoded}</li>;
        if (block.style === "blockquote") return <blockquote key={key} className="type-body border-s-4 ps-4 italic">{encoded}</blockquote>;
        return <p key={key} className="type-body mt-3">{encoded}</p>;
      })}
    </div>
  );
}
