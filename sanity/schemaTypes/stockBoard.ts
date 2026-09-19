import { defineField, defineType } from "sanity";
import { StockBoardInput } from "../components/StockBoardInput";

export const stockBoard = defineType({
  name: "stockBoard",
  title: "现货卡片",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "现货卡片",
      hidden: true,
    }),
    defineField({
      name: "cards",
      title: "前台展示的现货卡片",
      type: "array",
      description:
        "In Stock 页卡片开关：添加 / 删除 / 拖动即生效。卖出一台就删掉对应卡片。点参考可新建现货车，或选已有条目。",
      of: [
        {
          type: "reference",
          to: [{ type: "stockUnit" }],
          options: { disableNew: false },
        },
      ],
      components: { input: StockBoardInput },
    }),
  ],
  preview: {
    prepare: () => ({ title: "现货卡片" }),
  },
});
