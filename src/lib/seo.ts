import type { Product } from "@/data/products";
import { productSizeLabel } from "@/data/products";
import { productShapes } from "@/lib/productFamily";
import { DEFAULT_OG, SITE_NAME, SITE_URL } from "@/lib/site";

export function productJsonLd(product: Product) {
  const availability =
    product.stockStatus === "In Stock"
      ? "https://schema.org/InStock"
      : product.stockStatus === "Out of Stock"
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/PreOrder";

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [
      product.imageUrl,
      ...(product.galleryImages?.map((item) => item.url) ?? []),
      DEFAULT_OG,
    ].filter((url, i, list): url is string => Boolean(url) && list.indexOf(url) === i),
    description: product.description,
    sku: product.sku,
    mpn: product.sku,
    brand: { "@type": "Brand", name: SITE_NAME },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Body size",
        value: productSizeLabel(product),
      },
      ...(product.weight
        ? [{ "@type": "PropertyValue", name: "Weight", value: `${product.weight}KG` }]
        : []),
      ...(productShapes(product).length
        ? [{ "@type": "PropertyValue", name: "Shape", value: productShapes(product).join(" / ") }]
        : []),
    ],
    offers: {
      "@type": "Offer",
      availability,
      itemCondition: "https://schema.org/NewCondition",
      url: `${SITE_URL}/products/${product.series}/${product.slug}`,
    },
  };
}
