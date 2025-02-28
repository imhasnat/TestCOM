"use client";
import CheckoutPage from "components/Client/Cart/CheckoutPage";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const page = () => {
  return (
    <div className="content-wrapper">
      <Container fluid className="content">
        <Row className="justify-content-center">
          <Col>
            <CheckoutPage />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default page;
