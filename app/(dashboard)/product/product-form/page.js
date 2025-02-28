"use client";
import { Container, Row, Col } from "react-bootstrap";
import React from "react";
import ProductMultiStep from "components/Admin/Product/ProductMultiStep";
const FormPage = () => {
  return (
    <>
      <div className="content-wrapper">
        <Container fluid className="content">
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={9}>
              <ProductMultiStep />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FormPage;
