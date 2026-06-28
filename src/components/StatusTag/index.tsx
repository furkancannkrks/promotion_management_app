import { Tag } from "antd";

export type PromotionTagStatus = "active" | "scheduled" | "expired";

export type ProductTagStatus = "on_promotion" | "no_promotion";

export type StatusTagProps =
  | { type: "promotion"; status: PromotionTagStatus }
  | { type: "product"; status: ProductTagStatus };

const promotionStatusConfig: Record<PromotionTagStatus, { color: string; label: string }> = {
  active: {
    color: "success",
    label: "Active",
  },
  scheduled: {
    color: "processing",
    label: "Scheduled",
  },
  expired: {
    color: "default",
    label: "Expired",
  },
};

const productStatusConfig: Record<ProductTagStatus, { color: string; label: string }> = {
  on_promotion: {
    color: "green",
    label: "On Promotion",
  },
  no_promotion: {
    color: "default",
    label: "No Promotion",
  },
};

export function StatusTag(props: StatusTagProps) {
  const config =
    props.type === "promotion" ? promotionStatusConfig[props.status] : productStatusConfig[props.status];

  return <Tag color={config.color}>{config.label}</Tag>;
}
