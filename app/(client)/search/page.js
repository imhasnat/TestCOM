"use client";

import ProductsWrapper from "components/Client/Product/Products";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const param = searchParams?.get("param");
  console.log(param);

  return (
    <div className="container px-4 my-6">
      <ProductsWrapper
        id={null}
        element={null}
        allFilter={true}
        param={param}
      />
    </div>
  );
}
