import { apiClient } from "./axios";

import type { CreatePromotionDto, PreviewResponse, Promotion } from "../types";

interface PreviewApiItem {
  id: string;
  name: string;
  basePrice: number;
  effectivePrice: number;
}

interface PreviewApiResponse {
  preview: PreviewApiItem[];
}

export async function getPromotions(): Promise<Promotion[]> {
  const response = await apiClient.get<Promotion[]>("/promotions");

  return response.data;
}

export async function getCategories(): Promise<string[]> {
  const response = await apiClient.get<string[]>("/categories");

  return response.data;
}

export async function getPromotionById(promotionId: string): Promise<Promotion> {
  const response = await apiClient.get<Promotion>(`/promotions/${promotionId}`);

  return response.data;
}

export async function createPromotion(data: CreatePromotionDto): Promise<Promotion> {
  const response = await apiClient.post<Promotion>("/promotions", data);

  return response.data;
}

export async function deletePromotion(id: string): Promise<void> {
  await apiClient.delete(`/promotions/${id}`);
}

export async function previewPromotion(data: CreatePromotionDto): Promise<PreviewResponse> {
  const response = await apiClient.post<PreviewApiResponse>("/promotions/preview", data);

  return {
    affectedProducts: response.data.preview.map((item) => ({
      productId: item.id,
      productName: item.name,
      currentPrice: item.basePrice,
      newEffectivePrice: item.effectivePrice,
    })),
  };
}
