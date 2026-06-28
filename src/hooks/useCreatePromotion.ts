import { App } from "antd";
import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppSelector } from "../app/hooks";
import { createPromotion } from "../api/promotionApi";
import { toProductFilters } from "../features/filters";
import { parseConflictResponse } from "../utils/promotionUtils";
import { queryKeys } from "../utils/queryKeys";

import type { CreatePromotionDto, ValidationErrorResponse } from "../types";
import type { PromotionConflict } from "../utils/promotionUtils";
import type { PromotionFormErrors, PromotionFormField } from "../utils/validationUtils";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

const selectProductFilters = createSelector(
  (state: RootState) => state.filters,
  (filters) => toProductFilters(filters)
);

interface UseCreatePromotionOptions {
  onConflict?: (conflicts: PromotionConflict[]) => void;
  onValidationError?: (errors: PromotionFormErrors) => void;
  onSuccess?: () => void;
}

const promotionFormFields: readonly PromotionFormField[] = [
  "name",
  "discountType",
  "value",
  "startDate",
  "endDate",
  "targetType",
  "targetCategory",
  "targetProductIds",
];

export function useCreatePromotion(options: UseCreatePromotionOptions = {}) {
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const filters = useAppSelector(selectProductFilters);

  return useMutation({
    mutationFn: (data: CreatePromotionDto) => createPromotion(data),
    onSuccess: () => {
      notification.success({ title: "Promotion created successfully" });
      void queryClient.invalidateQueries({ queryKey: queryKeys.products(filters) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.promotions() });
      options.onSuccess?.();
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        options.onConflict?.(parseConflictResponse(error));
        return;
      }

      if (isAxiosError<ValidationErrorResponse>(error) && error.response?.status === 422) {
        options.onValidationError?.(mapValidationErrors(error.response.data));
      }
    },
  });
}

function mapValidationErrors(response: ValidationErrorResponse): PromotionFormErrors {
  return response.errors.reduce<PromotionFormErrors>((errors, validationError) => {
    if (isPromotionFormField(validationError.field)) {
      errors[validationError.field] = validationError.message;
    }

    return errors;
  }, {});
}

function isPromotionFormField(field: string): field is PromotionFormField {
  return promotionFormFields.includes(field as PromotionFormField);
}
