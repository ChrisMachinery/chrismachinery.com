import { useMemo } from "react";
import { set, unset, useFormValue, type ArrayOfPrimitivesInputProps, type NumberInputProps, type StringInputProps } from "sanity";
import {
  catalogDimensionOptions,
  catalogMaterialOptions,
  catalogShapeOptions,
  loadCapacityOptions,
  overallHeightOptions,
  productOverallLength,
  productOverallWidth,
  productSizeFromDims,
} from "../../src/data/products";

type ListOption = { title: string; value: string | number };

/** Read-only computed field. Never call onChange — patching here crashed Studio. */
function ComputedReadout({ value }: { value: string }) {
  return (
    <input
      readOnly
      value={value}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "8px 12px",
        borderRadius: 3,
        border: "1px solid var(--card-border-color, #cacaca)",
        background: "var(--card-muted-bg-color, #f2f2f2)",
        color: "var(--card-fg-color, #101112)",
        font: "inherit",
      }}
    />
  );
}

function DropdownListInput({
  list,
  ...props
}: (NumberInputProps | StringInputProps) & { list: ListOption[] }) {
  const listKey = list.map((item) => `${item.title}:${item.value}`).join("|");
  const schemaType = useMemo(
    () => ({
      ...props.schemaType,
      options: {
        ...props.schemaType.options,
        list,
        layout: "dropdown" as const,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listKey],
  );

  return props.renderDefault({ ...props, schemaType } as typeof props);
}

function DimensionInput(props: NumberInputProps & { dimension: "length" | "width" | "height" }) {
  const series = useFormValue(["series"]) as string | undefined;
  const optionValues = catalogDimensionOptions(series)[props.dimension];
  const optionKey = optionValues.join(",");
  const current = typeof props.value === "number" ? props.value : undefined;
  const list = useMemo(() => {
    const values = current && !optionValues.includes(current) ? [current, ...optionValues] : optionValues;
    return values.map((value) => ({ title: `${value} mm`, value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, optionKey]);

  return <DropdownListInput {...props} list={list} />;
}

export function ProductLengthInput(props: NumberInputProps) {
  return <DimensionInput {...props} dimension="length" />;
}

export function ProductWidthInput(props: NumberInputProps) {
  return <DimensionInput {...props} dimension="width" />;
}

export function ProductHeightInput(props: NumberInputProps) {
  return <DimensionInput {...props} dimension="height" />;
}

export function ProductShapeInput(props: StringInputProps) {
  const series = useFormValue(["series"]) as string | undefined;
  const optionValues = catalogShapeOptions(series);
  const optionKey = optionValues.join("|");
  const current = typeof props.value === "string" ? props.value : undefined;
  const list = useMemo(() => {
    const values = current && !optionValues.includes(current) ? [current, ...optionValues] : optionValues;
    return values.map((value) => ({ title: value, value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, optionKey]);

  return <DropdownListInput {...props} list={list} />;
}

export function ProductMaterialsInput(props: ArrayOfPrimitivesInputProps) {
  const series = useFormValue(["series"]) as string | undefined;
  const legacy = useFormValue(["material"]) as string | undefined;
  const optionValues = catalogMaterialOptions(series);
  const stored = Array.isArray(props.value) ? props.value.map(String).filter(Boolean) : [];
  const current = stored.length ? stored : legacy ? [legacy] : [];
  const options = [...optionValues];
  for (const value of current) {
    if (!options.includes(value)) options.unshift(value);
  }

  function toggle(value: string) {
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    props.onChange(next.length ? set(next) : unset());
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {options.map((value) => (
        <label key={value} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={current.includes(value)} onChange={() => toggle(value)} />
          {value}
        </label>
      ))}
    </div>
  );
}

export function ProductShapesInput(props: ArrayOfPrimitivesInputProps) {
  const series = useFormValue(["series"]) as string | undefined;
  const legacy = useFormValue(["shape"]) as string | undefined;
  const optionValues = catalogShapeOptions(series);
  const stored = Array.isArray(props.value) ? props.value.map(String).filter(Boolean) : [];
  const current = stored.length ? stored : legacy ? [legacy] : [];
  const options = [...optionValues];
  for (const value of current) {
    if (!options.includes(value)) options.unshift(value);
  }

  function toggle(value: string) {
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    props.onChange(next.length ? set(next) : unset());
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {options.map((value) => (
        <label key={value} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={current.includes(value)} onChange={() => toggle(value)} />
          {value}
        </label>
      ))}
    </div>
  );
}

export function ProductSizeInput() {
  const length = useFormValue(["length"]) as number | undefined;
  const width = useFormValue(["width"]) as number | undefined;
  const height = useFormValue(["height"]) as number | undefined;
  return <ComputedReadout value={productSizeFromDims(length, width, height) || "—"} />;
}

export function ProductOverallLengthInput() {
  const length = useFormValue(["length"]) as number | undefined;
  const next = productOverallLength(length);
  return <ComputedReadout value={next ? `${next} mm` : "—"} />;
}

export function ProductOverallWidthInput() {
  const width = useFormValue(["width"]) as number | undefined;
  const next = productOverallWidth(width);
  return <ComputedReadout value={next ? `${next} mm` : "—"} />;
}

export function ProductOverallHeightInput(props: NumberInputProps) {
  const current = typeof props.value === "number" ? props.value : undefined;
  const list = useMemo(() => {
    const values =
      current && !overallHeightOptions.includes(current)
        ? [current, ...overallHeightOptions]
        : overallHeightOptions;
    return values.map((value) => ({ title: `${value} mm`, value }));
  }, [current]);

  return <DropdownListInput {...props} list={list} />;
}

export function ProductLoadCapacityInput(props: NumberInputProps) {
  const current = typeof props.value === "number" ? props.value : undefined;
  const list = useMemo(() => {
    const values =
      current && !loadCapacityOptions.includes(current)
        ? [current, ...loadCapacityOptions]
        : loadCapacityOptions;
    return values.map((value) => ({ title: `${value} KG`, value }));
  }, [current]);

  return <DropdownListInput {...props} list={list} />;
}
