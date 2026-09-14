import { BarChartIcon } from "@sanity/icons/BarChart";
import { TrashIcon } from "@sanity/icons/Trash";
import { UploadIcon } from "@sanity/icons/Upload";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { presentationResolve } from "./presentationResolve";
import { schemaTypes } from "./schemaTypes";
import { previewAllowOrigins, previewOrigin } from "./lib/previewUrl";
import { CustomizeImportTool } from "./tools/CustomizeImportTool";
import { InquiryBulkDeleteTool } from "./tools/InquiryBulkDeleteTool";
import { InquiryStatsTool } from "./tools/InquiryStatsTool";
import { ProductBulkDeleteTool } from "./tools/ProductBulkDeleteTool";
import { ProductImportTool } from "./tools/ProductImportTool";
import { ProductImageImportTool } from "./tools/ProductImageImportTool";
import { DeleteInquiryAction } from "./tools/DeleteInquiryAction";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8qh6hm3j";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "chris-machinery",
  title: "Chris Machinery",
  projectId,
  dataset,
  document: {
    drafts: { enabled: true },
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((template) => template.templateId !== "customizeCatalog" && template.templateId !== "solutionsBoard")
        : prev,
    actions: (prev, { schemaType }) => {
      if (schemaType !== "inquiry") return prev;
      const withoutStockDelete = prev.filter((action) => action.action !== "delete");
      return [DeleteInquiryAction, ...withoutStockDelete];
    },
  },
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Page Content")
              .id("pageContent")
              .child(S.document().schemaType("pageContent").documentId("pageContent")),
            S.documentTypeListItem("sitePage").title("Website pages"),
            S.documentTypeListItem("product").title("Products"),
            S.listItem()
              .title("Customize 选配目录")
              .id("customize-catalog")
              .child(S.document().schemaType("customizeCatalog").documentId("customizeCatalog")),
            S.listItem()
              .title("表格导入选配")
              .id("customize-import")
              .icon(UploadIcon)
              .child(S.component(CustomizeImportTool).id("customize-import-tool").title("表格导入选配")),
            S.listItem()
              .title("表格导入产品")
              .id("product-import")
              .icon(UploadIcon)
              .child(S.component(ProductImportTool).id("product-import-tool").title("表格导入产品")),
            S.listItem()
              .title("表格导入产品图片")
              .id("product-image-import")
              .icon(UploadIcon)
              .child(S.component(ProductImageImportTool).id("product-image-import-tool").title("表格导入产品图片")),
            S.listItem()
              .title("批量删除产品")
              .id("product-bulk-delete")
              .icon(TrashIcon)
              .child(S.component(ProductBulkDeleteTool).id("product-bulk-delete-tool").title("批量删除产品")),
            S.documentTypeListItem("blogPost").title("Blog posts"),
            S.listItem()
              .title("方案卡片")
              .id("solutions-cards")
              .child(
                S.list()
                  .id("solutions-cards-list")
                  .title("方案卡片")
                  .items([
                    S.listItem()
                      .title("增减 / 排序（点这里控制数量）")
                      .id("solutions-board")
                      .child(S.document().schemaType("solutionsBoard").documentId("solutionsBoard")),
                    S.documentTypeListItem("solution").id("solution-docs").title("方案内容（图片 / 设备 / 车型）"),
                  ]),
              ),
            S.listItem()
              .title("询盘")
              .id("inquiries")
              .child(
                S.documentTypeList("inquiry")
                  .title("询盘列表")
                  .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
              ),
            S.listItem()
              .title("删除询盘")
              .id("inquiry-bulk-delete")
              .icon(TrashIcon)
              .child(S.component(InquiryBulkDeleteTool).id("inquiry-bulk-delete-tool").title("删除询盘")),
            S.listItem()
              .title("询盘统计与下载")
              .id("inquiry-stats")
              .icon(BarChartIcon)
              .child(S.component(InquiryStatsTool).id("inquiry-stats-tool").title("询盘统计与下载")),
          ]),
    }),
    presentationTool({
      resolve: presentationResolve,
      allowOrigins: previewAllowOrigins(),
      previewUrl: {
        initial: previewOrigin(),
        origin: previewOrigin(),
        preview: "/",
        allowOrigins: previewAllowOrigins(),
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
  tools: (prev) => [
    ...prev,
    {
      name: "customize-import",
      title: "表格导入选配",
      icon: UploadIcon,
      component: CustomizeImportTool,
    },
    {
      name: "product-import",
      title: "表格导入产品",
      icon: UploadIcon,
      component: ProductImportTool,
    },
    {
      name: "product-image-import",
      title: "表格导入产品图片",
      icon: UploadIcon,
      component: ProductImageImportTool,
    },
    {
      name: "product-bulk-delete",
      title: "批量删除产品",
      icon: TrashIcon,
      component: ProductBulkDeleteTool,
    },
    {
      name: "inquiry-bulk-delete",
      title: "删除询盘",
      icon: TrashIcon,
      component: InquiryBulkDeleteTool,
    },
    {
      name: "inquiry-stats",
      title: "询盘统计与下载",
      icon: BarChartIcon,
      component: InquiryStatsTool,
    },
  ],
});
