"use client";

import { useMemo, useRef, useState } from "react";
import { Button, Card, Checkbox, Container, Flex, Heading, Stack, Text } from "@sanity/ui";
import { useClient } from "sanity";
import * as XLSX from "xlsx";
import { publishedDocumentId } from "../lib/productSpreadsheet";
import {
  IMAGE_IMPORT_TEMPLATE_HEADERS,
  imageImportExampleRows,
  parseAltCatalog,
  planImageImport,
  type ImageImportPlan,
  type ImageImportProduct,
} from "../lib/productImageImport";

function draftId(id: string) {
  const pub = publishedDocumentId(id);
  return pub.startsWith("drafts.") ? pub : `drafts.${pub}`;
}

function isImportableImage(file: File) {
  if (file.type.startsWith("image/")) return true;
  if (/\.(jpe?g|png|webp|gif|bmp|tif|heic)$/i.test(file.name)) return true;
  if (/\.(xlsx|xls|csv|docx?|pdf|txt|zip)$/i.test(file.name)) return false;
  return /\d{3,4}\s*(ny|[capskf])\b/i.test(file.name) || /\(\d+\)/.test(file.name);
}

async function readAltSheet(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: false });
  const name =
    workbook.SheetNames.find((item) => /alt|图片|catalog/i.test(item)) || workbook.SheetNames[0];
  const sheet = workbook.Sheets[name];
  return {
    sheetName: name,
    rows: parseAltCatalog(XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: true })),
  };
}

function groupByProduct(plans: ImageImportPlan[]) {
  const map = new Map<string, ImageImportPlan[]>();
  for (const plan of plans) {
    if (!plan.product || plan.error) continue;
    const key = publishedDocumentId(plan.product._id);
    const list = map.get(key) || [];
    list.push(plan);
    map.set(key, list);
  }
  for (const list of map.values()) list.sort((a, b) => a.sequence - b.sequence);
  return map;
}

