"use client";

import React, { useState } from "react";
import { Button, ButtonGroup, Alert } from "react-bootstrap";
import styles from "./Add.module.css"; // Custom CSS for additional styling

const Add = ({ productId, variantId, stockNumber }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle quantity increase/decrease
  const handleQuantity = (type) => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  // Simulated add to cart function
  const addItemToCart = () => {
    setIsLoading(true);
    setTimeout(() => {
      alert(`Added ${quantity} items of ${productId} to cart`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="d-flex flex-column gap-3">
      <h4 className="fw-bold">Choose a Quantity</h4>
      <div className="d-flex justify-content-between align-items-center">
        {/* Quantity Selector */}
        <div className="d-flex align-items-center gap-3">
          <ButtonGroup className={styles.quantityGroup}>
            <Button
              variant="light"
              onClick={() => handleQuantity("d")}
              disabled={quantity === 1}
              className="fs-4"
            >
              -
            </Button>
            <span className={styles.quantity}>{quantity}</span>
            <Button
              variant="light"
              onClick={() => handleQuantity("i")}
              disabled={quantity === stockNumber}
              className="fs-4"
            >
              +
            </Button>
          </ButtonGroup>
          {/* Stock Information */}
          {stockNumber < 1 ? (
            <Alert variant="danger" className="text-xs">
              Product is out of stock
            </Alert>
          ) : (
            <small className="text-muted">
              Only <span className="text-warning">{stockNumber} items</span>{" "}
              left! <br /> Don’t miss it
            </small>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={addItemToCart}
          disabled={isLoading || stockNumber < 1}
          variant="outline-primary"
          className={`rounded-pill ${styles.addButton}`}
        >
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default Add;
