import { apiClient } from "./axios";

import type { Product, ProductsResponse } from "../types";
import type { ProductFilters } from "../utils/queryKeys";

export async function getProducts(filters: ProductFilters): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>("/products", { params: filters });

  return response.data;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);

  return response.data;
}
