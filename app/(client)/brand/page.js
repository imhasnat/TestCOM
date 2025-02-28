"use client";
import BrandByProducts from "components/Client/Product/BrandByProducts";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  console.log(searchParams);

  return <BrandByProducts searchParams={searchParams} />;
}
