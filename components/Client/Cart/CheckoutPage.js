"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useCart } from "contexts/CartContext";
import { useAuth } from "contexts/AuthContext";
import AddressSection from "./AddressSection";
import OrderSummary from "./OrderSummary";
import GroupedCartItems from "./GroupedCartItems";

const CheckoutPage = () => {
  const { cartItems, mounted, getCartCount } = useCart();
  const { user } = useAuth();
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);
  const [orderInfo, setOrderInfo] = useState({});

  useEffect(() => {
    const storedShippingFee =
      parseFloat(sessionStorage.getItem("totalShippingFee")) || 0;
    setShippingFee(storedShippingFee);
  }, []);

  useEffect(() => {
    const updatedOrderInfo = {
      ...orderInfo,
      userID: user?.id || "",
      cartID: cartItems[0]?.cartID,
      totalAmount: finalTotal,
      status: "Confirm",
      totalDeliveryFee: shippingFee,
      shippingAddressID: selectedShippingAddress?.addressID,
      billingAddressID: selectedBillingAddress?.addressID,
    };

    setOrderInfo(updatedOrderInfo);
    // Save to session storage
    sessionStorage.setItem("orderInfo", JSON.stringify(updatedOrderInfo));
  }, [
    user?.id,
    finalTotal,
    cartItems,
    selectedShippingAddress?.addressID,
    selectedBillingAddress?.addressID,
  ]);

  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.price - (item.price * (item.discount || 0)) / 100;
    return total + itemPrice * item.quantity;
  }, 0);

  const initialTotal = subtotal + shippingFee;

  useEffect(() => {
    setFinalTotal(initialTotal);
  }, [subtotal, shippingFee, initialTotal]);

  if (!mounted) return null;

  return (
    <Container className="my-10">
      <Row>
        <Col md={8}>
          <AddressSection
            user={user}
            setOrderInfo={setOrderInfo}
            selectedShippingAddress={selectedShippingAddress}
            setSelectedShippingAddress={setSelectedShippingAddress}
            selectedBillingAddress={selectedBillingAddress}
            setSelectedBillingAddress={setSelectedBillingAddress}
          />
          <GroupedCartItems
            cartItems={cartItems}
            handleRemoveItem={null}
            handleQuantityUpdate={null}
            isCheckout={false}
            isLoading={false}
          />
        </Col>
        <Col md={4} className="mt-5 mt-md-0">
          <OrderSummary
            subtotal={subtotal}
            shippingFee={shippingFee}
            getCartCount={getCartCount}
            finalTotal={finalTotal}
            setFinalTotal={setFinalTotal}
            initialTotal={initialTotal}
            setOrderInfo={setOrderInfo}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
