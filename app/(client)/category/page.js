"use client";
import { useSearchParams } from "next/navigation";
import CategoryByProducts from "components/Client/Product/CategoryByProducts";

export default function Page() {
  const searchParams = useSearchParams();

  return <CategoryByProducts searchParams={searchParams} />;
}
