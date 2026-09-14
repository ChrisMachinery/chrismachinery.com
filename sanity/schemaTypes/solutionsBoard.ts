import { defineField, defineType } from "sanity";
import { SolutionsBoardInput } from "../components/SolutionsBoardInput";

export const solutionsBoard = defineType({
  name: "solutionsBoard",
  title: "方案卡片",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "方案卡片",
      hidden: true,
    }),
    defineField({
      name: "cards",
      title: "前台展示的方案卡片",
      type: "array",
      description:
        "这是 Solutions 页卡片数量的开关：添加 / 删除 / 拖动即生效。点参考右侧可新建一张方案，或选已有 Beer Container、Coffee Shop 等。",
      of: [
        {
          type: "reference",
          to: [{ type: "solution" }],
          options: { disableNew: false },
        },
      ],
      components: { input: SolutionsBoardInput },
    }),
  ],
  preview: {
    prepare: () => ({ title: "方案卡片" }),
  },
});
