import { useEffect } from "react";
import { PatchEvent, set, SlugInput, type SlugInputProps, useFormValue } from "sanity";

function toSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function AutoSlugInput(props: SlugInputProps) {
  const title = useFormValue(["title"]);
  const current = props.value?.current;

  useEffect(() => {
    if (current || typeof title !== "string" || !title.trim()) return;
    const next = toSlug(title);
    if (!next) return;
    props.onChange(PatchEvent.from(set({ _type: "slug", current: next })));
  }, [current, title, props]);

  return <SlugInput {...props} />;
}
