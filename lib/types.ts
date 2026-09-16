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

export interface TherapyService {
  name: string;
  slug: string;
  sku?: string;
  category?: "individual" | "couples" | "family" | "group" | "youth";
  deliveryMethod?: string[];
  durationMinutes: number;
  price: number;
  shortDescription?: string;
  description?: any;
  featuredImage?: {
    id: string;
    src: string;
  } | string;
  isFeatured?: boolean;
}