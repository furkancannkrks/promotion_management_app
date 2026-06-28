import type { Product } from "../../types";

export interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

export function ProductTable(_props: ProductTableProps) {
  return null;
}
