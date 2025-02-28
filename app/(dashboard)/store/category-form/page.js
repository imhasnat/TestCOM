"use client";
import { Container, Row, Col } from "react-bootstrap";
import React from "react";
import AddCategoryForm from "components/Admin/Store/AddCategoryForm";
const FormPage = () => {
  return (
    <>
      <div className="content-wrapper">
        <Container fluid className="content">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <AddCategoryForm />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FormPage;
