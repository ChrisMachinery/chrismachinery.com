import { set, unset, useFormValue, type StringInputProps } from "sanity";
import { filterOptions } from "../../src/data/products";

type SeriesKey = keyof typeof filterOptions;
type Param = "length" | "width" | "axle" | "shape" | "material";

function seriesFromPath(path?: unknown): SeriesKey | undefined {
  const slug = String(path || "").replace(/^\/products\//, "");
  if (slug in filterOptions) return slug as SeriesKey;
  return undefined;
}

function mmOptions(series: SeriesKey, param: "length" | "width") {
  return [...filterOptions[series][param]];
}

function labelOptions(series: SeriesKey, param: "axle" | "shape" | "material") {
  return [...filterOptions[series][param]];
}

function selectedMm(value: string | undefined, options: number[]) {
  const nums = new Set((value || "").match(/\d+/g)?.map(Number) ?? []);
  return options.filter((item) => nums.has(item));
}

function selectedLabels(value: string | undefined, options: string[]) {
  const raw = value || "";
  return options.filter((item) => {
    if (raw.includes(item)) return true;
    const prefix = item.match(/^(\d+)/);
    if (prefix && new RegExp(`\\b${prefix[1]}\\b`).test(raw)) return true;
    return false;
  });
}

function formatMm(values: number[]) {
  return values.length ? `${values.join(" / ")} mm` : "";
}

function formatLabels(values: string[]) {
  if (values.length === 2) return `${values[0]} or ${values[1]}`;
  return values.join(" / ");
}

function ChoiceRow({
  items,
  checked,
  onToggle,
}: {
  items: { title: string; value: string }[];
  checked: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {items.map((item) => (
        <label key={item.value} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={checked.includes(item.value)}
            onChange={() => onToggle(item.value)}
          />
          {item.title}
        </label>
      ))}
    </div>
  );
}

function GuideMmInput(props: StringInputProps, param: "length" | "width") {
  const series = seriesFromPath(useFormValue(["path"]));
  const options = series ? mmOptions(series, param) : [];
  const current = selectedMm(typeof props.value === "string" ? props.value : undefined, options);
  const extra = (typeof props.value === "string" ? props.value : "")
    .match(/\d+/g)
    ?.map(Number)
    .filter((item) => !options.includes(item));
  const list = [...(extra ?? []), ...options];

  function toggle(n: number) {
    const next = current.includes(n) ? current.filter((item) => item !== n) : [...current, n].sort((a, b) => a - b);
    props.onChange(next.length ? set(formatMm(next)) : unset());
  }

  if (!series) {
    return props.renderDefault(props);
  }

  return (
    <ChoiceRow
      items={list.map((value) => ({ title: `${value} mm`, value: String(value) }))}
      checked={current.map(String)}
      onToggle={(value) => toggle(Number(value))}
    />
  );
}

function GuideLabelInput(props: StringInputProps, param: "axle" | "shape" | "material") {
  const series = seriesFromPath(useFormValue(["path"]));
  const options = series ? labelOptions(series, param) : [];
  const current = selectedLabels(typeof props.value === "string" ? props.value : undefined, options);
  const extra =
    typeof props.value === "string" && props.value.trim() && !current.length ? [props.value.trim()] : [];
  const list = [...extra.filter((item) => !options.includes(item)), ...options];

  function toggle(value: string) {
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    props.onChange(next.length ? set(formatLabels(next)) : unset());
  }

  if (!series) {
    return props.renderDefault(props);
  }

  return (
    <ChoiceRow
      items={list.map((value) => ({ title: value, value }))}
      checked={current}
      onToggle={toggle}
    />
  );
}

export function GuideLengthInput(props: StringInputProps) {
  return GuideMmInput(props, "length");
}

export function GuideWidthInput(props: StringInputProps) {
  return GuideMmInput(props, "width");
}

export function GuideAxleInput(props: StringInputProps) {
  return GuideLabelInput(props, "axle");
}

export function GuideShapeInput(props: StringInputProps) {
  return GuideLabelInput(props, "shape");
}

export function GuideMaterialInput(props: StringInputProps) {
  return GuideLabelInput(props, "material");
}
