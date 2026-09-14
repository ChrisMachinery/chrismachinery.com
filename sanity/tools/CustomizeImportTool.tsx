"use client";

import { useState } from "react";
import { Button, Card, Container, Flex, Heading, Stack, Text } from "@sanity/ui";
import { useClient } from "sanity";
import * as XLSX from "xlsx";
import {
  customizeImportTemplateBook,
  parseExtrasRows,
  parseKitchenRows,
} from "../lib/customizeSpreadsheet";

const DOC_ID = "customizeCatalog";

async function rowsFromSheet(file: File, name: string) {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const match = workbook.SheetNames.find((item) => item.trim().toLowerCase() === name);
  if (!match) return [];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[match], { defval: "", raw: true });
}

export function CustomizeImportTool() {
  const client = useClient({ apiVersion: "2024-08-21" }).withConfig({ perspective: "raw" });
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState("");
  const [error, setError] = useState("");

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    setLog("");
    try {
      const extras = parseExtrasRows(await rowsFromSheet(file, "extras"));
      const kitchen = parseKitchenRows(await rowsFromSheet(file, "kitchen"));
      if (!extras.length && !kitchen.length) {
        throw new Error("没有读到 extras / kitchen 工作表，或表是空的。请先下载模板。");
      }
      await client.createIfNotExists({ _id: DOC_ID, _type: "customizeCatalog", title: "Customize catalog" });
      await client.patch(DOC_ID).set({ trailerExtras: extras, kitchenEquipment: kitchen, title: "Customize catalog" }).commit();
      setLog(`已覆盖选配目录：车身定制 ${extras.length} 项，厨房设备 ${kitchen.length} 项。请到 Solutions 里确认各方案勾选的 ID 仍存在。`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "导入失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container width={2} padding={4}>
      <Stack space={4}>
        <Heading as="h2">表格导入 Customize 选配</Heading>
        <Text muted>
          这是 Customize 的总目录，不是产品表。Solutions 只能勾选 kitchen 表里的设备。导入会整表覆盖目录，不改车型。
        </Text>
        <Flex gap={3} wrap="wrap">
          <Button
            text="下载模板"
            mode="ghost"
            disabled={busy}
            onClick={() => XLSX.writeFile(customizeImportTemplateBook(), "customize-options.xlsx")}
          />
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
      </Stack>
    </Container>
  );
}
