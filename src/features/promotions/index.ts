import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPromotion,
  deletePromotion,
  getPromotionById,
  getPromotions,
  previewPromotion,
} from "../../api/promotionApi";
import { queryKeys } from "../../utils/queryKeys";

import type { CreatePromotionDto } from "../../types";

export function promotionListOptions() {
  return queryOptions({
    queryKey: queryKeys.promotions(),
    queryFn: getPromotions,
  });
}

export function promotionDetailOptions(promotionId: string) {
  return queryOptions({
    queryKey: queryKeys.promotion(promotionId),
    queryFn: () => getPromotionById(promotionId),
    enabled: promotionId.length > 0,
  });
}

export function promotionPreviewOptions(payload: CreatePromotionDto) {
  return queryOptions({
    queryKey: queryKeys.promotionPreview(payload),
    queryFn: () => previewPromotion(payload),
    enabled: payload.startDate.length > 0 && payload.endDate.length > 0,
  });
}

export function usePromotions() {
  return useQuery(promotionListOptions());
}

export function usePromotionDetail(promotionId: string) {
  return useQuery(promotionDetailOptions(promotionId));
}

export function usePromotionPreview(payload: CreatePromotionDto) {
  return useQuery(promotionPreviewOptions(payload));
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePromotionDto) => createPromotion(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.promotions() });
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promotionId: string) => deletePromotion(promotionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.promotions() });
    },
  });
}
