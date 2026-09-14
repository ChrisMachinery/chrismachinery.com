"use client";

import { FormEvent, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import type { Lead } from "@/lib/types";
import {
  inquiriesWorkbook,
  inquiryDate,
  inquiryMaterial,
  inquiryModel,
  inquiryRemarks,
  inquiryShape,
  rankModels,
  dash,
  type InquiryRow,
} from "@/lib/inquiryExport";

function leadRow(lead: Lead): InquiryRow {
  return {
    inquiryId: lead.inquiryId,
    createdAt: lead.createdAt,
    country: lead.country || lead.geo,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    productName: lead.product,
    shape: lead.shape,
    material: lead.material,
    message: lead.message,
    series: typeof lead.customConfig?.series === "string" ? lead.customConfig.series : undefined,
    sizeLabel: typeof lead.customConfig?.sizeLabel === "string" ? lead.customConfig.sizeLabel : undefined,
    solutionName: typeof lead.customConfig?.solutionName === "string" ? lead.customConfig.solutionName : undefined,
  };
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  async function load(event?: FormEvent) {
    event?.preventDefault();
    const headers = { "x-admin-key": key };
    const [leadsRes] = await Promise.all([
      fetch("/api/admin/leads", { headers }),
    ]);
    if (!leadsRes.ok) {
      setError("Unauthorized");
      return;
    }
    setError("");
    setLeads((await leadsRes.json()) as Lead[]);
  }

  const rows = useMemo(() => leads.map(leadRow), [leads]);
  const ranking = useMemo(() => rankModels(rows), [rows]);

  function downloadLeads() {
    XLSX.writeFile(inquiriesWorkbook(rows), `inquiries-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="type-page">CMS / Leads</h1>
      <p className="mt-2 text-sm text-black/70">
        正式统计请用 Sanity Studio → 询盘统计与下载。本页只读本机 leads.json 备份，库存请在产品文档里改。
      </p>
      <form onSubmit={load} className="mt-4 flex gap-2">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="min-h-11 rounded border px-3"
          placeholder="ADMIN_KEY"
        />
        <button className="min-touch rounded bg-accent px-4 font-heading">Load</button>
      </form>
      {error ? <p className="mt-2 text-red-700">{error}</p> : null}

      <h2 className="type-section mt-12">热门型号</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">排名</th>
              <th className="p-2">型号</th>
              <th className="p-2">询盘数量</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item) => (
              <tr key={item.model} className="border-b">
                <td className="p-2">{item.rank}</td>
                <td className="p-2">{item.model}</td>
                <td className="p-2">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="type-section mt-12">Leads</h2>
      <button type="button" onClick={downloadLeads} className="mt-2 min-touch rounded bg-accent px-4 font-heading">
        下载 Excel
      </button>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
                <th className="p-2">日期</th>
                <th className="p-2">国家</th>
                <th className="p-2">客户名</th>
                <th className="p-2">询盘型号</th>
                <th className="p-2">造型</th>
                <th className="p-2">材质</th>
                <th className="p-2">邮箱</th>
                <th className="p-2">电话</th>
                <th className="p-2">备注</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.inquiryId} className="border-b align-top">
                  <td className="p-2">{inquiryDate(row)}</td>
                  <td className="p-2">{dash(row.country)}</td>
                  <td className="p-2">{dash(row.name)}</td>
                  <td className="p-2">{inquiryModel(row)}</td>
                  <td className="p-2">{inquiryShape(row)}</td>
                  <td className="p-2">{inquiryMaterial(row)}</td>
                  <td className="p-2">{dash(row.email)}</td>
                  <td className="p-2">{dash(row.phone)}</td>
                  <td className="max-w-sm whitespace-pre-wrap p-2 text-xs">{inquiryRemarks(row)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
