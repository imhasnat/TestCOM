"use client";
import StoreForm from "components/Admin/Store/StoreForm";
import { Container, Row, Col } from "react-bootstrap";
import React from "react";
import StoreConfigForm from "components/Admin/Store/StoreConfigForm";
const FormPage = () => {
  return (
    <>
      <div className="content-wrapper">
        <Container fluid className="content">
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={9}>
              {/* <StoreConfigForm /> */}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FormPage;
