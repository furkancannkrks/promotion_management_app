import { useQuery } from "@tanstack/react-query";

import { getPromotions } from "../api/promotionApi";
import { queryKeys } from "../utils/queryKeys";

export function usePromotions() {
  return useQuery({
    queryKey: queryKeys.promotions(),
    queryFn: getPromotions,
  });
}
