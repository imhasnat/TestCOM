"use client";

import { useCart } from "contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Button, Modal } from "react-bootstrap";
import "./cart-modal.css";

const CartModal = ({ show, onHide }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartCount, mounted } =
    useCart();

  if (!mounted) return null;

  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.price - (item.price * (item.discount || 0)) / 100;
    return total + itemPrice * item.quantity;
  }, 0);

  const itemCount = getCartCount();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cartItems.length === 0 ? (
          <h4 className="text-center text-muted py-3">Your cart is empty</h4>
        ) : (
          <div className="d-flex flex-column gap-3">
            {cartItems.map((item) => (
              <div
                key={item.cartItemID}
                className="cart-item d-flex gap-3 align-items-center"
              >
                <div className="cart-item-image">
                  <Image
                    src={item?.image || "/default.png"}
                    alt={item.productName}
                    width={72}
                    height={96}
                    className="rounded"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="flex-grow-1 cart-item-details">
                  <div className="d-flex justify-content-between mb-2">
                    <h6>{item.productName}</h6>
                    <span className="font-weight-bold">
                      Tk{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="cart-item-quantity">
                      <Button
                        size="sm"
                        variant="link"
                        onClick={() =>
                          updateQuantity(item.cartItemID, "decrement")
                        }
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="link"
                        onClick={() =>
                          updateQuantity(item.cartItemID, "increment")
                        }
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      className="remove-item p-0"
                      onClick={() => removeFromCart(item.cartItemID)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      {cartItems.length > 0 && (
        <Modal.Footer>
          <div className="subtotal w-100">
            <span>Subtotal:</span>
            <span>Tk{subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-actions w-100">
            <Link href="/cart" className="w-50">
              <Button
                variant="outline-primary"
                className="w-100"
                onClick={onHide}
              >
                View Cart
              </Button>
            </Link>
            <Link href="/checkout" className="w-50">
              <Button variant="primary" className="w-100" onClick={onHide}>
                Checkout
              </Button>
            </Link>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CartModal;
