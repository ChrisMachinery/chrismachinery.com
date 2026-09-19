import { defineField, defineType } from "sanity";

export const inquiry = defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({
      name: "inquiryId",
      title: "Inquiry ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "createdAt",
      title: "日期",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "country",
      title: "国家",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "客户名",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productName",
      title: "询盘型号",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "邮箱",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "电话",
      type: "string",
    }),
    defineField({
      name: "productSlug",
      title: "Product slug",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    }),
    defineField({ name: "series", title: "车型", type: "string" }),
    defineField({ name: "sizeLabel", title: "尺寸", type: "string" }),
    defineField({ name: "solutionName", title: "方案", type: "string" }),
    defineField({ name: "shape", title: "造型", type: "string" }),
    defineField({ name: "material", title: "材质", type: "string" }),
    defineField({
      name: "message",
      title: "备注 / 客户要求",
      type: "text",
      rows: 16,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "New" },
          { title: "Contacted", value: "Contacted" },
          { title: "Closed", value: "Closed" },
        ],
      },
      initialValue: "New",
    }),
  ],
  orderings: [
    {
      title: "Newest",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      country: "country",
      productName: "productName",
      createdAt: "createdAt",
    },
    prepare: ({ title, country, productName, createdAt }) => ({
      title: title || "-",
      subtitle: [typeof createdAt === "string" ? createdAt.slice(0, 10) : "", country || "-", productName || "-"].join(
        " · ",
      ),
    }),
  },
});
