import { useEffect, useState } from "react";
import { useClient, type ObjectInputProps } from "sanity";

type AssetMeta = {
  width: number;
  height: number;
  size?: number;
  filename?: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageWithSizeInput(props: ObjectInputProps) {
  const client = useClient({ apiVersion: "2024-08-21" });
  const ref = (props.value as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
  const [meta, setMeta] = useState<AssetMeta | null>(null);

  useEffect(() => {
    if (!ref) {
      setMeta(null);
      return;
    }
    let cancelled = false;
    client
      .fetch<{
        size?: number;
        originalFilename?: string;
        metadata?: { dimensions?: { width?: number; height?: number } };
      } | null>(`*[_id == $id][0]{size, originalFilename, metadata{dimensions}}`, { id: ref })
      .then((asset) => {
        if (cancelled) return;
        const width = asset?.metadata?.dimensions?.width;
        const height = asset?.metadata?.dimensions?.height;
        if (!width || !height) {
          setMeta(null);
          return;
        }
        setMeta({
          width,
          height,
          size: asset.size,
          filename: asset.originalFilename,
        });
      })
      .catch(() => {
        if (!cancelled) setMeta(null);
      });
    return () => {
      cancelled = true;
    };
  }, [client, ref]);

  return (
    <div>
      {props.renderDefault(props)}
      <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.4, color: "#4a5568" }}>
        {meta
          ? `${meta.width} × ${meta.height} px${meta.size ? ` · ${formatBytes(meta.size)}` : ""}${
              meta.filename ? ` · ${meta.filename}` : ""
            }`
          : "上传后显示宽 × 高和文件大小。封面建议 1600×900 px 或更大，横向。"}
      </p>
    </div>
  );
}
