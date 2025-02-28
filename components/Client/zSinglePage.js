"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import styles from "./SinglePage.module.css";
import ProductImages from "components/Client/Product/ProductImages";
import CustomizeProducts from "components/Client/Product/CustomizeProducts";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductsById } from "api/product/productApi";

const SinglePage = () => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const productID = searchParams.get("productID");
  console.log(productID);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productID) {
        setError("Product ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await getProductsById(productID);
        console.log(response);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error loading product");
        setLoading(false);
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [productID]);

  if (loading) {
    return (
      <Container className="px-4 my-6">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="px-4 my-6">
        <div className="text-center text-danger">{error}</div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="px-4 my-6">
        <div className="text-center">Product not found</div>
      </Container>
    );
  }

  // Calculate discounted price
  const discountedPrice =
    product.price - product.price * (product.discount / 100);

  return (
    <Container className="px-4 my-6">
      <Row className="gap-4 flex-lg-row">
        {/* Image Section */}
        <Col lg={6} className="mb-4" style={{ top: "20px" }}>
          <ProductImages items={[{ url: product.image }]} />
        </Col>

        {/* Text and Details Section */}
        <Col lg={5} className="d-flex flex-column gap-3">
          <h1 className="display-6">{product.productName}</h1>
          <p className="text-muted">{product.description}</p>
          <div className={`${styles.separator} my-3`} />

          {/* Price Section */}
          {product.discount === 0 ? (
            <h2 className="">${product.price}</h2>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <h3 className="text-decoration-line-through text-muted">
                ${product.price}
              </h3>
              <h2 className="">${discountedPrice.toFixed(2)}</h2>
            </div>
          )}
          <div className={`${styles.separator} my-3`} />

          {/* Customize or Add Product Section */}
          <CustomizeProducts
            productId={product.productID}
            stock={product.stock}
          />
          <div className={`${styles.separator} my-3`} />

          {/* Additional Information Section */}
          <div className="text-muted">
            <h4 className="fw-bold">Product Details</h4>
            <p>{product.shortDescription}</p>
          </div>
          <div className={`${styles.separator} my-3`} />

          {/* Store and Category Information */}
          <div className="text-muted">
            <p>Category ID: {product.categoryID}</p>
            <p>Store ID: {product.storeID}</p>
            <p>Brand ID: {product.brandID}</p>
          </div>

          {/* Stock Information */}
          <div className="text-muted">
            <p className={product.stock > 0 ? "text-success" : "text-danger"}>
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </p>
          </div>

          <div className={`${styles.separator} my-3`} />
        </Col>
      </Row>
    </Container>
  );
};

export default SinglePage;
