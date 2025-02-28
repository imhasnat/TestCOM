"use client";
import { Container, Row, Col } from "react-bootstrap";
import React from "react";
import CouponForm from "components/Admin/Store/CouponForm";
const FormPage = () => {
  return (
    <>
      <div className="content-wrapper">
        <Container fluid className="content">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <CouponForm />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FormPage;
