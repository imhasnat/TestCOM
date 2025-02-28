"use client";
import PaymentComponent from "components/Client/Cart/PaymentComponent";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const page = () => {
  return (
    <div className="content-wrapper">
      <Container fluid className="content">
        <Row className="justify-content-center">
          <Col>
            <PaymentComponent />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default page;
