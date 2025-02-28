import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import "./initail-address-setup.css";

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

const InitialAddressSetup = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    shipping: { ...initialAddressState, addressType: "Shipping" },
    billing: { ...initialAddressState, addressType: "Billing" },
  });
  const [useShippingForBilling, setUseShippingForBilling] = useState(false);

  const handleChange = (addressType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = [
      formData.shipping,
      ...(useShippingForBilling
        ? [{ ...formData.shipping, addressType: "Billing" }]
        : [formData.billing]),
    ];
    await onSubmit(payload);
  };

  const renderAddressFields = (type, disabled = false) => (
    <div className={`address-section ${disabled ? "opacity-50" : ""}`}>
      <div className="address-header">
        <h6 className="address-title">
          <span className={`address-icon ${type.toLowerCase()}`}>
            {type === "Shipping" ? "🚚" : "💳"}
          </span>
          {type} Address
        </h6>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={formData[type.toLowerCase()].fullName}
              onChange={(e) =>
                handleChange(type.toLowerCase(), "fullName", e.target.value)
              }
              required
              disabled={disabled}
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
              value={formData[type.toLowerCase()].number}
              onChange={(e) =>
                handleChange(type.toLowerCase(), "number", e.target.value)
              }
              required
              disabled={disabled}
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
              value={formData[type.toLowerCase()].addressLine1}
              onChange={(e) =>
                handleChange(type.toLowerCase(), "addressLine1", e.target.value)
              }
              required
              disabled={disabled}
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
              value={formData[type.toLowerCase()].addressLine2}
              onChange={(e) =>
                handleChange(type.toLowerCase(), "addressLine2", e.target.value)
              }
              disabled={disabled}
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
              value={formData[type.toLowerCase()].city}
              onChange={(e) =>
                handleChange(type.toLowerCase(), "city", e.target.value)
              }
              required
              disabled={disabled}
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
              value={formData[type.toLowerCase()].state}
              onChange={(e) =>
                handleChange(type.toLowerCase(), "state", e.target.value)
              }
              required
              disabled={disabled}
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
              value={formData[type.toLowerCase()].zipCode}
              onChange={(e) =>
                handleChange(type.toLowerCase(), "zipCode", e.target.value)
              }
              required
              disabled={disabled}
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
              value={formData[type.toLowerCase()].country}
              onChange={(e) =>
                handleChange(type.toLowerCase(), "country", e.target.value)
              }
              required
              disabled={disabled}
              placeholder="United States"
              className="modern-input"
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit} className="modern-form">
      {renderAddressFields("Shipping")}

      <Form.Group className="my-4 checkbox-group">
        <Form.Check
          type="checkbox"
          label="Use shipping address as billing address"
          checked={useShippingForBilling}
          onChange={(e) => setUseShippingForBilling(e.target.checked)}
          className="modern-checkbox"
        />
      </Form.Group>

      {!useShippingForBilling && renderAddressFields("Billing")}

      <Button type="submit" disabled={loading} className="modern-button">
        {loading ? "Saving..." : "Save Addresses"}
      </Button>
    </Form>
  );
};

export default InitialAddressSetup;
