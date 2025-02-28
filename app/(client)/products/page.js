"use client";
import { Container } from "react-bootstrap";
import AllProducts from "components/Client/Product/AllProducts";
import ProductsWrapper from "components/Client/Product/Products";

const ListPage = () => {
  return (
    <Container className="px-4 py-5">
      <ProductsWrapper />
    </Container>
  );
};

export default ListPage;
