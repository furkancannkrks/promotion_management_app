import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import type { Promotion, PromotionStatus } from "../types";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const apiDateFormat = "YYYY-MM-DD";

export function formatApiDate(value: string | Date): string {
  return dayjs(value).format(apiDateFormat);
}

export function getPromotionStatus(promotion: Pick<Promotion, "startDate" | "endDate">): PromotionStatus {
  const today = dayjs().startOf("day");
  const startDate = dayjs(promotion.startDate).startOf("day");
  const endDate = dayjs(promotion.endDate).startOf("day");

  if (today.isBefore(startDate)) {
    return "scheduled";
  }

  if (today.isAfter(endDate)) {
    return "expired";
  }

  return "active";
}

export function hasDateRangeOverlap(
  first: Pick<Promotion, "startDate" | "endDate">,
  second: Pick<Promotion, "startDate" | "endDate">
): boolean {
  const firstStart = dayjs(first.startDate);
  const firstEnd = dayjs(first.endDate);
  const secondStart = dayjs(second.startDate);
  const secondEnd = dayjs(second.endDate);

  return firstStart.isSameOrBefore(secondEnd, "day") && firstEnd.isSameOrAfter(secondStart, "day");
}
