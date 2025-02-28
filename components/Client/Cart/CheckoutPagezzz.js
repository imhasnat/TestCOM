"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import Link from "next/link";
import { useCart } from "contexts/CartContext";
import GroupedCartItems from "./GroupedCartItems";
import { useAuth } from "contexts/AuthContext";
import {
  createAddressForUser,
  getAddressByUserId,
  updateAddressByUserId,
} from "api/address/addressApi";
import { couponValidation } from "api/order/orderApi";

const CheckoutPage = () => {
  const { cartItems, mounted, getCartCount } = useCart();
  const [shippingFee, setShippingFee] = useState(10);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [hasAddress, setHasAddress] = useState(false);
  const { user } = useAuth();

  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);

  const [billingInfo, setBillingInfo] = useState({
    addressType: "Shipping",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    userId: "",
    id: null,
  });

  const [allCountries, setAllCountries] = useState([]);

  // Fetch user's address on component mount
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const userId = user.id;
        const response = await getAddressByUserId(userId);

        if (!response.success) {
          throw new Error("Failed to fetch address");
        }

        if (response.success && response.data.length > 0) {
          // If address exists, set the billingInfo with the response data
          setHasAddress(true);
          setBillingInfo({
            ...response.data,
            userId,
          });
        } else {
          // If no address data is found, leave billingInfo empty for the user to fill

          setHasAddress(false);
          setBillingInfo((prev) => ({
            ...prev,
            userId,
          }));
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (user?.id) {
      fetchUserAddress();
    }
  }, [user?.id]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const formattedCountries = data
          .map((country) => ({
            code: country.cca2,
            name: country.name.common,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setAllCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.price - (item.price * (item.discount || 0)) / 100;
    return total + itemPrice * item.quantity;
  }, 0);
  const initialTotal = subtotal + shippingFee;

  useEffect(() => {
    setFinalTotal(initialTotal);
  }, [subtotal, shippingFee]);

  if (!mounted) return null;

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    if (subtotal < appliedCoupon.minimumOrderAmount) {
      setCouponError(
        `Minimum order amount required: $${appliedCoupon.minimumOrderAmount}`
      );
      return 0;
    }

    return appliedCoupon.discountAmount;
  };

  const totalAmount = subtotal + shippingFee;
  const discount = calculateDiscount();

  const handlePromoApply = async () => {
    setCouponLoading(true);
    setCouponError("");
    try {
      const response = await couponValidation(promoCode);

      if (response.success) {
        if (subtotal < response.data.minimumOrderAmount) {
          setCouponError(
            `Minimum order amount required: $${response.data.minimumOrderAmount}`
          );
          setAppliedCoupon(null);
          setFinalTotal(initialTotal); // Reset to initial total
        } else {
          setAppliedCoupon(response.data);
          setCouponError("");
          const discountAmount = response.data.discountAmount;

          setFinalTotal(initialTotal - discountAmount);
        }
      } else {
        setCouponError("Invalid coupon code");
        setAppliedCoupon(null);
        setFinalTotal(initialTotal); // Reset to initial total
      }
    } catch (err) {
      setCouponError("Error validating coupon");
      setAppliedCoupon(null);
      setFinalTotal(initialTotal); // Reset to initial total
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      billingInfo.userId = user?.id;
      const endpoint = hasAddress
        ? updateAddressByUserId(billingInfo.id, billingInfo)
        : createAddressForUser(billingInfo);

      const response = await endpoint;
      console.log(response);

      if (!response.success) {
        throw new Error(
          `Failed to ${hasAddress ? "update" : "create"} address`
        );
      }
      if (!hasAddress) {
        setBillingInfo((prev) => ({
          ...prev,
          id: response?.id,
        }));
        setHasAddress(true);
      }

      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = () => {
    const { addressLine1, addressLine2, city, state, zipCode, country } =
      billingInfo;
    const countryName = getCountryName(country, allCountries);
    return `${addressLine1 || ""}, ${addressLine2 || ""}, ${city || ""}, ${
      state || ""
    }, ${zipCode || ""}, ${countryName || ""}`;
  };

  const renderAddressSection = () => {
    if (loading) {
      return (
        <div className="text-center p-4">
          <Spinner animation="border" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger">
          {error}
          <Button
            variant="link"
            className="p-0 ms-2"
            onClick={() => setError(null)}
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (isEditing || !hasAddress) {
      return (
        <Form onSubmit={handleSaveAddress}>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={billingInfo.addressLine1}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo,
                      addressLine1: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Apartment, suite, etc.</Form.Label>
                <Form.Control
                  type="text"
                  value={billingInfo.addressLine2}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo,
                      addressLine2: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={billingInfo.city}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo,
                      city: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  value={billingInfo.state}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo,
                      state: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>ZIP Code</Form.Label>
                <Form.Control
                  type="text"
                  value={billingInfo.zipCode}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo,
                      zipCode: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Select
                  value={billingInfo.country}
                  onChange={(e) =>
                    setBillingInfo({
                      ...billingInfo,
                      country: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select a country</option>
                  {allCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : hasAddress ? (
                  "Update Address"
                ) : (
                  "Save Address"
                )}
              </Button>
              {hasAddress && (
                <Button
                  variant="link"
                  onClick={() => setIsEditing(false)}
                  className="ms-2"
                >
                  Cancel
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      );
    }

    return (
      <>
        <h5>
          {billingInfo.name}
          <span className="text-muted ms-2">{billingInfo.phone}</span>
        </h5>
        <p>
          <span className="badge bg-danger">Shipping</span>
          <span className="ms-2">{formatAddress()}</span>
        </p>
      </>
    );
  };

  return (
    <Container className="my-10">
      <Row>
        {/* Left Side - Shipping and Billing */}
        <Col md={8}>
          <Card className="mb-3">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Shipping & Billing</h5>
                {hasAddress && !isEditing && (
                  <Button
                    variant="link"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body>{renderAddressSection()}</Card.Body>
          </Card>

          {/* Cart Items */}
          <GroupedCartItems
            cartItems={cartItems}
            handleRemoveItem={null}
            handleQuantityUpdate={null}
            isCheckout={false}
            isLoading={false}
          />
        </Col>

        {/* Right Side - Order Summary */}
        <Col md={4} className="mt-5 mt-md-0">
          <Card>
            <Card.Header>Promotion</Card.Header>
            <Card.Body>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={couponLoading}
                />
                <Button
                  className="custom-button"
                  onClick={handlePromoApply}
                  disabled={couponLoading}
                >
                  {couponLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </InputGroup>

              <Card className="mb-3">
                <Card.Header>Order Summary</Card.Header>
                <Card.Body>
                  <Row className="mb-2">
                    <Col>Items Total ({getCartCount()} items)</Col>
                    <Col className="text-end">${subtotal.toFixed(2)}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col>Delivery Fee</Col>
                    <Col className="text-end">${shippingFee.toFixed(2)}</Col>
                  </Row>
                  {appliedCoupon && (
                    <Row className="mb-2">
                      <Col>Discount (Code: {appliedCoupon.code})</Col>
                      <Col className="text-end text-success">
                        -${discount.toFixed(2)}
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col>
                      <strong>Total:</strong>
                    </Col>
                    <Col className="text-end">
                      <strong>${finalTotal.toFixed(2)}</strong>
                    </Col>
                  </Row>
                  {couponError && (
                    <div className="text-danger mt-2 small">{couponError}</div>
                  )}
                  <small className="text-muted">
                    Tax included, where applicable
                  </small>
                </Card.Body>
              </Card>
              <div className="d-grid gap-3">
                <Link href={"/payment"} className="w-100">
                  <Button className="w-100 custom-button mt-3">
                    Proceed to Pay
                  </Button>
                </Link>
                <Link href="/cart" className="w-100 ">
                  <Button variant="outline-secondary" className="w-100">
                    Update Cart
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Helper function to get country name from code
const getCountryName = (code, countries) => {
  const country = countries.find((c) => c.code === code);
  return country ? country.name : code;
};

export default CheckoutPage;
