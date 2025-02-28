"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getProductsById } from "api/product/productApi";

// Dynamically import the ProductDetails component with SSR disabled
const ProductDetails = dynamic(
  () => import("components/Client/Product/ProductDetails"),
  {
    ssr: false, // Disable SSR for this component
  }
);

console.log("client");

export default function Page({ params }) {
  const { slug } = params;
  const parts = slug.split("__");
  const productID = decodeURIComponent(parts[1]);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductsById(productID);
        if (response.success) {
          setProduct(response.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Error fetching product");
      }
    };

    fetchProduct();
  }, [productID]);

  if (parts?.length !== 2) {
    return (
      <div className="px-4 my-6">
        <div className="text-center text-danger">Invalid product URL</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 my-6">
        <div className="text-center text-danger">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-4 my-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
