"use client";
import Cart from "components/Client/Cart/Cart";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const page = () => {
  return (
    <div className="content-wrapper">
      <Container fluid className="content">
        <Row className="justify-content-center">
          <Col>
            <Cart />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default page;
