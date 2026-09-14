"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Checkbox, Container, Flex, Heading, Stack, Text, TextInput } from "@sanity/ui";
import { useClient } from "sanity";
import { publishedDocumentId } from "../lib/productSpreadsheet";

type ProductRow = {
  _id: string;
  title?: string;
  slug?: string;
  sku?: string;
  series?: string;
  length?: number;
  width?: number;
  height?: number;
  axle?: string;
};

const SERIES = ["pod", "airstream", "square", "container", "capsule", "others"] as const;

function groupProducts(docs: ProductRow[]) {
  const map = new Map<string, ProductRow[]>();
  for (const doc of docs) {
    const key = publishedDocumentId(doc._id);
    const list = map.get(key) || [];
    list.push(doc);
    map.set(key, list);
  }
  return [...map.entries()].map(([id, versions]) => {
    const published = versions.find((item) => !item._id.startsWith("drafts.")) || versions[0];
    return {
      id,
      ids: [...new Set(versions.map((item) => item._id))],
      title: published.title || "—",
      slug: published.slug || "—",
      sku: published.sku || "—",
      series: published.series || "—",
      size: [published.length, published.width, published.height].filter(Boolean).join("×") || "—",
      axle: published.axle || "—",
    };
  });
}

export function ProductBulkDeleteTool() {
  const client = useClient({ apiVersion: "2024-08-21" }).withConfig({ perspective: "raw" });
  const [rows, setRows] = useState<ReturnType<typeof groupProducts>>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [series, setSeries] = useState("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [log, setLog] = useState("");
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const docs = await client.fetch<ProductRow[]>(
        `*[_type == "product"]{_id, title, "slug": slug.current, sku, series, length, width, height, axle} | order(series asc, title asc)`,
      );
      setRows(groupProducts(docs || []));
      setSelected({});
      setConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "无法读取产品列表");
    } finally {
      setBusy(false);
    }
  }, [client]);

  useEffect(() => {
    void load();
    // client identity is stable in Studio; load once on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (series !== "all" && row.series !== series) return false;
      if (!q) return true;
      return [row.title, row.slug, row.sku, row.series, row.size].join(" ").toLowerCase().includes(q);
    });
  }, [rows, series, query]);

  const selectedIds = filtered.filter((row) => selected[row.id]).map((row) => row.id);

  function toggle(id: string, on: boolean) {
    setConfirming(false);
    setSelected((prev) => ({ ...prev, [id]: on }));
  }

  function toggleFiltered(on: boolean) {
    setConfirming(false);
    setSelected((prev) => {
      const next = { ...prev };
      for (const row of filtered) next[row.id] = on;
      return next;
    });
  }

  async function runDelete() {
    if (!selectedIds.length) return;
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setBusy(true);
    setError("");
    setLog("");
    try {
      const tx = client.transaction();
      const deleted: string[] = [];
      for (const id of selectedIds) {
        const row = rows.find((item) => item.id === id);
        for (const docId of row?.ids || [id]) tx.delete(docId);
        deleted.push(row?.title || id);
      }
      await tx.commit();
      setLog(`已删除 ${deleted.length} 个产品：${deleted.join("、")}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <Container width={4} padding={4}>
      <Stack space={4}>
        <Heading as="h2">批量删除产品</Heading>
        <Text muted>
          勾选要删的产品后删除。草稿和已发布会一起删，网站上也会消失。删除后无法从这里恢复。
        </Text>
        <Flex gap={3} wrap="wrap" align="center">
          <select
            value={series}
            disabled={busy}
            onChange={(event) => setSeries(event.currentTarget.value)}
            style={{ padding: "8px 10px", minWidth: 140 }}
          >
            <option value="all">全部系列</option>
            {SERIES.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="搜索标题 / Slug / SKU"
          />
          <Button text="刷新列表" mode="ghost" disabled={busy} onClick={() => void load()} />
          <Button text="全选当前列表" mode="ghost" disabled={busy || !filtered.length} onClick={() => toggleFiltered(true)} />
          <Button text="取消全选" mode="ghost" disabled={busy} onClick={() => toggleFiltered(false)} />
          <Button
            text={
              busy
                ? "处理中…"
                : confirming
                  ? `再点一次确认删除（${selectedIds.length}）`
                  : `删除所选（${selectedIds.length}）`
            }
            tone="critical"
            disabled={busy || selectedIds.length === 0}
            onClick={() => void runDelete()}
          />
        </Flex>
        {error ? (
          <Card padding={3} tone="critical">
            <Text>{error}</Text>
          </Card>
        ) : null}
        {log ? (
          <Card padding={3} tone="positive">
            <Text>{log}</Text>
          </Card>
        ) : null}
        <Text>
          共 {rows.length} 个产品，当前显示 {filtered.length}，已选 {selectedIds.length}
        </Text>
        <Card padding={3} border>
          <div style={{ overflow: "auto", maxHeight: 560 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["选", "Series", "Title", "SKU", "Slug", "尺寸", "Axle"].map((label) => (
                    <th key={label} style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "6px 8px" }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                      <Checkbox
                        checked={Boolean(selected[row.id])}
                        onChange={(event) => toggle(row.id, event.currentTarget.checked)}
                        disabled={busy}
                      />
                    </td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.series}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.title}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.sku}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.slug}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.size}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.axle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Stack>
    </Container>
  );
}
