import dayjs from "dayjs";

import type { DiscountType, PromotionTargetType } from "../types";

export type PromotionFormField =
  | "name"
  | "discountType"
  | "value"
  | "startDate"
  | "endDate"
  | "targetType"
  | "targetCategory"
  | "targetProductIds";

export type PromotionFormErrors = Partial<Record<PromotionFormField, string>>;

export interface PromotionFormValidationValues {
  name: string;
  discountType: DiscountType | "";
  value: number | null;
  startDate: string;
  endDate: string;
  targetType: PromotionTargetType | "";
  targetProductIds: string[];
  targetCategory: string;
}

export function validatePromotionForm(values: PromotionFormValidationValues): PromotionFormErrors {
  return {
    ...validateName(values.name),
    ...validateDiscountType(values.discountType),
    ...validateValue(values.value, values.discountType),
    ...validateStartDate(values.startDate),
    ...validateEndDate(values.startDate, values.endDate),
    ...validateTarget(values),
  };
}

export function validateName(name: string): PromotionFormErrors {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { name: "Name is required" };
  }

  if (trimmedName.length < 2) {
    return { name: "Name must be at least 2 characters" };
  }

  return {};
}

export function validateDiscountType(discountType: DiscountType | ""): PromotionFormErrors {
  return discountType ? {} : { discountType: "Discount type is required" };
}

export function validateValue(value: number | null, discountType: DiscountType | ""): PromotionFormErrors {
  if (value === null) {
    return { value: "Value is required" };
  }

  if (value <= 0) {
    return { value: "Value must be a positive number" };
  }

  if (discountType === "percentage_off" && value > 100) {
    return { value: "Percentage discount cannot exceed 100" };
  }

  return {};
}

export function validateStartDate(startDate: string): PromotionFormErrors {
  return startDate ? {} : { startDate: "Start date is required" };
}

export function validateEndDate(startDate: string, endDate: string): PromotionFormErrors {
  if (!endDate) {
    return { endDate: "End date is required" };
  }

  if (startDate && dayjs(endDate).isBefore(dayjs(startDate), "day")) {
    return { endDate: "End date must be after start date" };
  }

  return {};
}

export function validateTarget(values: Pick<PromotionFormValidationValues, "targetType" | "targetCategory" | "targetProductIds">): PromotionFormErrors {
  if (!values.targetType) {
    return { targetType: "Target type is required" };
  }

  if (values.targetType === "category" && !values.targetCategory) {
    return { targetCategory: "Category is required" };
  }

  if (values.targetType === "products" && values.targetProductIds.length === 0) {
    return { targetProductIds: "At least one product must be selected" };
  }

  return {};
}
