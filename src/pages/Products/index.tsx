import { Input, Select, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { StatusTag } from "../../components/StatusTag";
import { useAppDispatch, useAppSelector, useCategories, useDebounce, useProducts } from "../../hooks";
import { setCategory, setPage, setPromotionStatus, setSearch } from "../../features/filters";
import { calculateEffectivePrice, isPromotionActive } from "../../utils/promotionUtils";
import "../../styles/global.scss";

import type { Product } from "../../types";
import type { PromotionStatusFilter } from "../../features/filters";

const pageSize = 10;

const columns: ColumnsType<Product> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name: Product["name"], product) => <Link to={`/product/${product.id}`}>{name}</Link>,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
  },
  {
    title: "Base Price",
    dataIndex: "basePrice",
    key: "basePrice",
    render: (basePrice: Product["basePrice"]) => formatPrice(basePrice),
  },
  {
    title: "Effective Price",
    key: "effectivePrice",
    render: (_, product) => formatPrice(calculateEffectivePrice(product.basePrice, product.activePromotion)),
  },
  {
    title: "Status",
    key: "status",
    render: (_, product) => (
      <StatusTag
        type="product"
        status={product.activePromotion && isPromotionActive(product.activePromotion) ? "on_promotion" : "no_promotion"}
      />
    ),
  },
];

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);
  const productsQuery = useProducts();
  const categoriesQuery = useCategories();

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setSearch(debouncedSearch));
    }
  }, [debouncedSearch, dispatch, filters.search]);

  const products = productsQuery.data?.products ?? [];

  const pagination: TablePaginationConfig = {
    current: filters.page,
    pageSize,
    total: productsQuery.data?.total ?? 0,
    showSizeChanger: false,
    onChange: (page) => {
      dispatch(setPage(page));
    },
  };

  return (
    <main className="page-container">
      <div className="page-header">
        <h1 className="page-title">Products</h1>
      </div>

      <Space wrap size="middle" style={{ marginBottom: 24 }}>
        <Input.Search
          allowClear
          aria-label="Search products"
          placeholder="Search products"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
          style={{ width: 280 }}
        />
        <Select
          aria-label="Filter by category"
          loading={categoriesQuery.isLoading}
          value={filters.category}
          onChange={(value: string) => {
            dispatch(setCategory(value));
          }}
          options={[
            { label: "All Categories", value: "" },
            ...(categoriesQuery.data ?? []).map((category) => ({ label: category, value: category })),
          ]}
          style={{ width: 200 }}
        />
        <Select<PromotionStatusFilter>
          aria-label="Filter by promotion status"
          value={filters.promotionStatus}
          onChange={(value) => {
            dispatch(setPromotionStatus(value));
          }}
          options={[
            { label: "All", value: "all" },
            { label: "On Promotion", value: "on_promotion" },
            { label: "No Promotion", value: "no_promotion" },
          ]}
          style={{ width: 180 }}
        />
      </Space>

      <Table<Product>
        columns={columns}
        dataSource={products}
        loading={productsQuery.isFetching}
        pagination={pagination}
        rowKey="id"
        scroll={{ x: true }}
      />
    </main>
  );
}

function formatPrice(value: number): string {
  return `${value.toFixed(2)} TL`;
}
