"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Button, Card, Container, Flex, Heading, Stack, Text } from "@sanity/ui";
import { useClient } from "sanity";
import * as XLSX from "xlsx";
import { inquiriesWorkbook, inquiryDate, inquiryModel, inquiryMaterial, inquiryRemarks, inquirySeries, inquiryShape, inquirySize, inquirySolution, rankModels, dash, type InquiryRow } from "../../src/lib/inquiryExport";

const QUERY = `*[_type == "inquiry" && !(_id in path("drafts.**"))] | order(createdAt desc) {
  _id,
  inquiryId,
  createdAt,
  country,
  name,
  email,
  phone,
  productName,
  productSlug,
  series,
  sizeLabel,
  solutionName,
  shape,
  material,
  status,
  message,
  "productTitle": product->title,
  "refSlug": product->slug.current
}`;

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const cell: CSSProperties = {
  borderBottom: "1px solid #e3e3e3",
  padding: "8px 10px",
  textAlign: "left",
  verticalAlign: "top",
  whiteSpace: "nowrap",
};

const remarkCell: CSSProperties = {
  ...cell,
  whiteSpace: "pre-wrap",
  maxWidth: 360,
  minWidth: 220,
};

export function InquiryStatsTool() {
  const client = useClient({ apiVersion: "2024-08-21" });
  const clientRef = useRef(client);
  clientRef.current = client;
  const [rows, setRows] = useState<InquiryRow[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setBusy(true);
    setError("");
    try {
      setRows((await clientRef.current.fetch<InquiryRow[]>(QUERY)) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "读取询盘失败");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      try {
        const data = (await clientRef.current.fetch<InquiryRow[]>(QUERY)) ?? [];
        if (!cancelled) setRows(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "读取询盘失败");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ranking = useMemo(() => rankModels(rows), [rows]);

  function download() {
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(inquiriesWorkbook(rows), `inquiries-${stamp}.xlsx`);
  }

  return (
    <Container width={4} padding={4}>
      <Stack space={4}>
        <Heading as="h2">询盘统计与下载</Heading>
        <Text muted>
          网站提交的询盘会写入这里。表格含造型、材质、尺寸等，最后一列「备注」是客户当时提交的全部要求（含选配和厨房设备）。下载 Excel 可完整查看。
        </Text>
        <Flex gap={3} wrap="wrap">
          <Button text={busy ? "读取中…" : "刷新"} mode="ghost" disabled={busy} onClick={() => void load()} />
          <Button text="下载 Excel" tone="primary" disabled={!rows.length} onClick={download} />
        </Flex>
        {error ? (
          <Card padding={3} tone="critical">
            <Text>{error}</Text>
          </Card>
        ) : null}
        <Flex gap={3} wrap="wrap">
          <Card padding={4} radius={2} shadow={1}>
            <Text size={1} muted>
              询盘总数
            </Text>
            <Heading as="h3">{rows.length}</Heading>
          </Card>
          <Card padding={4} radius={2} shadow={1}>
            <Text size={1} muted>
              型号数
            </Text>
            <Heading as="h3">{ranking.length}</Heading>
          </Card>
        </Flex>
        <Heading as="h3" size={1}>
          热门型号
        </Heading>
        <Card padding={0} radius={2} shadow={1} overflow="auto">
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cell}>排名</th>
                <th style={cell}>型号</th>
                <th style={cell}>询盘数量</th>
              </tr>
            </thead>
            <tbody>
              {ranking.length ? (
                ranking.map((item) => (
                  <tr key={item.model}>
                    <td style={cell}>{item.rank}</td>
                    <td style={cell}>{item.model}</td>
                    <td style={cell}>{item.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={cell} colSpan={3}>
                    暂无询盘。请确认网站已配置 SANITY_API_WRITE_TOKEN，否则询盘不会进后台。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
        <Heading as="h3" size={1}>
          询盘明细
        </Heading>
        <Card padding={0} radius={2} shadow={1} overflow="auto" style={{ maxHeight: 480 }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cell}>日期</th>
                <th style={cell}>国家</th>
                <th style={cell}>客户名</th>
                <th style={cell}>询盘型号</th>
                <th style={cell}>车型</th>
                <th style={cell}>尺寸</th>
                <th style={cell}>造型</th>
                <th style={cell}>材质</th>
                <th style={cell}>方案</th>
                <th style={cell}>邮箱</th>
                <th style={cell}>电话</th>
                <th style={cell}>编号</th>
                <th style={cell}>状态</th>
                <th style={cell}>备注</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id}>
                  <td style={cell}>{inquiryDate(row)}</td>
                  <td style={cell}>{dash(row.country)}</td>
                  <td style={cell}>{dash(row.name)}</td>
                  <td style={cell}>{inquiryModel(row)}</td>
                  <td style={cell}>{inquirySeries(row)}</td>
                  <td style={cell}>{inquirySize(row)}</td>
                  <td style={cell}>{inquiryShape(row)}</td>
                  <td style={cell}>{inquiryMaterial(row)}</td>
                  <td style={cell}>{inquirySolution(row)}</td>
                  <td style={cell}>{dash(row.email)}</td>
                  <td style={cell}>{dash(row.phone)}</td>
                  <td style={cell}>{dash(row.inquiryId)}</td>
                  <td style={cell}>{dash(row.status)}</td>
                  <td style={remarkCell} title={inquiryRemarks(row)}>
                    {inquiryRemarks(row)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Stack>
    </Container>
  );
}
