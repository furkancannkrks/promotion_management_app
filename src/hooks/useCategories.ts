import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../api/promotionApi";
import { queryKeys } from "../utils/queryKeys";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: getCategories,
    staleTime: Infinity,
  });
}
