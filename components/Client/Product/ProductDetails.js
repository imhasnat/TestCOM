"use client";

import { Container, Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import CustomizeProducts from "./CustomizeProducts";
import ProductImages from "./ProductImages";
import { useEffect, useState } from "react";
import { getProductGallery, getProductsById } from "api/product/productApi";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { FaHeart, FaShare } from "react-icons/fa";
import styles from "./ProductDetails.module.css";
import { useWishlist } from "contexts/WishlistContext";

export default function ProductDetails({ searchParams }) {
  const productID = searchParams.get("id");
  const [product, setProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState(null);
  const [error, setError] = useState(null);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to share
    </Tooltip>
  );

  useEffect(() => {
    const fetchProduct = async () => {
      setProduct(null);
      setImageFiles(null);
      setError(null);

      if (!productID) {
        setError("Invalid product ID");
        return;
      }

      try {
        const [productResponse, galleryResponse] = await Promise.allSettled([
          getProductsById(productID),
          getProductGallery(productID),
        ]);

        if (
          productResponse.status === "fulfilled" &&
          productResponse.value.success
        ) {
          setProduct(productResponse.value.data);
        } else if (productResponse.status === "rejected") {
          console.error("Error fetching product:", productResponse.reason);
        }

        if (
          galleryResponse.status === "fulfilled" &&
          galleryResponse.value.success
        ) {
          setImageFiles(galleryResponse.value.images);
        } else if (galleryResponse.status === "rejected") {
          console.error("Error fetching gallery:", galleryResponse.reason);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Error fetching product");
      }
    };

    fetchProduct();

    // Cleanup function to prevent memory leaks
    return () => {
      setProduct(null);
      setImageFiles(null);
    };
  }, [productID]);

  const handleWishlist = async () => {
    if (isInWishlist(product.productID)) {
      const response = await removeFromWishlist(product.productID);
      if (response) toast.success("Removed from wishlist");
      else toast.error("Failed to remove", response);
    } else {
      const response = await addToWishlist(product);
      if (!response) toast.error("Failed to add", response);
      else toast.success("Added to wishlist");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied successfully!");
    } catch (err) {
      console.error("Error copying URL:", err);
      toast.error("Error: URL copy failed!");
    }
  };

  const discountedPrice =
    product?.price - (product?.price * (product?.discount || 0)) / 100;

  if (!productID) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>Invalid product URL</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  return (
    <Container className={styles.mainContainer}>
      <Row className={`${styles.productContainer} gap-4`}>
        <Col lg={6} className={styles.imageSection}>
          <ProductImages imageFiles={imageFiles} />
        </Col>

        <Col lg={5} className={styles.detailsSection}>
          {/* Header Section */}
          <div className={styles.headerSection}>
            <h1 className={styles.productTitle}>{product?.productName}</h1>
            <div className={styles.actionButtons}>
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <Button
                  variant="outline"
                  size="icon"
                  className={styles.iconButton}
                  onClick={handleShare}
                >
                  <FaShare size={20} />
                </Button>
              </OverlayTrigger>
              <Button
                variant="outline"
                size="icon"
                className={`${styles.iconButton} ${
                  isInWishlist(product?.productID) ? styles.wishlisted : ""
                }`}
                onClick={handleWishlist}
              >
                <FaHeart size={20} />
              </Button>
            </div>
          </div>

          {/* Price Section */}
          <div className={styles.priceSection}>
            {product?.discount > 0 && (
              <span className={styles.originalPrice}>
                Tk{product?.price.toLocaleString()}
              </span>
            )}
            <span className={styles.discountedPrice}>
              Tk{discountedPrice.toLocaleString()}
            </span>
            {product?.discount > 0 && (
              <span className={styles.discountBadge}>
                {product?.discount}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className={styles.description}>{product?.shortDescription}</p>

          {/* Customize Products Section */}
          <CustomizeProducts
            product={product}
            stock={product?.stock}
            handleWishlist={handleWishlist}
          />
        </Col>

        {/* Product Details Section */}
        <div className={styles.productDetails}>
          {/* <h4 className={styles.detailsTitle}>Product Details</h4> */}
          <div
            className={styles.detailsContent}
            dangerouslySetInnerHTML={{ __html: product?.description }}
          />
        </div>
      </Row>
    </Container>
  );
}
