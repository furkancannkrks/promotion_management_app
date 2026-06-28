import type { ProductFilters } from "../../utils/queryKeys";

import type { FiltersState } from "./filtersSlice";

export { filtersReducer, setCategory, setPage, setPromotionStatus, setSearch } from "./filtersSlice";
export type { FiltersState, PromotionStatusFilter } from "./filtersSlice";

export function toProductFilters(filters: FiltersState): ProductFilters {
  return {
    q: filters.search,
    category: filters.category,
    promotionStatus: filters.promotionStatus,
    page: filters.page,
    limit: 10,
  };
}

export function toProductListParams(filters: FiltersState): ProductFilters {
  return toProductFilters(filters);
}
