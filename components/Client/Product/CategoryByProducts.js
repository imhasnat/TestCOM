"use client";
import ProductsWrapper from "./Products";

const CategoryByProducts = ({ searchParams }) => {
  const categoryID = searchParams?.get("id");

  return (
    <div className="container px-4 my-6">
      <ProductsWrapper
        id={categoryID}
        element={"categoryId"}
        allFilter={false}
      />
    </div>
  );
};

export default CategoryByProducts;
