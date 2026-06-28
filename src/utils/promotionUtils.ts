import { isAxiosError } from "axios";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import type { ConflictItem, Promotion, PromotionStatus } from "../types";

export type PromotionConflict = ConflictItem | string;

interface ConflictResponseBody {
  conflicts?: PromotionConflict[];
}

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function getPromotionStatus(promotion: Promotion): PromotionStatus {
  const today = dayjs().startOf("day");
  const startDate = dayjs(promotion.startDate).startOf("day");
  const endDate = dayjs(promotion.endDate).startOf("day");

  if (startDate.isSameOrBefore(today, "day") && endDate.isSameOrAfter(today, "day")) {
    return "active";
  }

  if (startDate.isAfter(today, "day")) {
    return "scheduled";
  }

  return "expired";
}

export function calculateEffectivePrice(basePrice: number, promotion?: Promotion): number {
  if (!promotion || !isPromotionActive(promotion)) {
    return roundPrice(basePrice);
  }

  if (promotion.discountType === "percentage_off") {
    return roundPrice(basePrice * (1 - promotion.value / 100));
  }

  return roundPrice(Math.max(0, basePrice - promotion.value));
}

export function isPromotionActive(promotion: Promotion): boolean {
  return getPromotionStatus(promotion) === "active";
}

export function parseConflictResponse(error: unknown): PromotionConflict[] {
  if (!isAxiosError<ConflictResponseBody>(error)) {
    return [];
  }

  if (error.response?.status === 422) {
    return [];
  }

  if (error.response?.status !== 409) {
    return [];
  }

  const conflicts = error.response.data?.conflicts;

  return Array.isArray(conflicts) ? conflicts : [];
}

function roundPrice(value: number): number {
  return Math.round(value * 100) / 100;
}
