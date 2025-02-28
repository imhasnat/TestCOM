import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const AddressForm = ({ addressData, onSubmit }) => {
  const [formData, setFormData] = useState(addressData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              value={formData.number}
              onChange={(e) => handleChange("number", e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
              type="text"
              value={formData.addressLine1}
              onChange={(e) => handleChange("addressLine1", e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Address Line 2</Form.Label>
            <Form.Control
              type="text"
              value={formData.addressLine2}
              onChange={(e) => handleChange("addressLine2", e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>ZIP Code</Form.Label>
            <Form.Control
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="mt-3"
          >
            {loading ? "Saving..." : "Save Address"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AddressForm;
