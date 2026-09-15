import { CmsEntryData } from "@webiny/sdk";


export interface Product {
  name: string;
  description: string;
  price: number;
  sku: string;
  category?: CmsEntryData<ProductCategory>;
}

export interface ProductCategory {
  name: string;
  slug: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}
