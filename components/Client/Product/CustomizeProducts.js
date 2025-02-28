"use client";

import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import styles from "./CustomizeProducts.module.css";
import { useCart } from "contexts/CartContext";
import { useAuth } from "contexts/AuthContext";
import { toast } from "node_modules/react-toastify/dist";
import AuthModal from "../Common/AuthModal";
import { useWishlist } from "contexts/WishlistContext";

const CustomizeProducts = ({ product, stock, handleWishlist }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist } = useWishlist();

  const handleAddToCart = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product, quantity);
      // toast.success("Added to cart successfully!");
    } catch (error) {
      // toast.error("Failed to add to cart");
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <div className={styles.customizeContainer}>
        {/* Quantity Section */}
        <div className={styles.quantitySection}>
          <h4 className={styles.sectionTitle}>Quantity</h4>
          <div className={styles.quantityControls}>
            <Button
              variant="outline-secondary"
              className={styles.quantityButton}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <FaMinus size={12} />
            </Button>
            <span className={styles.quantityDisplay}>{quantity}</span>
            <Button
              variant="outline-secondary"
              className={styles.quantityButton}
              onClick={() => setQuantity(Math.min(stock, quantity + 1))}
              disabled={quantity >= stock}
            >
              <FaPlus size={12} />
            </Button>
          </div>
          {stock <= 5 && stock > 0 && (
            <span className={styles.stockWarning}>
              Only {stock} items left in stock!
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Button
            variant="primary"
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            disabled={stock <= 0 || isLoading}
          >
            <FaShoppingCart className={styles.buttonIcon} />
            <span>
              {stock <= 0
                ? "Out of Stock"
                : isLoading
                ? "Adding..."
                : "Add to Cart"}
            </span>
          </Button>
          <Button
            variant="outline-primary"
            className={styles.buyNowButton}
            disabled={stock <= 0}
            onClick={handleWishlist}
          >
            {!isInWishlist(product?.productID)
              ? "Add to Wishlist"
              : "Remove from Wishlist"}
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal show={showAuthModal} handleClose={handleAuthModalClose} />
    </>
  );
};

export default CustomizeProducts;
