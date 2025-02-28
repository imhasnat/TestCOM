import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import "./thank-you-page.css";

const ThankYouPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const handleContinueShopping = () => {
    router.push("/products");
  };

  return (
    <Container className="thank-you-page mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center thank-you-card shadow">
            <Card.Body>
              <FaCheckCircle className="text-success mb-3" size={60} />
              <Card.Title className="thank-you-title">
                Thank You for Your Order!
              </Card.Title>
              <Card.Text className="thank-you-text">
                Your order has been successfully placed. We appreciate your
                trust in us!
              </Card.Text>
              {orderNumber && (
                <Card.Text className="order-id">
                  <strong>Order Number:</strong> #{orderNumber}
                </Card.Text>
              )}
              <Button
                variant="primary"
                className="continue-shopping-btn"
                onClick={handleContinueShopping}
              >
                <FaShoppingCart className="me-2" />
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ThankYouPage;
