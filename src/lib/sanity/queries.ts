export const productsQuery = `*[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))] | order(length asc) {
  _id,
  title,
  "slug": slug.current,
  series,
  size,
  price,
  sku,
  stock,
  stockStatus,
  material,
  materials,
  axles,
  axle,
  length,
  width,
  height,
  overallLength,
  overallWidth,
  overallHeight,
  weight,
  loadCapacity,
  shape,
  shapes,
  priceHigh,
  year,
  scene,
  glassCount,
  glassHeight,
  images,
  mainImage,
  gallery,
  description,
  features,
  customOptions,
  viewProductText,
  viewProductLink,
  quoteText,
  quoteLink,
  customizeText,
  customizeLink
}`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  series,
  size,
  price,
  sku,
  stock,
  stockStatus,
  material,
  materials,
  axles,
  axle,
  length,
  width,
  height,
  overallLength,
  overallWidth,
  overallHeight,
  weight,
  loadCapacity,
  shape,
  shapes,
  priceHigh,
  year,
  scene,
  glassCount,
  glassHeight,
  images,
  mainImage,
  gallery,
  description,
  features,
  customOptions,
  viewProductText,
  viewProductLink,
  quoteText,
  quoteLink,
  customizeText,
  customizeLink
}`;

export const blogPostsQuery = `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  coverImage,
  excerpt,
  author,
  publishedAt,
  tags,
  category
}`;

export const blogPostBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  coverImage,
  excerpt,
  body,
  author,
  publishedAt,
  tags,
  category
}`;

export const pageContentQuery = `*[
  _type == "pageContent" && (
    _id == "pageContent" ||
    slug.current == "home"
  )
] | order(_updatedAt desc)[0] {
  _id,
  _type,
  "slug": slug.current,
  homeHero,
  aboutUs,
  footerInfo,
  heroSlides[]{
    title,
    subtitle,
    image,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink
  },
  heroTitle,
  heroSubtitle,
  heroBackground,
  heroButtonText,
  heroButtonLink,
  aboutTitle,
  aboutButtonText,
  aboutContent,
  aboutImage,
  footerEmail,
  footerPhone,
  footerAddress,
  footerBlurb,
  footerSocialLinks,
  heroButtonProducts,
  advantagesTitle,
  advantages[]{ title, body, icon, image{..., alt} },
  productDetailsTitle,
  productDetails[]{ title, body, image },
  detailShotsTitle,
  detailShots[]{ caption, image{..., alt} },
  hotSeriesTitle,
  seriesCards[]{ name, caption, href, image },
  footprintTitle,
  testimonialsTitle,
  testimonials[]{ name, country, flag, text, photo },
  navHome,
  navProducts,
  navSolutions,
  navAbout,
  navCustomize,
  navBlog,
  navContact,
  brandName,
  logo,
  productCustomOptions
}`;

export const productIdBySlugQuery = `*[_type == "product" && slug.current == $slug][0]._id`;

export const sitePagesByPathsQuery = `*[_type == "sitePage" && path in $paths]{ _id, path, title }`;

export const sitePageByPathQuery = `*[_type == "sitePage" && path == $path][0] {
  _id,
  path,
  title,
  subtitle,
  heroImage,
  factoryArea,
  annualOutput,
  technicians,
  countries,
  factoryTitle,
  factoryBody,
  factoryVideoUrl,
  buildTitle,
  buildIntro,
  buildSteps[]{ title, body, images[]{..., alt}, image{..., alt} },
  flowImages,
  certImages,
  gallery,
  logos,
  mapImage,
  mapEmbedUrl,
  qrImage,
  address,
  faqTitle,
  faq,
  included,
  customizable,
  arcGuideTitle,
  arcGuideNote,
  arcGuides[]{ _key, label, body, image{..., alt} },
  customerPhotosTitle,
  customerPhotos[]{ image{..., alt} },
  podGuide{
    introTitle,
    intro,
    shapeBody,
    introImage{..., alt},
    sizeTitle,
    sizeNote,
    sizeRows[]{
      _key,
      scene,
      length,
      width,
      axle,
      shape,
      material,
      note,
      exampleLabel,
      exampleHref,
      image{..., alt}
    },
    kitchenTitle,
    kitchenBody,
    kitchenImage{..., alt},
    kitchenLinkLabel,
    kitchenLinkHref,
    quoteLabel,
    quoteHref,
    faqTitle,
    faq[]{ _key, question, answer }
  }
}`;

const solutionFields = `
  _id,
  title,
  "slug": slug.current,
  description,
  equipment,
  advice,
  recommendedSlugs,
  recommendedModels[]{
    label,
    url,
    product->{_id, title, "slug": slug.current, series}
  },
  sceneImage,
  icon,
  featuredProducts[]->{
    _id,
    title,
    "slug": slug.current,
    series
  }
`;

export const solutionsQuery = `*[_type == "solution" && defined(slug.current)] | order(title asc) {
  ${solutionFields}
}`;

export const solutionsBoardQuery = `*[_id in ["solutionsBoard", "drafts.solutionsBoard"]] | order(_updatedAt desc)[0]{
  _id,
  cards[]->{
    ${solutionFields}
  }
}`;

export const stockBoardQuery = `*[_id in ["stockBoard", "drafts.stockBoard"]] | order(_updatedAt desc)[0]{
  _id,
  cards[]->{
    _id,
    title,
    quantity,
    colorMaterial,
    bodyDimension,
    include,
    summary,
    videoUrl,
    photos[]{..., alt},
    product->{_id, title, "slug": slug.current, series}
  }
}`;

export const customizeCatalogQuery = `*[_id == "customizeCatalog"][0]{
  _id,
  trailerExtras[]{ itemId, name, price },
  kitchenEquipment[]{ itemId, category, name, price }
}`;
