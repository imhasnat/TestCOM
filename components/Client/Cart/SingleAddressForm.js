import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import "./single-address-form.css";

const initialAddressState = {
  userID: "",
  fullName: "",
  number: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  addressType: "Shipping",
};

const SingleAddressForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState(initialAddressState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit([formData]);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="address-section">
      <Form onSubmit={handleSubmit} className="modern-form">
        <div className="address-header">
          <h6 className="address-title">
            <span className="address-icon">📍</span>
            Add New Address
          </h6>
        </div>

        <Form.Group className="mb-4">
          <Form.Label>Address Type</Form.Label>
          <Form.Select
            value={formData.addressType}
            onChange={(e) => handleChange("addressType", e.target.value)}
            required
            className="modern-input modern-select"
          >
            <option value="Shipping">Shipping Address</option>
            <option value="Billing">Billing Address</option>
          </Form.Select>
        </Form.Group>

        <Row className="g-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
                placeholder="John Doe"
                className="modern-input"
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
                placeholder="+1 (555) 000-0000"
                className="modern-input"
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
                placeholder="123 Main St"
                className="modern-input"
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
                placeholder="Apt 4B"
                className="modern-input"
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
                placeholder="New York"
                className="modern-input"
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
                placeholder="NY"
                className="modern-input"
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
                placeholder="10001"
                className="modern-input"
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
                placeholder="United States"
                className="modern-input"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="button-group">
          <Button type="submit" disabled={loading} className="modern-button">
            {loading ? "Saving..." : "Save Address"}
          </Button>
          {onCancel && (
            <Button
              variant="secondary"
              onClick={onCancel}
              className="modern-button-secondary"
            >
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default SingleAddressForm;
