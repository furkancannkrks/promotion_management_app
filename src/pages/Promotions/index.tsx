import { Card, Col, Row } from "antd";

import { PromotionForm } from "../../components/PromotionForm";
import { PromotionList } from "../../components/PromotionList";

export function PromotionsPage() {
  return (
    <main className="page-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Promotions">
            <PromotionList />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Create Promotion">
            <PromotionForm />
          </Card>
        </Col>
      </Row>
    </main>
  );
}
