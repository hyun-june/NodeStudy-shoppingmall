import React, { useState } from "react";
import { useEffect } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList } = useSelector((state) => state.order);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  if (!orderList || orderList.length === 0) {
    return (
      <Container className="no-order-box">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  }
  const handleCardClick = (orderItem) => {
    setSelectedOrder(orderItem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };
  return (
    <>
      <Container className="status-card-container">
        {orderList.map((item) => (
          <OrderStatusCard
            orderItem={item}
            className="status-card-container"
            key={item._id}
            onClick={() => handleCardClick(item)}
          />
        ))}
      </Container>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>주문 세부정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <div className="modal-inner">
              <div>
                {selectedOrder.items[0]?.productId?.image ? (
                  <div className="modal-inner-img">
                    <p style={{ textAlign: "center" }}>상품이미지</p>
                    <img
                      src={selectedOrder.items[0].productId.image}
                      alt="product"
                      className="modal-img"
                    />
                  </div>
                ) : (
                  <p>이미지 없음</p>
                )}
              </div>
              <div>
                <h5>주문 ID: {selectedOrder._id}</h5>
                <p>
                  성함: {selectedOrder.contact?.firstName}
                  {selectedOrder.contact?.lastName}
                </p>
                <p>상품명 : {selectedOrder.items[0]?.productId?.name}</p>
                <p>개수 : {selectedOrder.items[0]?.qty}</p>
                <p>사이즈 : {selectedOrder.items[0]?.size.toUpperCase()}</p>
                <p>가격 : ₩{selectedOrder.items[0]?.price}</p>
                <p>
                  주문 날짜:{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
                <p>상태 : {selectedOrder.status}</p>
              </div>
            </div>
          ) : (
            <p>주문 정보를 불러오는 중입니다...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyPage;
