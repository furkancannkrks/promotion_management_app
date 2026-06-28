import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PromotionStatusFilter = "all" | "on_promotion" | "no_promotion";

export interface FiltersState {
  search: string;
  category: string;
  promotionStatus: PromotionStatusFilter;
  page: number;
}

const initialState: FiltersState = {
  search: "shirt",
  category: "",
  promotionStatus: "all",
  page: 1,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.page = 1;
    },
    setPromotionStatus(state, action: PayloadAction<PromotionStatusFilter>) {
      state.promotionStatus = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});

export const { setCategory, setPage, setPromotionStatus, setSearch } = filtersSlice.actions;

export const filtersReducer = filtersSlice.reducer;
