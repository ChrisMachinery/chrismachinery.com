"use client";

import { useMemo, useState } from "react";
import { Button, Card, Container, Flex, Heading, Stack, Text } from "@sanity/ui";
import { useClient } from "sanity";
import * as XLSX from "xlsx";
import {
  PRODUCT_IMPORT_NOTES,
  PRODUCT_IMPORT_TEMPLATE_HEADERS,
  productImportExampleRows,
  documentIdForSlug,
  findExistingProduct,
  parseProductRows,
  pickProductSheetName,
  publishedDocumentId,
  toProductPatch,
  crossSeriesConflict,
  type ExistingProductRef,
  type ProductImportRow,
} from "../lib/productSpreadsheet";

type PreviewAction = "update" | "create" | "skip";

function draftId(id: string) {
  const pub = publishedDocumentId(id);
  return pub.startsWith("drafts.") ? pub : `drafts.${pub}`;
}

async function readSheet(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: false });
  const name = pickProductSheetName(workbook.SheetNames);
  const sheet = workbook.Sheets[name];
  return {
    sheetName: name,
    rows: XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: true }),
  };
}

export function ProductImportTool() {
  const client = useClient({ apiVersion: "2024-08-21" }).withConfig({ perspective: "raw" });
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ProductImportRow[]>([]);
  const [existing, setExisting] = useState<ExistingProductRef[]>([]);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState("");

  const preview = useMemo(() => {
    return rows.map((row) => {
      if (row.error) return { row, action: "skip" as PreviewAction, match: undefined };
      const conflict = crossSeriesConflict(row, existing);
      if (conflict) {
        return { row: { ...row, error: conflict }, action: "skip" as PreviewAction, match: undefined };
      }
      const match = findExistingProduct(row, existing);
      return { row, action: (match ? "update" : "create") as PreviewAction, match };
    });
  }, [rows, existing]);

  const counts = useMemo(() => {
    return preview.reduce(
      (acc, item) => {
        acc[item.action] += 1;
        return acc;
      },
      { update: 0, create: 0, skip: 0 },
    );
  }, [preview]);

  async function onFile(file?: File) {
    if (!file) return;
    setError("");
    setLog([]);
    setFileName(file.name);
    setBusy(true);
    try {
      const { sheetName, rows: raw } = await readSheet(file);
      const parsed = parseProductRows(raw);
      const listed = await client.fetch<ExistingProductRef[]>(
        `*[_type == "product"]{_id, series, "slug": slug.current, sku}`,
      );
      const idList = [
        ...new Set(
          parsed.flatMap((row) => {
            if (!row.slug) return [];
            const id = documentIdForSlug(row.slug);
            return [id, `drafts.${id}`];
          }),
        ),
      ];
      const byId = idList.length ? await client.getDocuments(idList) : [];
      const extras: ExistingProductRef[] = (byId || [])
        .filter((doc): doc is NonNullable<typeof doc> => Boolean(doc))
        .map((doc) => ({
          _id: doc._id,
          series: typeof doc.series === "string" ? doc.series : undefined,
          slug: typeof doc.slug === "object" && doc.slug && "current" in doc.slug ? String((doc.slug as { current?: string }).current || "") : undefined,
          sku: typeof doc.sku === "string" ? doc.sku : undefined,
        }));
      const merged = [...(listed || []), ...extras].filter(
        (item, index, all) => all.findIndex((other) => other._id === item._id) === index,
      );
      setRows(parsed);
      setExisting(merged);
      setLog([`已读取工作表「${sheetName}」。先按 Series 归类，只在同一系列内用 SKU / Slug 匹配。`]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "无法读取表格");
      setRows([]);
    } finally {
      setBusy(false);
    }
  }

  function downloadTemplate() {
    const products = XLSX.utils.aoa_to_sheet([
      [...PRODUCT_IMPORT_TEMPLATE_HEADERS],
      ...productImportExampleRows(),
    ]);
    const notes = XLSX.utils.aoa_to_sheet(PRODUCT_IMPORT_NOTES.map((row) => [...row]));
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, products, "products");
    XLSX.utils.book_append_sheet(book, notes, "说明");
    XLSX.writeFile(book, "product-import.xlsx");
  }

  async function runImport() {
    const work = preview.filter((item) => item.action !== "skip");
    if (!work.length) return;
    setBusy(true);
    setLog([]);
    const lines: string[] = [];
    try {
      const tx = client.transaction();
      for (const item of work) {
        if (item.action === "skip") continue;
        const patch = toProductPatch(item.row, item.action);
        if (item.action === "update" && item.match) {
          const target = item.match._id;
          tx.patch(target, { set: patch });
          const other = target.startsWith("drafts.") ? publishedDocumentId(target) : draftId(target);
          const otherExists = existing.some((doc) => doc._id === other);
          if (otherExists) tx.patch(other, { set: patch });
          lines.push(`更新 ${item.row.series} / ${item.row.slug}（${publishedDocumentId(target)}）`);
        } else {
          if (!patch.title || !patch.series) {
            lines.push(
              `跳过 ${item.row.slug || item.row.rowNumber}：新建需要 Title 和 Series`,
            );
            continue;
          }
          const id = documentIdForSlug(item.row.slug || `row-${item.row.rowNumber}`);
          tx.createIfNotExists({
            _id: id,
            _type: "product",
            ...patch,
          });
          tx.patch(id, { set: patch });
          lines.push(`${existing.some((doc) => publishedDocumentId(doc._id) === id) ? "更新" : "新建"} ${item.row.series} / ${item.row.slug}（${id}）`);
        }
      }
      await tx.commit();
      const listed = await client.fetch<ExistingProductRef[]>(
        `*[_type == "product"]{_id, series, "slug": slug.current, sku}`,
      );
      setExisting(listed || []);
      setLog(["导入完成。新建的产品已发布；请到 Products 里补图并检查规格。", ...lines]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "导入失败");
      setLog(lines);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container width={3} padding={4}>
      <Stack space={4}>
        <Heading as="h2">
          表格导入产品
        </Heading>
        <Text muted>
          上传 Excel / CSV（会读取 products / 产品 工作表，不会读「说明」）。先识别 Series，产品只进入该系列；匹配也只在同一系列内按 SKU，没有再按 Slug。
          已有产品只覆盖表格字段，不改图片。Series 可写英文或中文（方形车、集装箱、胶囊等）。一台车一行；shapes / materials 写选项，不要加价格列。
          Series 列可以合并单元格；长度 / 宽度 / Slug 不要合并，否则会把上一台车的尺寸填到后面所有行。
        </Text>
        <Text muted>
          必填：Series、Slug。Series 填 pod / airstream / square / container / capsule / others（或流线 / 方形车 / 集装箱 / 胶囊 / 其他）。
          Pod shapes 例：Dome, Square。Airstream：375 Arc, 500 Arc, 700 Arc。Square / Container：Square。Capsule：375 Arc。
          materials 例：Paint 或 Paint, Stainless steel（也可写喷漆 / 不锈钢）。不要填价格。
        </Text>
        <Flex gap={3} wrap="wrap" align="center">
            <Button text="下载空白模板" mode="ghost" onClick={downloadTemplate} disabled={busy} />
          <label style={{ display: "inline-flex" }}>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              disabled={busy}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = "";
                void onFile(file);
              }}
            />
          </label>
          <Button
            text={busy ? "处理中…" : `开始导入（更新 ${counts.update} / 新建 ${counts.create}）`}
            tone="primary"
            disabled={busy || counts.update + counts.create === 0}
            onClick={() => void runImport()}
          />
        </Flex>
        {fileName ? <Text>已选：{fileName}</Text> : null}
        {error ? (
          <Card padding={3} tone="critical">
            <Text>{error}</Text>
          </Card>
        ) : null}
        {rows.length ? (
          <Card padding={3} border>
            <Stack space={3}>
              <Text>
                预览 {rows.length} 行：更新 {counts.update}，新建 {counts.create}，跳过 {counts.skip}
              </Text>
              <div style={{ overflow: "auto", maxHeight: 420 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["行", "动作", "Series", "Slug", "Title", "weight", "load", "overall height", "说明"].map((label) => (
                        <th key={label} style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "6px 8px" }}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map(({ row, action }) => (
                      <tr key={row.rowNumber}>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.rowNumber}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                          {action === "update" ? "更新" : action === "create" ? "新建" : "跳过"}
                        </td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.series || "—"}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.slug || "—"}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.title || "—"}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.weight ?? "—"}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.loadCapacity ?? "—"}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{row.overallHeight ?? "—"}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                          {row.error || row.warnings.join("；") || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Stack>
          </Card>
        ) : null}
        {log.length ? (
          <Card padding={3} tone="positive">
            <Stack space={2}>
              {log.map((line) => (
                <Text key={line}>{line}</Text>
              ))}
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Container>
  );
}
