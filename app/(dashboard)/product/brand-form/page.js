"use client";
import { Container, Row, Col } from "react-bootstrap";
import React from "react";
import AddBrandForm from "components/Admin/Store/AddBrandForm ";
const FormPage = () => {
  return (
    <>
      <div className="content-wrapper">
        <Container fluid className="content">
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={9}>
              <AddBrandForm />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FormPage;
