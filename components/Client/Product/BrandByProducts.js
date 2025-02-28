"use client";
import ProductsWrapper from "./Products";

const BrandByProducts = ({ searchParams }) => {
  const BrandID = searchParams?.get("id");

  return (
    <div className="container px-4 my-6">
      <ProductsWrapper id={BrandID} element={"brandId"} allFilter={false} />
    </div>
  );
};

export default BrandByProducts;
