import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderStatusCard = ({ orderItem }) => {
  if (!orderItem || !orderItem.items || orderItem.items.length === 0) {
    return <div>주문 정보가 없습니다.</div>;
  }

  const productName = orderItem.items[0]?.productId?.name || "상품 이름 없음"; // name이 없을 경우 기본값 설정
  const productImage =
    orderItem.items[0]?.productId?.image ||
    "https://lh5.googleusercontent.com/proxy/o7gdKPHDEwAZ3X5hnKIE2FdzhkjA8Z0H2eMcZEXbFNHBSyLzFq3lITp5pIVsNEykLNgIKHwGTc4g-n13N8l8PcP-DJDWMdYUBaTboKU8UjnKiQ7fabe1sAg";

  return (
    <div>
      <Row className="status-card">
        <Col xs={2}>
          <img src={productImage} height={96} />
        </Col>
        <Col xs={8} className="order-info">
          <div>
            <strong>주문번호: {orderItem.orderNum}</strong>
          </div>

          <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>

          <div>
            {productName}
            {orderItem.items.length > 1 && `외 ${orderItem.items.length - 1}개`}
          </div>
          <div>₩ {currencyFormat(orderItem.totalPrice)}</div>
        </Col>
        <Col md={2} className="vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;
