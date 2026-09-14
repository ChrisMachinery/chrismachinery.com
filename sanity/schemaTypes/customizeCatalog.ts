import { defineField, defineType } from "sanity";
import { EQUIPMENT_CATEGORIES } from "../../src/data/catalog";

export const customizeCatalog = defineType({
  name: "customizeCatalog",
  title: "Customize 选配目录",
  type: "document",
  description:
    "Master lists for the Customize page. Solutions can only pick kitchen items from this catalog.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Customize catalog",
      hidden: true,
    }),
    defineField({
      name: "trailerExtras",
      title: "Trailer extras / 车身定制",
      type: "array",
      description: "Customize 页按数量加减的项目（Range hood、Sliding doors 等）。改这里会立刻影响报价。",
      of: [
        {
          type: "object",
          name: "trailerExtra",
          fields: [
            defineField({
              name: "itemId",
              title: "ID",
              type: "string",
              description: "英文短横线，例如 range-hood。方案和已保存草稿用这个 ID，改名可以，尽量不要改 ID。",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "price",
              title: "Price (USD)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: { title: "name", id: "itemId", price: "price" },
            prepare: ({ title, id, price }) => ({
              title: title || id,
              subtitle: `${id || "—"} · USD ${price ?? 0}`,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "kitchenEquipment",
      title: "Kitchen equipment / 厨房设备",
      type: "array",
      description: "Customize 页勾选的厨房设备。Solutions 的 Standard equipment 只能从这份列表里选。",
      of: [
        {
          type: "object",
          name: "kitchenEquipmentItem",
          fields: [
            defineField({
              name: "itemId",
              title: "ID",
              type: "string",
              description: "英文短横线，例如 fryer、hood。Fast Food 等方案勾选的是这个 ID。",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: { list: EQUIPMENT_CATEGORIES.map((item) => ({ title: item, value: item })) },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "price",
              title: "Price (USD)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: { title: "name", category: "category", id: "itemId", price: "price" },
            prepare: ({ title, category, id, price }) => ({
              title: title || id,
              subtitle: `${category || "—"} · ${id || "—"} · USD ${price ?? 0}`,
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Customize 选配目录", subtitle: "Trailer extras + kitchen equipment" }),
  },
});
