import type { Product, SeriesKey } from "@/data/products";
import { filterOptions } from "@/data/products";

export function seriesDefaultShapes(series?: SeriesKey): string[] {
  if (!series || !(series in filterOptions)) return [];
  const shapes = filterOptions[series as keyof typeof filterOptions].shape;
  return shapes ? [...shapes] : [];
}

export function productShapes(product: Pick<Product, "series" | "shape" | "shapes">): string[] {
  const fromList = (product.shapes ?? []).map((item) => item.trim()).filter(Boolean);
  if (fromList.length) return [...new Set(fromList)];
  if (product.shape?.trim()) return [product.shape.trim()];
  return seriesDefaultShapes(product.series);
}

export function productMaterials(product: Pick<Product, "material" | "materials">): string[] {
  const fromList = (product.materials ?? []).map((item) => item.trim()).filter(Boolean);
  if (fromList.length) return [...new Set(fromList)];
  if (product.material?.trim()) return [product.material.trim()];
  return [];
}

/** One catalog card = series + length + width + axle. Shape and material are options. */
export function productFamilyKey(
  product: Pick<Product, "series" | "length" | "width" | "axle">,
) {
  return [product.series, product.length, product.width, product.axle].join("|");
}

export function shapeChipLabel(shape: string) {
  return shape.replace(/\s*Arc$/i, "").trim() || shape;
}

export function shapeGroupLabel(shapes: string[]) {
  if (shapes.length && shapes.every((item) => /arc/i.test(item))) return "Arc";
  return "Shape";
}

export function mergeProductFamily(members: Product[]): Product {
  const [first, ...rest] = members;
  const shapes = [...new Set(members.flatMap((item) => productShapes(item)))];
  const materials = [...new Set(members.flatMap((item) => productMaterials(item)))];
  const gallery = [
    ...(first.galleryImages ?? []),
    ...rest.flatMap((item) => item.galleryImages ?? []),
  ].filter((image, index, all) => all.findIndex((other) => other.url === image.url) === index);
  return {
    ...first,
    shapes,
    shape: shapes[0],
    materials,
    material: materials[0],
    galleryImages: gallery.length ? gallery : first.galleryImages,
  };
}

export function groupProductsByFamily(products: Product[]): Product[] {
  const groups = new Map<string, Product[]>();
  for (const item of products) {
    const key = productFamilyKey(item);
    const list = groups.get(key) || [];
    list.push(item);
    groups.set(key, list);
  }
  return [...groups.values()].map((members) =>
    mergeProductFamily(
      [...members].sort((a, b) => a.length - b.length || a.slug.localeCompare(b.slug)),
    ),
  );
}

export function withFamilyShapes(product: Product, catalog: Product[]): Product {
  const family = catalog.filter((item) => productFamilyKey(item) === productFamilyKey(product));
  if (family.length <= 1) {
    return {
      ...product,
      shapes: productShapes(product),
      shape: productShapes(product)[0],
      materials: productMaterials(product),
      material: productMaterials(product)[0],
    };
  }
  return mergeProductFamily([product, ...family.filter((item) => item.slug !== product.slug)]);
}

/** Hide shape filter when every model offers the same shape set. */
export function shapeFilterIsUseful(products: Product[]): boolean {
  if (products.length < 2) return false;
  const signatures = products.map((item) => productShapes(item).slice().sort().join("|"));
  return signatures.some((item) => item !== signatures[0]);
}

/** Hide material filter when every model offers the same material set. */
export function materialFilterIsUseful(products: Product[]): boolean {
  if (products.length < 2) return false;
  const signatures = products.map((item) => productMaterials(item).slice().sort().join("|"));
  return signatures.some((item) => item !== signatures[0]);
}

export function parseShapeList(value?: string): string[] {
  if (!value?.trim()) return [];
  return [
    ...new Set(
      value
        .split(/[,/|;，、]+/)
        .map((item) => item.replace(/\s+/g, " ").trim())
        .filter(Boolean),
    ),
  ];
}
