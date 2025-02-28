import {
  createORUpdateMultipleAddressForUser,
  getAddressByUserId,
} from "api/address/addressApi";
import { useAuth } from "contexts/AuthContext";
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
} from "react-bootstrap";
import "./address-card-user-profile.css";

const UserProfilePage = () => {
  const [addresses, setAddresses] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [defaultShipping, setDefaultShipping] = useState(null);
  const [defaultBilling, setDefaultBilling] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await getAddressByUserId(user?.id);
        if (response.success && response.data) {
          setAddresses(response.data);
          setShippingAddresses(
            response.data.filter((addr) => addr.addressType === "Shipping")
          );
          setBillingAddresses(
            response.data.filter((addr) => addr.addressType === "Billing")
          );
        }
      } catch (err) {
        setError("Failed to fetch addresses");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [user?.id]);

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    setSaveError(null);
    setCurrentAddress(null);
  };

  const handleSaveAddress = async () => {
    setIsSaving(true);
    setSaveError(null);

    const requiredFields = [
      "fullName",
      "addressLine1",
      "city",
      "state",
      "zipCode",
      "country",
    ];
    const missingFields = requiredFields.filter(
      (field) => !currentAddress[field]
    );

    if (missingFields.length > 0) {
      setSaveError(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      setIsSaving(false);
      return;
    }

    try {
      // Prepare the payload
      const payload = [
        {
          userID: user.id,
          fullName: currentAddress.fullName,
          number: currentAddress.number || null,
          addressType: currentAddress.addressType,
          addressLine1: currentAddress.addressLine1,
          addressLine2: currentAddress.addressLine2 || null,
          city: currentAddress.city,
          state: currentAddress.state,
          zipCode: currentAddress.zipCode,
          country: currentAddress.country,
          ...(editMode && currentAddress.addressID
            ? { addressID: currentAddress.addressID }
            : {}),
        },
      ];

      // Call the API
      const response = await createORUpdateMultipleAddressForUser(payload);

      if (response.success) {
        const { billing, shipping } = response.data;

        if (billing.success) {
          const updatedBilling = {
            ...currentAddress,
            addressID: billing.id,
            addressType: "Billing",
          };

          if (editMode) {
            setBillingAddresses((prev) =>
              prev.map((addr) =>
                addr.addressID === currentAddress.addressID
                  ? updatedBilling
                  : addr
              )
            );
          } else {
            setBillingAddresses((prev) => [...prev, updatedBilling]);
          }
        }

        if (shipping.success) {
          const updatedShipping = {
            ...currentAddress,
            addressID: shipping.id,
            addressType: "Shipping",
          };

          if (editMode) {
            setShippingAddresses((prev) =>
              prev.map((addr) =>
                addr.addressID === currentAddress.addressID
                  ? updatedShipping
                  : addr
              )
            );
          } else {
            setShippingAddresses((prev) => [...prev, updatedShipping]);
          }
        }

        // Update combined addresses list
        setAddresses((prev) => {
          const updatedAddresses = prev.map((addr) => {
            if (addr.addressID === currentAddress.addressID) {
              if (billing.success && addr.addressType === "Billing") {
                return { ...addr, addressID: billing.id };
              }
              if (shipping.success && addr.addressType === "Shipping") {
                return { ...addr, addressID: shipping.id };
              }
            }
            return addr;
          });

          if (!editMode) {
            if (billing.success)
              updatedAddresses.push({
                ...currentAddress,
                addressID: billing.id,
                addressType: "Billing",
              });
            if (shipping.success)
              updatedAddresses.push({
                ...currentAddress,
                addressID: shipping.id,
                addressType: "Shipping",
              });
          }

          return updatedAddresses;
        });

        // Close modal
        handleModalClose();
      } else {
        setSaveError("Failed to save address. Please try again.");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      setSaveError(
        error.message ||
          "An error occurred while saving the address. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAddress = (address) => {
    setCurrentAddress({ ...address });
    setEditMode(true);
    setShowModal(true);
  };

  const renderAddressCard = (address, type) => (
    <Col md={6} lg={4} className="mb-4" key={address.addressID}>
      <Card className={`address-card`}>
        <Card.Body>
          <div className="address-type-badge">
            <Badge bg={type === "Shipping" ? "info" : "warning"}>{type}</Badge>
            {((type === "Shipping" && defaultShipping === address.addressID) ||
              (type === "Billing" && defaultBilling === address.addressID)) && (
              <Badge bg="success" className="ms-2">
                Default
              </Badge>
            )}
          </div>

          <div className="address-content">
            <h5 className="name">{address.fullName || "No Name"}</h5>

            <div className="address-details">
              <p className="address-line">{address.addressLine1}</p>
              {address.addressLine2 && (
                <p className="address-line">{address.addressLine2}</p>
              )}
              <p className="address-line">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="address-line">{address.country}</p>
              <p className="phone">
                <span className="phone-label">Phone:</span>{" "}
                {address.number || "No Phone"}
              </p>
            </div>
          </div>

          <div className="address-actions">
            <Button
              variant="outline-primary"
              size="sm"
              className="edit-btn"
              onClick={() => handleEditAddress(address)}
            >
              Edit
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  if (!user) {
    return (
      <Container className="mt-5">
        <Row>
          <Col>
            <Card className="shadow-sm rounded">
              <Card.Body>
                <h3>Loading profile...</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-5">
        <Card className="profile-card">
          <Card.Body>
            <Row>
              <Col md={2} className="text-center">
                <div className="profile-avatar">
                  {user.userName?.charAt(0).toUpperCase() || "U"}
                </div>
              </Col>
              <Col md={10}>
                <div className="profile-info">
                  <div className="profile-header">
                    <h3 className="profile-title">User Profile</h3>
                    <Badge bg="primary" className="profile-status">
                      Active
                    </Badge>
                  </div>
                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="detail-label">Username</span>
                      <span className="detail-value">
                        {user.userName || "N/A"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Member Since</span>
                      <span className="detail-value">
                        {user.joinDate || "N/A"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">
                        {user.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
      {isLoading ? (
        <Row>
          <Col>
            <p>Loading addresses...</p>
          </Col>
        </Row>
      ) : (
        <>
          <Row>
            <Col md={12}>
              <h4 className="mb-4">Shipping Addresses</h4>
              <Row>
                {shippingAddresses.length === 0 ? (
                  <p className="text-muted">No shipping addresses found.</p>
                ) : (
                  shippingAddresses.map((addr) =>
                    renderAddressCard(addr, "Shipping")
                  )
                )}
              </Row>
              <Button
                variant="outline-primary"
                className="mt-3"
                onClick={() => {
                  setShowModal(true);
                  setCurrentAddress({
                    fullName: "",
                    number: "",
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "",
                    addressType: "Shipping",
                  });
                }}
              >
                Add Shipping Address
              </Button>
            </Col>
            <Col md={12} className="mt-4">
              <h4 className="mb-4">Billing Addresses</h4>
              <Row>
                {billingAddresses.length === 0 ? (
                  <p className="text-muted">No billing addresses found.</p>
                ) : (
                  billingAddresses.map((addr) =>
                    renderAddressCard(addr, "Billing")
                  )
                )}
              </Row>
              <Button
                variant="outline-primary"
                className="mt-3"
                onClick={() => {
                  setShowModal(true);
                  setCurrentAddress({
                    fullName: "",
                    number: "",
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "",
                    addressType: "Billing",
                  });
                }}
              >
                Add Billing Address
              </Button>
            </Col>
          </Row>
        </>
      )}

      <Modal
        show={showModal}
        onHide={handleModalClose}
        className="address-modal"
      >
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>
            {editMode ? "Edit Address" : "Add New Address"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {saveError && (
            <Alert variant="danger" className="mb-3">
              {saveError}
            </Alert>
          )}
          <Form className="address-form">
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={currentAddress?.fullName || ""}
                    onChange={(e) =>
                      setCurrentAddress((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    value={currentAddress?.number || ""}
                    onChange={(e) =>
                      setCurrentAddress((prev) => ({
                        ...prev,
                        number: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="form-group">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                type="text"
                placeholder="Street address"
                value={currentAddress?.addressLine1 || ""}
                onChange={(e) =>
                  setCurrentAddress((prev) => ({
                    ...prev,
                    addressLine1: e.target.value,
                  }))
                }
              />
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={currentAddress?.addressLine2 || ""}
                onChange={(e) =>
                  setCurrentAddress((prev) => ({
                    ...prev,
                    addressLine2: e.target.value,
                  }))
                }
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    value={currentAddress?.city || ""}
                    onChange={(e) =>
                      setCurrentAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter state"
                    value={currentAddress?.state || ""}
                    onChange={(e) =>
                      setCurrentAddress((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>ZIP Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ZIP code"
                    value={currentAddress?.zipCode || ""}
                    onChange={(e) =>
                      setCurrentAddress((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter country"
                    value={currentAddress?.country || ""}
                    onChange={(e) =>
                      setCurrentAddress((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button
            variant="secondary"
            onClick={handleModalClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveAddress}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : editMode ? (
              "Save Changes"
            ) : (
              "Add Address"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfilePage;
