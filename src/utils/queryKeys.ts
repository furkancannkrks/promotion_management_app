import type { CreatePromotionDto } from "../types";

export interface ProductFilters {
  q: string;
  category: string;
  promotionStatus: "all" | "on_promotion" | "no_promotion";
  page: number;
  limit: number;
}

export const queryKeys = {
  products: (filters: ProductFilters) => ["products", filters] as const,
  product: (id: string) => ["product", id] as const,
  promotions: () => ["promotions"] as const,
  promotion: (id: string) => ["promotion", id] as const,
  categories: () => ["categories"] as const,
  promotionPreview: (payload: CreatePromotionDto) => ["promotion-preview", payload] as const,
};
