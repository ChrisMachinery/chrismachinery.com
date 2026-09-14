"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Checkbox, Container, Flex, Heading, Stack, Text, TextInput } from "@sanity/ui";
import { useClient } from "sanity";
import { publishedDocumentId } from "../lib/productSpreadsheet";

type InquiryDoc = {
  _id: string;
  inquiryId?: string;
  name?: string;
  createdAt?: string;
  country?: string;
  email?: string;
  productName?: string;
};

function groupInquiries(docs: InquiryDoc[]) {
  const map = new Map<string, InquiryDoc[]>();
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
      name: published.name || "—",
      date: typeof published.createdAt === "string" ? published.createdAt.slice(0, 10) : "—",
      country: published.country || "—",
      email: published.email || "—",
      productName: published.productName || "—",
      inquiryId: published.inquiryId || "—",
    };
  });
}

export function InquiryBulkDeleteTool() {
  const client = useClient({ apiVersion: "2024-08-21" });
  const clientRef = useRef(client);
  clientRef.current = client;
  const [rows, setRows] = useState<ReturnType<typeof groupInquiries>>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [log, setLog] = useState("");
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const docs = await clientRef.current.fetch<InquiryDoc[]>(
        `*[_type == "inquiry"]{_id, inquiryId, name, createdAt, country, email, productName} | order(createdAt desc)`,
      );
      setRows(groupInquiries(docs || []));
      setSelected({});
      setConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "无法读取询盘列表");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [row.name, row.email, row.country, row.productName, row.inquiryId, row.date].join(" ").toLowerCase().includes(q),
    );
  }, [rows, query]);

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
      const tx = clientRef.current.transaction();
      const deleted: string[] = [];
      for (const id of selectedIds) {
        const row = rows.find((item) => item.id === id);
        for (const docId of row?.ids || [id, `drafts.${id}`]) tx.delete(docId);
        deleted.push(row?.name || id);
      }
      await tx.commit();
      setLog(`已删除 ${deleted.length} 条询盘：${deleted.join("、")}`);
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
        <Heading as="h2">删除询盘</Heading>
        <Text muted>
          勾选后删除。草稿和已发布会一起删。单条也可在询盘详情右上角菜单选「删除询盘」。删除后无法从这里恢复。
        </Text>
        <Flex gap={3} wrap="wrap" align="center">
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="搜索姓名 / 邮箱 / 国家 / 型号"
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
          共 {rows.length} 条，当前显示 {filtered.length}，已选 {selectedIds.length}
        </Text>
        <Card padding={3} border>
          <div style={{ overflow: "auto", maxHeight: 560 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["选", "日期", "客户名", "国家", "邮箱", "询盘型号", "编号"].map((label) => (
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
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.date}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.name}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.country}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.email}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.productName}</td>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.inquiryId}</td>
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
