export type ProductCategory = "tops" | "bottoms" | "outerwear" | "dresses" | "knitwear" | "accessories";

export type DiscountType = "percentage_off" | "fixed_amount_off";

export type PromotionTargetType = "products" | "category";

export type PromotionStatus = "active" | "scheduled" | "expired";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  basePrice: number;
  stockQuantity: number;
  activePromotion?: Promotion;
}

export interface Promotion {
  id: string;
  name: string;
  discountType: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  couponCode?: string;
  targetType: PromotionTargetType;
  targetProductIds?: string[];
  targetCategory?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePromotionDto {
  name: string;
  discountType: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  couponCode?: string;
  targetType: PromotionTargetType;
  targetProductIds?: string[];
  targetCategory?: string;
}

export interface PreviewItem {
  productId: string;
  productName: string;
  currentPrice: number;
  newEffectivePrice: number;
}

export interface PreviewResponse {
  affectedProducts: PreviewItem[];
}

export interface ConflictItem {
  productId: string;
  productName: string;
  conflictingPromotionId: string;
  conflictingPromotionName: string;
}

export interface ConflictResponse {
  message: string;
  conflicts: ConflictItem[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  errors: ValidationError[];
}
