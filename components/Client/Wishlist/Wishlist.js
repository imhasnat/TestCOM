import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  Col,
  Image,
  Row,
  Button,
  Container,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import {
  FaShare,
  FaTrash,
  FaCartPlus,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./wishlist.css";
import { useWishlist } from "contexts/WishlistContext";
import { createOrUpdateMultipleCart } from "api/cart/cartApi";
import { useAuth } from "contexts/AuthContext";
import Link from "node_modules/next/link";

const Wishlist = () => {
  const [copied, setCopied] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { user } = useAuth();

  const {
    wishlistItems,
    removeFromWishlist,
    error: wishlistError,
  } = useWishlist();

  // Initialize quantities and selection states
  useEffect(() => {
    const initialQuantities = {};
    const initialSelection = {};
    wishlistItems.forEach((item) => {
      initialQuantities[item.productID] = Math.max(
        1,
        Math.min(99, item.quantity || 1)
      );
      initialSelection[item.productID] = false;
    });
    setQuantities(initialQuantities);
    setSelectedItems(initialSelection);
  }, [wishlistItems]);

  const handleCopyUrl = async () => {
    try {
      const url = `${window.location.origin}/share-wishlist?id=${wishlistItems[0]?.wishlistID}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Wishlist URL copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy URL. Please try again.");
    }
  };

  //   const handleQuantityChange = useCallback((productId, value) => {
  //     const newValue = Math.max(1, Math.min(99, value));
  //     setQuantities((prev) => ({
  //       ...prev,
  //       [productId]: newValue,
  //     }));
  //   }, []);

  const handleCheckboxChange = useCallback((productId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  }, []);

  const handleSelectAll = useCallback(
    (checked) => {
      setSelectedItems((prev) => {
        const newSelection = {};
        wishlistItems.forEach((item) => {
          newSelection[item.productID] = checked;
        });
        return newSelection;
      });
    },
    [wishlistItems]
  );

  const handleAddSelectedToCart = async () => {
    if (!user?.id) {
      toast.warning("Please log in to add items to cart");
      return;
    }

    const selectedProducts = wishlistItems.filter(
      (item) => selectedItems[item.productID]
    );

    if (selectedProducts.length === 0) {
      toast.warning("Please select items to add to cart");
      return;
    }

    const cartPayload = selectedProducts.map((item) => ({
      userId: user.id,
      productId: item.productID,
      quantity: quantities[item.productID],
    }));

    setIsAddingToCart(true);
    try {
      await createOrUpdateMultipleCart(user?.id, cartPayload);
      toast.success("Items added to cart successfully");
      handleSelectAll(false);
    } catch (error) {
      console.error("Error adding items to cart:", error);
      toast.error("Failed to add items to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const selectedCount = useMemo(
    () => Object.values(selectedItems).filter(Boolean).length,
    [selectedItems]
  );

  if (wishlistError) {
    return (
      <Container className="py-5">
        <Card className="text-center p-5">
          <Card.Body>
            <h3>Error loading wishlist</h3>
            <p>Please try refreshing the page.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="wishlist-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2>My Wishlist ({wishlistItems.length} items)</h2>
          {user?.id && (
            <div className="share-wrapper">
              {/* <Button
                variant="outline-primary"
                onClick={handleCopyUrl}
                className="share-button"
                disabled={copied}
              >
                <FaShare className="me-2" />
                {copied ? "Copied!" : "Share Wishlist"}
              </Button> */}
            </div>
          )}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h3>Your wishlist is empty</h3>
            <p>Add items to your wishlist to save them for later!</p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Form.Check
                  type="checkbox"
                  label={`Select All Items (${wishlistItems.length})`}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={
                    wishlistItems.length > 0 &&
                    wishlistItems.every((item) => selectedItems[item.productID])
                  }
                />
                <span className="selected-count">
                  {selectedCount} items selected
                </span>
              </div>
            </Card.Body>
          </Card>

          <div className="wishlist-items">
            {wishlistItems.map((item) => (
              <Card key={item.productID} className="wishlist-item mb-4">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={12} md={1}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedItems[item.productID] || false}
                        onChange={() => handleCheckboxChange(item.productID)}
                      />
                    </Col>
                    <Col xs={12} md={2}>
                      <div className="product-image-container">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                            e.target.src = "/placeholder-image.jpg";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                    </Col>
                    <Col xs={12} md={4}>
                      <div className="product-details">
                        <h4 className="product-name">{item.productName}</h4>
                        <p className="product-price">
                          Tk {item.price.toLocaleString()}
                        </p>
                      </div>
                    </Col>
                    <Col xs={12} md={3}>
                      <div className="quantity-control">
                        {/* <InputGroup>
                          <Button
                            variant="outline-secondary"
                            onClick={() =>
                              handleQuantityChange(
                                item.productID,
                                quantities[item.productID] - 1
                              )
                            }
                            disabled={quantities[item.productID] <= 1}
                          >
                            <FaChevronDown />
                          </Button>
                          <Form.Control
                            type="number"
                            min="1"
                            max="99"
                            value={quantities[item.productID] || 1}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.productID,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="text-center"
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() =>
                              handleQuantityChange(
                                item.productID,
                                quantities[item.productID] + 1
                              )
                            }
                            disabled={quantities[item.productID] >= 99}
                          >
                            <FaChevronUp />
                          </Button>
                        </InputGroup> */}
                        <InputGroup>
                          Quantity: {quantities[item.productID]}
                        </InputGroup>
                      </div>
                    </Col>
                    <Col xs={12} md={2}>
                      <Button
                        variant="outline-danger"
                        className="w-100"
                        onClick={() => removeFromWishlist(item.productID)}
                      >
                        <FaTrash className="me-2" />
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
          <p className="text-center py-4">
            Your wishlist URL for sharing:
            {wishlistItems[0]?.wishlistID && user?.id ? (
              <Link
                href={`${window.location.origin}/share-wishlist?id=${wishlistItems[0].wishlistID}`}
              >
                {`${window.location.origin}/share-wishlist?id=${wishlistItems[0].wishlistID}`}
              </Link>
            ) : (
              <span>No wishlist available for sharing.</span>
            )}
          </p>

          <div className="sticky-bottom-bar">
            <Card className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{selectedCount}</strong> items selected
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddSelectedToCart}
                  disabled={isAddingToCart || selectedCount === 0}
                >
                  {isAddingToCart ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <FaCartPlus className="me-2" />
                      Add Selected to Cart
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </Container>
  );
};

export default Wishlist;
