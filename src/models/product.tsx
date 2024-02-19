export interface Product {
  id: string;
  name: string;
  description: string;
  variants: Array<ProductVariant>;
  featuredAsset: Asset;
}

export interface ProductVariant {
  price: string;
  id: string;
}

export interface Asset {
  name: string;
  source: string;
}
