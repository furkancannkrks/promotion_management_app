import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../api/productApi";
import { queryKeys } from "../utils/queryKeys";

import type { ProductFilters } from "../utils/queryKeys";

const allProductsFilters: ProductFilters = {
  q: "",
  category: "",
  promotionStatus: "all",
  page: 1,
  limit: 1000,
};

export function useAllProducts() {
  return useQuery({
    queryKey: queryKeys.products(allProductsFilters),
    queryFn: () => getProducts(allProductsFilters),
    staleTime: 30_000,
  });
}
