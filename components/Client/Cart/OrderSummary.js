import React, { useState } from "react";
import {
  Card,
  Button,
  Form,
  InputGroup,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import Link from "next/link";
import { couponValidation } from "api/order/orderApi";

const OrderSummary = ({
  subtotal,
  shippingFee,
  getCartCount,
  finalTotal,
  setFinalTotal,
  initialTotal,
  setOrderInfo,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handlePromoApply = async () => {
    setCouponLoading(true);
    setCouponError("");
    try {
      const response = await couponValidation(promoCode);

      if (response.success) {
        if (subtotal < response.data.minimumOrderAmount) {
          setCouponError(
            `Minimum order amount required: $${response.data.minimumOrderAmount}`
          );
          setAppliedCoupon(null);
          setFinalTotal(initialTotal);
        } else {
          setAppliedCoupon(response.data);
          setCouponError("");
          setFinalTotal(initialTotal - response.data.discountAmount);
          setOrderInfo((prev) => ({
            ...prev,
            couponId: response.data.couponId,
            totalAmount: initialTotal - response.data.discountAmount,
          }));
        }
      } else {
        setCouponError("Invalid coupon code");
        setAppliedCoupon(null);
        setFinalTotal(initialTotal);
        setOrderInfo((prev) => {
          const { couponId, ...rest } = prev;
          return { ...rest, totalAmount: initialTotal };
        });
      }
    } catch (err) {
      setCouponError("Error validating coupon");
      setAppliedCoupon(null);
      setFinalTotal(initialTotal);
      setOrderInfo((prev) => {
        const { couponId, ...rest } = prev;
        return { ...rest, totalAmount: initialTotal };
      });
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>Promotion</Card.Header>
      <Card.Body>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter Promo Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={couponLoading}
          />
          <Button
            className="custom-button"
            onClick={handlePromoApply}
            disabled={couponLoading}
          >
            {couponLoading ? <Spinner animation="border" size="sm" /> : "Apply"}
          </Button>
        </InputGroup>

        <Card className="mb-3">
          <Card.Header>Order Summary</Card.Header>
          <Card.Body>
            <Row className="mb-2">
              <Col>Items Total ({getCartCount()} items)</Col>
              <Col className="text-end">Tk{subtotal.toFixed(2)}</Col>
            </Row>
            <Row className="mb-2">
              <Col>Delivery Fee</Col>
              <Col className="text-end">Tk{shippingFee.toFixed(2)}</Col>
            </Row>
            {appliedCoupon && (
              <Row className="mb-2">
                <Col>Discount (Code: {appliedCoupon.code})</Col>
                <Col className="text-end text-success">
                  -Tk{appliedCoupon.discountAmount.toFixed(2)}
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <strong>Total:</strong>
              </Col>
              <Col className="text-end">
                <strong>Tk{finalTotal.toFixed(2)}</strong>
              </Col>
            </Row>
            {couponError && (
              <div className="text-danger mt-2 small">{couponError}</div>
            )}
            <small className="text-muted">Tax included, where applicable</small>
          </Card.Body>
        </Card>
        <div className="d-grid gap-3">
          <Link href={"/payment"} className="w-100">
            <Button className="w-100 custom-button mt-3">Proceed to Pay</Button>
          </Link>
          <Link href="/cart" className="w-100 ">
            <Button variant="outline-secondary" className="w-100">
              Update Cart
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderSummary;
