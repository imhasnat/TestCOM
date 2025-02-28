import React, { useState } from "react";
import { Card, Button, Offcanvas, Form, Row, Col } from "react-bootstrap";

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
  addressType: "Shipping", // Default to shipping
};

const AddressForm = ({
  onSubmit,
  initialData = initialAddressState,
  showAddressTypeSelection = true,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [useShippingForBilling, setUseShippingForBilling] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (useShippingForBilling) {
        // Create both shipping and billing addresses
        const billingAddress = {
          ...formData,
          addressType: "Billing",
        };
        await onSubmit([formData, billingAddress]);
      } else {
        await onSubmit([formData]);
      }
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
    <Form onSubmit={handleSubmit} className="space-y-4">
      <Row className="gap-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
              className="mt-1"
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
              className="mt-1"
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
              className="mt-1"
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
              className="mt-1"
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
              className="mt-1"
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
              className="mt-1"
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
              className="mt-1"
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
              className="mt-1"
            />
          </Form.Group>
        </Col>
        {showAddressTypeSelection && (
          <Col md={12}>
            <Form.Group>
              <Form.Label>Address Type</Form.Label>
              <Form.Select
                value={formData.addressType}
                onChange={(e) => handleChange("addressType", e.target.value)}
                required
                className="mt-1"
              >
                <option value="Shipping">Shipping Address</option>
                <option value="Billing">Billing Address</option>
              </Form.Select>
            </Form.Group>
            {formData.addressType === "Shipping" && (
              <Form.Check
                type="checkbox"
                label="Use shipping address as billing address"
                checked={useShippingForBilling}
                onChange={(e) => setUseShippingForBilling(e.target.checked)}
                className="mt-2"
              />
            )}
          </Col>
        )}
        <Col md={12} className="space-x-2">
          <Button type="submit" disabled={loading} className="mt-3">
            {loading ? "Saving..." : "Save Address"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="mt-3"
            >
              Cancel
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default AddressForm;
