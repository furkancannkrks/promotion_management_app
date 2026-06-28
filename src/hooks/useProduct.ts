import { useQuery } from "@tanstack/react-query";

import { getProduct } from "../api/productApi";
import { queryKeys } from "../utils/queryKeys";

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => getProduct(id),
    enabled: id.length > 0,
  });
}
