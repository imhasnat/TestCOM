import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner, Badge } from "react-bootstrap";
import "./orderListPage.css";
import Image from "next/image"; // Next.js Image
import { getOrderByUserId } from "api/order/orderApi";
import { useAuth } from "contexts/AuthContext";

const OrderListPage = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await getOrderByUserId(user?.id);
        if (response.success) {
          const orders = response.data;

          // Group orders by orderNumber
          const grouped = orders.reduce((acc, order) => {
            if (!acc[order.orderNumber]) {
              acc[order.orderNumber] = {
                orderDetails: [],
                status: order.status,
              };
            }
            acc[order.orderNumber].orderDetails.push(order);
            return acc;
          }, {});

          setGroupedOrders(grouped);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="order-list-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-list-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Container className="order-list-container">
      {Object.keys(groupedOrders).length === 0 ? (
        <p className="order-list-empty">No orders found.</p>
      ) : (
        Object.entries(groupedOrders).map(([orderNumber, orderData]) => {
          const totalPrice = orderData.orderDetails.reduce(
            (total, order) => total + order.orderDetailPrice,
            0
          );

          return (
            <Card className="order-card" key={orderNumber}>
              <Card.Header>
                <Row className="align-items-center">
                  <Col md={6}>
                    <h5>
                      Order Number:{" "}
                      <span className="order-number">{orderNumber}</span>
                    </h5>
                  </Col>
                  <Col md={6} className="text-md-end">
                    <Badge
                      bg={
                        orderData.status === "Confirm"
                          ? "success"
                          : orderData.status === "Pending"
                          ? "warning"
                          : "secondary"
                      }
                      className="order-status"
                    >
                      {orderData.status}
                    </Badge>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {orderData.orderDetails.map((order) => (
                  <Row
                    key={order.orderDetailID}
                    className="order-item-row align-items-center mb-4"
                  >
                    <Col md={3} className="text-center">
                      <Image
                        width={150}
                        height={150}
                        src={order.image}
                        alt={order.productName}
                        className="order-item-image"
                      />
                    </Col>
                    <Col md={9} className="d-flex align-items-center">
                      <div className="product-info">
                        <h6 className="product-name">{order.productName}</h6>
                        <p>
                          <strong>Price:</strong> Tk{order.productPrice}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {order.quantity}
                        </p>
                      </div>
                    </Col>
                  </Row>
                ))}
                <Row className="order-subtotal-row">
                  <Col className="text-end">
                    <h5>
                      <strong>Subtotal:</strong> Tk{totalPrice.toFixed(2)}
                    </h5>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default OrderListPage;
