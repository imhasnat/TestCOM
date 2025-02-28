"use client";
import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import { getLatestProducts } from "api/product/productApi";
import { Container } from "react-bootstrap";

const NewProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getLatestProducts(4);
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <ProductList products={products} />
    </div>
  );
};

export default NewProducts;
