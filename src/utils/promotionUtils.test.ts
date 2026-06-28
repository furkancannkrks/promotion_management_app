import { afterEach, describe, expect, it, vi } from "vitest";

import type { ConflictItem, Promotion } from "../types";

import { calculateEffectivePrice, getPromotionStatus, parseConflictResponse } from "./promotionUtils";

const today = "2026-06-15";

function freezeToday() {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${today}T12:00:00.000Z`));
}

function createPromotion(overrides: Partial<Promotion>): Promotion {
  return {
    id: "promotion-1",
    name: "Test Promotion",
    discountType: "percentage_off",
    value: 20,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    targetType: "products",
    targetProductIds: ["product-1"],
    ...overrides,
  };
}

describe("promotionUtils", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getPromotionStatus", () => {
    it("returns active when promotion starts today", () => {
      freezeToday();

      const promotion = createPromotion({
        startDate: today,
        endDate: "2026-06-20",
      });

      expect(getPromotionStatus(promotion)).toBe("active");
    });

    it("returns active when promotion ends today", () => {
      freezeToday();

      const promotion = createPromotion({
        startDate: "2026-06-10",
        endDate: today,
      });

      expect(getPromotionStatus(promotion)).toBe("active");
    });

    it("returns expired when promotion is entirely in the past", () => {
      freezeToday();

      const promotion = createPromotion({
        startDate: "2026-06-01",
        endDate: "2026-06-10",
      });

      expect(getPromotionStatus(promotion)).toBe("expired");
    });

    it("returns scheduled when promotion is entirely in the future", () => {
      freezeToday();

      const promotion = createPromotion({
        startDate: "2026-06-20",
        endDate: "2026-06-30",
      });

      expect(getPromotionStatus(promotion)).toBe("scheduled");
    });
  });

  describe("calculateEffectivePrice", () => {
    it("returns basePrice when there is no promotion", () => {
      expect(calculateEffectivePrice(100)).toBe(100);
    });

    it("returns 80 for percentage_off 20% on 100", () => {
      freezeToday();

      const promotion = createPromotion({
        discountType: "percentage_off",
        value: 20,
      });

      expect(calculateEffectivePrice(100, promotion)).toBe(80);
    });

    it("returns 0 for fixed_amount_off 200 on 150", () => {
      freezeToday();

      const promotion = createPromotion({
        discountType: "fixed_amount_off",
        value: 200,
      });

      expect(calculateEffectivePrice(150, promotion)).toBe(0);
    });

    it("returns 0 for percentage_off 100", () => {
      freezeToday();

      const promotion = createPromotion({
        discountType: "percentage_off",
        value: 100,
      });

      expect(calculateEffectivePrice(100, promotion)).toBe(0);
    });
  });

  describe("parseConflictResponse", () => {
    it("returns conflicts from a 409 axios response", () => {
      const conflicts: ConflictItem[] = [
        {
          productId: "product-1",
          productName: "Slim Fit Oxford Shirt",
          conflictingPromotionId: "promotion-1",
          conflictingPromotionName: "Summer Tops Sale",
        },
      ];
      const error: unknown = {
        isAxiosError: true,
        response: {
          status: 409,
          data: {
            message: "Promotion conflicts detected",
            conflicts,
          },
        },
      };

      expect(parseConflictResponse(error)).toEqual(conflicts);
    });

    it("returns an empty array for a non-axios error", () => {
      expect(parseConflictResponse(new Error("Unexpected"))).toEqual([]);
    });
  });
});