export function ProductImageImportTool() {
  const client = useClient({ apiVersion: "2024-08-21" }).withConfig({ perspective: "raw" });
  const [excelName, setExcelName] = useState("");
  const [catalogCount, setCatalogCount] = useState(0);
  const [plans, setPlans] = useState<ImageImportPlan[]>([]);
  const [replace, setReplace] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<ReturnType<typeof parseAltCatalog>>([]);
  const [products, setProducts] = useState<ImageImportProduct[]>([]);
  const [pickedCount, setPickedCount] = useState(0);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => {
    return plans.reduce(
      (acc, item) => {
        if (item.error) acc.skip += 1;
        else acc.ok += 1;
        return acc;
      },
      { ok: 0, skip: 0 },
    );
  }, [plans]);

  async function loadProducts() {
    const docs = await client.fetch<ImageImportProduct[]>(
      `*[_type == "product"]{_id, title, "slug": slug.current, sku, series, length, axle}`,
    );
    const byId = new Map<string, ImageImportProduct>();
    for (const doc of docs || []) {
      const key = publishedDocumentId(doc._id);
      const prev = byId.get(key);
      if (!prev || (prev._id.startsWith("drafts.") && !doc._id.startsWith("drafts."))) {
        byId.set(key, doc);
      }
    }
    const unique = [...byId.values()];
    setProducts(unique);
    return unique;
  }

  async function onExcel(file?: File) {
    if (!file) return;
    setError("");
    setExcelName(file.name);
    setBusy(true);
    try {
      const { sheetName, rows } = await readAltSheet(file);
      setCatalog(rows);
      setCatalogCount(rows.length);
      setLog([`已读取「${sheetName}」${rows.length} 条 Alt。再选择对应图片。`]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "无法读取表格");
    } finally {
      setBusy(false);
    }
  }

  async function onImages(list?: FileList | null) {
    const picked = [...(list || [])];
    if (!picked.length) {
      setError("没有选到文件。请在网盘文件夹里多选图片后点「打开」。");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const loaded = products.length ? products : await loadProducts();
      const files = picked.filter(isImportableImage);
      if (!files.length) {
        setPlans([]);
        setPickedCount(0);
        setError(`选了 ${picked.length} 个文件，但没有识别成图片（网盘文件可没有 .jpg 后缀，现已支持）。`);
        return;
      }
      const next = planImageImport(files, catalog, loaded);
      setPickedCount(files.length);
      setPlans(next);
      setLog([
        `已选 ${files.length} 张。可导入 ${next.filter((item) => !item.error).length} 张，跳过 ${next.filter((item) => item.error).length} 张。`,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "无法读取图片");
    } finally {
      setBusy(false);
    }
  }

  function downloadTemplate() {
    const sheet = XLSX.utils.aoa_to_sheet([
      [...IMAGE_IMPORT_TEMPLATE_HEADERS],
      ...imageImportExampleRows(),
    ]);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "alt");
    XLSX.writeFile(book, "product-image-alt.xlsx");
  }

  async function runImport() {
    const ready = plans.filter((item) => !item.error && item.product);
    if (!ready.length) return;
    setBusy(true);
    setError("");
    const lines: string[] = [];
    try {
      const grouped = groupByProduct(ready);
      for (const [productId, items] of grouped) {
        const uploaded: { sequence: number; alt: string; assetId: string; fileName: string }[] = [];
        for (const item of items) {
          const filename = /\.[a-z0-9]+$/i.test(item.fileName) ? item.fileName : `${item.fileName}.jpg`;
          const asset = await client.assets.upload("image", item.file, {
            filename,
            contentType: item.file.type || "image/jpeg",
          });
          uploaded.push({
            sequence: item.sequence,
            alt: item.alt,
            assetId: asset._id,
            fileName: item.fileName,
          });
          lines.push(`已上传 ${item.fileName} → ${item.product?.slug || productId}`);
        }
        const main = uploaded[0];
        const gallery = uploaded.map((item) => ({
          _type: "image" as const,
          _key: `${item.assetId.replace(/^image-/, "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 40)}${item.sequence}`,
          alt: item.alt,
          asset: { _type: "reference" as const, _ref: item.assetId },
        }));
        const mainImage = {
          _type: "image" as const,
          alt: main.alt,
          asset: { _type: "reference" as const, _ref: main.assetId },
        };
        const pubId = publishedDocumentId(productId);
        const targets = [...new Set([pubId, draftId(pubId)])];
        const existing = await client.getDocuments(targets);
        const ids = existing.filter(Boolean).map((doc) => doc!._id);
        const patchIds = ids.includes(pubId) ? ids : ids.length ? ids : [pubId];
        const tx = client.transaction();
        for (const id of patchIds) {
          if (replace) {
            tx.patch(id, { set: { mainImage, gallery } });
          } else {
            tx.patch(id, { set: { mainImage }, setIfMissing: { gallery: [] } });
            tx.patch(id, { insert: { after: "gallery[-1]", items: gallery } });
          }
        }
        await tx.commit();
        lines.push(`已写入产品 ${items[0]?.product?.slug || pubId}（主图 + ${gallery.length} 张，前台即可看到）`);
      }
      setLog(["导入完成：图片已写入已发布产品，刷新产品页即可看到。", ...lines]);
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
        <Heading as="h2">表格导入产品图片</Heading>
        <Text muted>
          用 Alt 表 + 网盘下下来的图片，自动对上已有产品并上传。文件名需带型号，例如
          {" "}
          <code>400C Tandem axle black (1).jpg</code>
          {" "}
          或
          {" "}
          <code>390NY Tandem axle black (1).jpg</code>
          Capsule = NY（390NY）。F = Square（280F）。400C = Container 4000mm。表格列：图片名称、图片序号、Alt 文案。
          默认第 (1) 张当主图，其余进 Gallery，并覆盖该产品旧图。百度网盘无法直接读取，请先下载到电脑再多选上传。
        </Text>
        <Flex gap={3} wrap="wrap" align="center">
          <Button text="下载 Alt 模板" mode="ghost" onClick={downloadTemplate} disabled={busy} />
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Text size={1}>1. Alt 表格</Text>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              disabled={busy}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = "";
                void onExcel(file);
              }}
            />
          </label>
          <Button
            text="2. 选择图片（可多选）"
            mode="ghost"
            disabled={busy}
            onClick={() => imageInputRef.current?.click()}
          />
          <input
            ref={imageInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            disabled={busy}
            onChange={(event) => {
              const list = event.currentTarget.files;
              void onImages(list);
              event.currentTarget.value = "";
            }}
          />
          <Checkbox
            checked={replace}
            onChange={() => setReplace((value) => !value)}
            disabled={busy}
          />
          <Text size={1}>覆盖该产品已有主图 / 图库</Text>
          <Button
            text={busy ? "处理中…" : `开始上传（${counts.ok} 张）`}
            tone="primary"
            disabled={busy || counts.ok === 0}
            onClick={() => void runImport()}
          />
        </Flex>
        {excelName ? <Text>表格：{excelName}（{catalogCount} 条 Alt）</Text> : <Text muted>没有表格也可以只凭文件名对产品，Alt 会空着。</Text>}
        {pickedCount ? <Text>已选图片：{pickedCount} 张</Text> : null}
        {error ? (
          <Card padding={3} tone="critical">
            <Text>{error}</Text>
          </Card>
        ) : null}
        {plans.length ? (
          <Card padding={3} border>
            <Stack space={3}>
              <Text>
                预览 {plans.length} 张：可导入 {counts.ok}，跳过 {counts.skip}
              </Text>
              <div style={{ overflow: "auto", maxHeight: 420 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["文件", "序号", "产品", "Alt", "说明"].map((label) => (
                        <th key={label} style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "6px 8px" }}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((item) => (
                      <tr key={item.fileName}>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{item.fileName}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{item.sequence}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>
                          {item.product ? `${item.product.series} / ${item.product.slug}` : "—"}
                        </td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{item.alt || "—"}</td>
                        <td style={{ padding: "6px 8px", borderBottom: "1px solid #eee", color: item.error ? "#b42318" : "#667" }}>
                          {item.error || "将上传"}
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
                <Text key={line} size={1}>
                  {line}
                </Text>
              ))}
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Container>
  );
}
