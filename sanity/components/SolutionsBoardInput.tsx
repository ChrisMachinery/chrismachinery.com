import { useState } from "react";
import { Button, Stack, Text } from "@sanity/ui";
import { PatchEvent, set, useClient, type ArrayOfObjectsInputProps } from "sanity";

export function SolutionsBoardInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [busy, setBusy] = useState(false);

  async function fillCurrentSolutions() {
    setBusy(true);
    try {
      const docs = await client.fetch<{ _id: string }[]>(
        `*[_type == "solution" && defined(slug.current)] | order(title asc) { _id }`,
      );
      const seen = new Set<string>();
      const next = [];
      for (const doc of docs) {
        const id = doc._id.replace(/^drafts\./, "");
        if (seen.has(id)) continue;
        seen.add(id);
        next.push({
          _type: "reference" as const,
          _ref: id,
          _key: id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64) || `card${next.length}`,
        });
      }
      props.onChange(PatchEvent.from(set(next)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack space={3}>
      <Text size={1} muted>
        添加一行就多一张前台卡片，删掉一行就少一张。拖动可改顺序。列表为空时网站显示全部方案。
      </Text>
      <Button
        text={busy ? "载入中…" : "填入当前全部方案"}
        mode="ghost"
        disabled={busy}
        onClick={fillCurrentSolutions}
      />
      {props.renderDefault(props)}
    </Stack>
  );
}
