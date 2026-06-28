import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";

import { getProduct, getProducts } from "../../api/productApi";
import { getCategories } from "../../api/promotionApi";
import { queryKeys } from "../../utils/queryKeys";

import type { ProductFilters } from "../../utils/queryKeys";

export function productListOptions(params: ProductFilters) {
  return queryOptions({
    queryKey: queryKeys.products(params),
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  });
}

export function productDetailOptions(productId: string) {
  return queryOptions({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
    enabled: productId.length > 0,
  });
}

export function categoriesOptions() {
  return queryOptions({
    queryKey: queryKeys.categories(),
    queryFn: getCategories,
    staleTime: 5 * 60_000,
  });
}

export function useProducts(params: ProductFilters) {
  return useQuery(productListOptions(params));
}

export function useProductDetail(productId: string) {
  return useQuery(productDetailOptions(productId));
}

export function useCategories() {
  return useQuery(categoriesOptions());
}
