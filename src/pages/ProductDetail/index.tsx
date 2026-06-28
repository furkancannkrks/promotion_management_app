import { Button, Card, Descriptions, Empty, Space, Spin, Typography } from "antd";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";

import { StatusTag } from "../../components/StatusTag";
import { useProduct } from "../../hooks";
import { calculateEffectivePrice, getPromotionStatus } from "../../utils/promotionUtils";

import type { Promotion } from "../../types";

export function ProductDetailPage() {
  const { id = "" } = useParams();
  const productQuery = useProduct(id);
  const product = productQuery.data;
  const activePromotion = product?.activePromotion;

  if (productQuery.isLoading) {
    return (
      <main className="page-container">
        <Spin />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page-container">
        <Space orientation="vertical" size="large">
          <Button>
            <Link to="/">Back to Products</Link>
          </Button>
          <Empty description={productQuery.isError ? "Product could not be loaded" : "Product not found"} />
        </Space>
      </main>
    );
  }

  return (
    <main className="page-container">
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <Button>
          <Link to="/">Back to Products</Link>
        </Button>

        <div className="page-header">
          <h1 className="page-title">{product.name}</h1>
        </div>

        <Card title="Product Info">
          <Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
            <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
            <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
            <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
            <Descriptions.Item label="Stock Quantity">{product.stockQuantity}</Descriptions.Item>
            <Descriptions.Item label="Base Price">{formatPrice(product.basePrice)}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Effective Price">
          <Typography.Title level={2} style={{ margin: 0 }}>
            {formatPrice(calculateEffectivePrice(product.basePrice, activePromotion))}
          </Typography.Title>
        </Card>

        <Card title="Promotion">
          {activePromotion ? <PromotionDetails promotion={activePromotion} /> : <Empty description="No active promotion" />}
        </Card>
      </Space>
    </main>
  );
}

function PromotionDetails({ promotion }: { promotion: Promotion }) {
  const status = getPromotionStatus(promotion);

  return (
    <Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
      <Descriptions.Item label="Name">{promotion.name}</Descriptions.Item>
      <Descriptions.Item label="Discount">{formatDiscount(promotion)}</Descriptions.Item>
      <Descriptions.Item label="Date Range">
        {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
      </Descriptions.Item>
      {promotion.couponCode ? <Descriptions.Item label="Coupon Code">{promotion.couponCode}</Descriptions.Item> : null}
      <Descriptions.Item label="Status">
        <StatusTag type="promotion" status={status} />
      </Descriptions.Item>
    </Descriptions>
  );
}

function formatPrice(value: number): string {
  return `${value.toFixed(2)} TL`;
}

function formatDiscount(promotion: Promotion): string {
  if (promotion.discountType === "percentage_off") {
    return `${promotion.value}% off`;
  }

  return `${promotion.value} TL off`;
}

function formatDate(value: string): string {
  return dayjs(value).format("DD.MM.YYYY");
}
