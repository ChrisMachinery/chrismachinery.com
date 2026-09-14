"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Card, Checkbox, Flex, Stack, Text } from "@sanity/ui";
import { set, unset, type ArrayOfPrimitivesInputProps, useClient } from "sanity";

type KitchenItem = { itemId?: string; name?: string; price?: number; category?: string };

export function SolutionEquipmentInput(props: ArrayOfPrimitivesInputProps) {
  const { value, onChange } = props;
  const client = useClient({ apiVersion: "2024-08-21" }).withConfig({ perspective: "raw" });
  const [items, setItems] = useState<KitchenItem[]>([]);
  const selected = (Array.isArray(value) ? value : []).map(String);

  useEffect(() => {
    let cancelled = false;
    void client
      .fetch<KitchenItem[] | null>(
        `coalesce(
          *[_id == "drafts.customizeCatalog"][0].kitchenEquipment,
          *[_id == "customizeCatalog"][0].kitchenEquipment
        )`,
      )
      .then((list) => {
        if (!cancelled) setItems(list || []);
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const grouped = useMemo(() => {
    const map = new Map<string, KitchenItem[]>();
    for (const item of items) {
      const category = item.category || "Other";
      map.set(category, [...(map.get(category) || []), item]);
    }
    return [...map.entries()];
  }, [items]);

  function toggle(id: string, on: boolean) {
    const next = on ? [...new Set([...selected, id])] : selected.filter((item) => item !== id);
    onChange(next.length ? set(next) : unset());
  }

  if (!items.length) {
    return (
      <Card padding={3} tone="caution" border>
        <Text size={1}>
          还没有厨房设备目录。请先打开 Content → Customize 选配目录，添加 Kitchen equipment，再回到这里勾选方案配置。
        </Text>
      </Card>
    );
  }

  return (
    <Stack space={4}>
      <Text muted size={1}>
        从 Customize 厨房设备目录勾选。报价页会预勾这些项并带上目录里的价格。
      </Text>
      {grouped.map(([category, list]) => (
        <Stack key={category} space={2}>
          <Text weight="semibold" size={1}>
            {category}
          </Text>
          {list.map((item) => {
            const id = item.itemId || "";
            if (!id) return null;
            return (
              <Flex key={id} align="center" gap={2}>
                <Checkbox checked={selected.includes(id)} onChange={(event) => toggle(id, event.currentTarget.checked)} />
                <Box flex={1}>
                  <Text size={1}>
                    {item.name} — USD {item.price ?? 0}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      ))}
    </Stack>
  );
}
