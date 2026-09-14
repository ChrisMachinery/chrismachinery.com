"use client";

export function LinkPlaceholder({
  label,
  className = "",
  edit,
}: {
  label: string;
  className?: string;
  edit?: {
    "data-sanity": string;
    "data-sanity-edit-target": string;
    "data-sanity-overlay-element": "capture";
  };
}) {
  return (
    <button
      type="button"
      className={`link-placeholder min-touch ${className}`}
      title={`链接待替换：【LINK: ${label}】`}
      {...edit}
      onClick={() => {
        if (window.self !== window.top) return;
        window.alert(`链接待替换：【LINK: ${label}】`);
      }}
    >
      【LINK: {label}】
    </button>
  );
}
