import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createSelector } from "@reduxjs/toolkit";
import { useAppSelector } from "../app/hooks";
import { getProducts } from "../api/productApi";
import { toProductFilters } from "../features/filters";
import { queryKeys } from "../utils/queryKeys";
import type { RootState } from "../app/store";

const selectProductFilters = createSelector(
  (state: RootState) => state.filters,
  (filters) => toProductFilters(filters)
);

export function useProducts() {
  const filters = useAppSelector(selectProductFilters);
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => getProducts(filters),
    placeholderData: keepPreviousData,
  });
}

