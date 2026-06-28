import { QueryClient } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";

import { filtersReducer } from "../features/filters/filtersSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
