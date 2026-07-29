export function productInfo(product, lang) {
  if (lang === "en") {
    return { name: product.name_en || product.name_fr, desc: product.desc_en || product.desc_fr, long: product.long_en || product.long_fr };
  }
  return { name: product.name_fr, desc: product.desc_fr, long: product.long_fr };
}
