"use client";
import { useState } from "react";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "../Common/AuthModal";
import { useAuth } from "contexts/AuthContext";
import "./productList.css";
import { useCart } from "contexts/CartContext";

const ProductImage = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(product.image || "/default.png");

  return (
    <div className="product-image-wrapper">
      <Image
        src={imageSrc}
        alt={product.productName}
        onError={() => setImageSrc("/default.png")}
        className="product-image"
        width={300}
        height={300}
        priority={false}
        loading="lazy"
      />
    </div>
  );
};

const ProductList = ({ products }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleProductClick = (product) => {
    const formattedName = product.productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `/product-details?name=${formattedName}&id=${encodeURIComponent(
      product.productID
    )}`;
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoadingProductId(product.productID);
    try {
      await addToCart(product, 1);
      // Optionally add toast notification here
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Optionally add error toast
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div className="product-list-container">
      {showAuthModal && (
        <AuthModal
          show={showAuthModal}
          onHide={() => setShowAuthModal(false)}
        />
      )}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4 px-0">
        {!products?.length ? (
          <Col className="container text-center py-5">
            <h2>No products found</h2>
          </Col>
        ) : (
          products?.map((product) => (
            <Col key={product.productID}>
              <Card className="product-card h-100 shadow-hover">
                <div className="product-card-image">
                  <ProductImage product={product} />
                </div>
                <Card.Body className="d-flex flex-column gap-3">
                  <Link
                    href={handleProductClick(product)}
                    className="text-decoration-none flex-grow-1"
                  >
                    <Card.Title className="product-title">
                      {product.productName}
                    </Card.Title>
                    <Card.Text className="product-description">
                      {product.shortDescription}
                    </Card.Text>
                  </Link>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="product-price">
                      Tk {product.price.toFixed(2)}
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={loadingProductId === product.productID}
                    >
                      {loadingProductId === product.productID ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        "Add to Cart"
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default ProductList;
