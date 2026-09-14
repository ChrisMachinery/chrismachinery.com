import * as XLSX from "xlsx";

export type InquiryRow = {
  _id?: string;
  inquiryId?: string;
  createdAt?: string;
  country?: string;
  name?: string;
  email?: string;
  phone?: string;
  productName?: string;
  productSlug?: string;
  productTitle?: string;
  refSlug?: string;
  series?: string;
  sizeLabel?: string;
  solutionName?: string;
  shape?: string;
  material?: string;
  status?: string;
  message?: string;
};

export function dash(value?: string | null) {
  return (value || "").trim() || "-";
}

export function parseMessageFields(message?: string) {
  const text = (message || "").replace(/\r/g, "");
  const pick = (labels: string[]) => {
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      for (const label of labels) {
        const dotted = trimmed.match(new RegExp(`^${label}\\.+(.*)$`, "i"));
        if (dotted?.[1]?.trim()) return dotted[1].replace(/x/g, "x").trim();
        const colon = trimmed.match(new RegExp(`^${label}\\s*[:：]\\s*(.+)$`, "i"));
        if (colon?.[1]?.trim()) return colon[1].trim();
      }
    }
    return "";
  };
  return {
    series: pick(["Series", "车型"]),
    shape: pick(["Shape", "造型"]),
    size: pick(["Body size", "尺寸"]),
    material: pick(["Material", "材质"]),
    solution: pick(["Solution", "方案"]),
  };
}

function filled(...values: (string | undefined)[]) {
  for (const value of values) {
    const text = (value || "").trim();
    if (text && text !== "-") return text;
  }
  return "";
}

export function inquiryDate(row: InquiryRow) {
  const raw = row.createdAt || "";
  const day = raw.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : dash(raw);
}

export function inquiryModel(row: InquiryRow) {
  const parsed = parseMessageFields(row.message);
  return dash(
    filled(
      row.productName,
      row.productTitle,
      [filled(row.series, parsed.series), filled(row.sizeLabel, parsed.size)].filter(Boolean).join(" "),
      row.productSlug,
      row.refSlug,
    ),
  );
}

export function inquirySeries(row: InquiryRow) {
  return dash(filled(row.series, parseMessageFields(row.message).series));
}

export function inquirySize(row: InquiryRow) {
  return dash(filled(row.sizeLabel, parseMessageFields(row.message).size)?.replace(/×/g, "x"));
}

export function inquiryShape(row: InquiryRow) {
  return dash(filled(row.shape, parseMessageFields(row.message).shape));
}

export function inquiryMaterial(row: InquiryRow) {
  return dash(filled(row.material, parseMessageFields(row.message).material));
}

export function inquirySolution(row: InquiryRow) {
  return dash(filled(row.solutionName, parseMessageFields(row.message).solution));
}

export function inquiryRemarks(row: InquiryRow) {
  return dash((row.message || "").replace(/\r\n/g, "\n").trim());
}

export function rankModels(rows: InquiryRow[]) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = inquiryModel(row);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([model, count], index) => ({ rank: index + 1, model, count }));
}

export function inquiryDetailRecord(row: InquiryRow) {
  return {
    日期: inquiryDate(row),
    国家: dash(row.country),
    客户名: dash(row.name),
    询盘型号: inquiryModel(row),
    车型: inquirySeries(row),
    尺寸: inquirySize(row),
    造型: inquiryShape(row),
    材质: inquiryMaterial(row),
    方案: inquirySolution(row),
    邮箱: dash(row.email),
    电话: dash(row.phone),
    询盘编号: dash(row.inquiryId),
    状态: dash(row.status),
    备注: inquiryRemarks(row),
  };
}

function sheetFromRecords(records: Record<string, string>[]) {
  const headers = records.length ? Object.keys(records[0]) : ["日期"];
  const aoa = [headers, ...records.map((row) => headers.map((key) => row[key] ?? "-"))];
  const sheet = XLSX.utils.aoa_to_sheet(aoa, { cellDates: false });
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");
  for (let r = 0; r <= range.e.r; r += 1) {
    for (let c = 0; c <= range.e.c; c += 1) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[addr];
      if (!cell) continue;
      cell.t = "s";
      cell.v = String(cell.v ?? "");
      cell.z = "@";
    }
  }
  sheet["!cols"] = headers.map((header) => ({ wch: header === "备注" ? 60 : Math.max(12, header.length + 4) }));
  return sheet;
}

export function inquiriesWorkbook(rows: InquiryRow[]) {
  const list = rows.map(inquiryDetailRecord);
  const rank = rankModels(rows).map((item) => ({
    排名: String(item.rank),
    型号: item.model,
    询盘数量: String(item.count),
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheetFromRecords(list), "询盘明细");
  XLSX.utils.book_append_sheet(workbook, sheetFromRecords(rank), "热门型号");
  return workbook;
}
