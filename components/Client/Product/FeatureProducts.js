"use client";
import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import { getFeatureProducts } from "api/product/productApi";

const FeatureProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getFeatureProducts(4);
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

export default FeatureProducts;
