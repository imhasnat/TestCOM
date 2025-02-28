"use client";
import { useSearchParams } from "next/navigation";
import ProductDetails from "components/Client/Product/ProductDetails";

export default function Page() {
  const searchParams = useSearchParams();

  return <ProductDetails searchParams={searchParams} />;
}
