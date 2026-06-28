import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePromotion } from "../api/promotionApi";
import { queryKeys } from "../utils/queryKeys";

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.promotions() });
    },
  });
}
