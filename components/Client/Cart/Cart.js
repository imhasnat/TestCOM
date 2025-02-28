// CartPage.jsx
"use client";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Link from "next/link";
import { useCart } from "contexts/CartContext";
import { useEffect, useState } from "react";
import GroupedCartItems from "./GroupedCartItems";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartCount, mounted } =
    useCart();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storeShippingFees, setStoreShippingFees] = useState({});
  const [totalShippingFee, setTotalShippingFee] = useState(0);

  // Initialize store shipping fees to 80 Tk for each store
  useEffect(() => {
    const initialFees = cartItems.reduce((fees, item) => {
      fees[item.storeID] = 80;
      return fees;
    }, {});
    setStoreShippingFees(initialFees);
  }, [cartItems]);

  // Save shipping fees in session storage
  useEffect(() => {
    const shippingFee = Object.values(storeShippingFees).reduce(
      (total, fee) => total + (fee || 0),
      0
    );
    sessionStorage.setItem("totalShippingFee", shippingFee.toFixed(2));
    setTotalShippingFee(shippingFee);
  }, [storeShippingFees]);

  // Don't render until after hydration
  if (!mounted) return null;

  const handleShippingFeeChange = (storeID, fee) => {
    setStoreShippingFees((prev) => ({
      ...prev,
      [storeID]: fee,
    }));
  };

  const handleQuantityUpdate = async (cartItemID, mode) => {
    setIsLoading(true);
    try {
      await updateQuantity(cartItemID, mode);
    } catch (error) {
      // setError("Failed to update quantity. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemID) => {
    setIsLoading(true);
    try {
      await removeFromCart(cartItemID);
    } catch (error) {
      setError("Failed to remove item. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.price - (item.price * (item.discount || 0)) / 100;
    return total + itemPrice * item.quantity;
  }, 0);

  const total = subtotal + totalShippingFee;
  const itemCount = getCartCount();

  if (cartItems.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2>Your Cart is Empty</h2>
        <Link href="/products">
          <Button variant="primary" className="mt-3">
            Continue Shopping
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <ToastContainer position="top-end" className="p-3">
        {error && (
          <Toast
            bg="danger"
            onClose={() => setError(null)}
            show={!!error}
            delay={3000}
            autohide
          >
            <Toast.Header closeButton>
              <strong className="me-auto">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{error}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>

      <h2 className="mb-4">
        Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h2>
      <Row>
        <Col xs={12} md={8}>
          <GroupedCartItems
            cartItems={cartItems}
            handleRemoveItem={handleRemoveItem}
            handleQuantityUpdate={handleQuantityUpdate}
            handleShippingFeeChange={handleShippingFeeChange}
            storeShippingFees={storeShippingFees}
            isCheckout={true}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={12} md={4}>
          <Card className="p-3">
            <h5>Order Summary</h5>
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
              <span>Tk{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Total Shipping Fee</span>
              <span>Tk{totalShippingFee.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <strong>Total</strong>
              <strong>Tk{total.toFixed(2)}</strong>
            </div>
            {Object.keys(storeShippingFees).length > 0 ? (
              <Link href="/checkout" className="w-100">
                <Button className="w-100">Proceed to Checkout</Button>
              </Link>
            ) : (
              <Button className="w-100" disabled>
                Proceed to Checkout
              </Button>
            )}
            <Link href="/products" className="w-100 mt-2">
              <Button variant="outline-secondary" className="w-100">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
