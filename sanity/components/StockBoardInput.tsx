import { Stack, Text } from "@sanity/ui";
import type { ArrayOfObjectsInputProps } from "sanity";

export function StockBoardInput(props: ArrayOfObjectsInputProps) {
  return (
    <Stack space={3}>
      <Text size={1} muted>
        添加一行就多一张前台卡片，删掉一行就少一张。拖动可改顺序。列表为空时 In Stock 页不展示车辆。
      </Text>
      {props.renderDefault(props)}
    </Stack>
  );
}
