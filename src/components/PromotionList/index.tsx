import { Button, Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import { useDeletePromotion, usePromotions } from "../../hooks";
import { getPromotionStatus } from "../../utils/promotionUtils";
import { StatusTag } from "../StatusTag";

import type { Promotion } from "../../types";

const columns = (onDelete: (id: string) => void, deletingId?: string): ColumnsType<Promotion> => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Discount",
    key: "discount",
    render: (_, promotion) => formatDiscount(promotion),
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    render: (value: Promotion["startDate"]) => formatDate(value),
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
    render: (value: Promotion["endDate"]) => formatDate(value),
  },
  {
    title: "Status",
    key: "status",
    render: (_, promotion) => <StatusTag type="promotion" status={getPromotionStatus(promotion)} />,
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, promotion) => (
      <Popconfirm
        title="Delete promotion?"
        description="This action cannot be undone."
        okText="Delete"
        okButtonProps={{ danger: true }}
        onConfirm={() => {
          onDelete(promotion.id);
        }}
      >
        <Button danger loading={deletingId === promotion.id}>
          Delete
        </Button>
      </Popconfirm>
    ),
  },
];

export function PromotionList() {
  const promotionsQuery = usePromotions();
  const deletePromotion = useDeletePromotion();

  return (
    <Table<Promotion>
      columns={columns((id) => deletePromotion.mutate(id), deletePromotion.variables)}
      dataSource={promotionsQuery.data ?? []}
      loading={promotionsQuery.isLoading || promotionsQuery.isFetching}
      pagination={false}
      rowKey="id"
      scroll={{ x: true }}
    />
  );
}

function formatDiscount(promotion: Promotion): string {
  if (promotion.discountType === "percentage_off") {
    return `${promotion.value}%`;
  }

  return `${promotion.value} TL`;
}

function formatDate(value: string): string {
  return dayjs(value).format("DD.MM.YYYY");
}
