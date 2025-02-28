import {
  createORUpdateMultipleAddressForUser,
  getAddressByUserId,
} from "api/address/addressApi";
import React, { useState, useEffect } from "react";
import { Card, Form, Button, Offcanvas, Row, Col } from "react-bootstrap";
import InitialAddressSetup from "./InitialAddressSetup";
import SingleAddressForm from "./SingleAddressForm";
import "./address-section-panel.css";
import "./render-address-card.css";

const AddressSection = ({
  user,
  setOrderInfo,
  selectedShippingAddress,
  setSelectedShippingAddress,
  selectedBillingAddress,
  setSelectedBillingAddress,
}) => {
  const [addresses, setAddresses] = useState([]);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialSetup, setInitialSetup] = useState(
    !selectedShippingAddress && !selectedBillingAddress
  );
  const [currentEditType, setCurrentEditType] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchAddresses();
    }
  }, [user?.id]);

  const fetchAddresses = async () => {
    if (!user?.id) return;

    try {
      const response = await getAddressByUserId(user.id);
      if (response.success && response.data) {
        const addressList = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setAddresses(addressList);

        if (addressList.length === 0) {
          setInitialSetup(true);
        } else {
          setInitialSetup(false);

          const shipping = addressList.find(
            (addr) => addr.addressType === "Shipping"
          );
          const billing = addressList.find(
            (addr) => addr.addressType === "Billing"
          );

          if (shipping) setSelectedShippingAddress(shipping);
          if (billing) setSelectedBillingAddress(billing);

          setOrderInfo((prev) => ({
            ...prev,
            shippingAddressID: shipping?.addressID,
            billingAddressID: billing?.addressID,
          }));
        }
      }
    } catch (err) {
      setError("Failed to fetch addresses");
      console.error(err);
    }
  };

  const handleAddressSubmit = async (addressPayload) => {
    setLoading(true);
    setError(null);

    try {
      const payload = addressPayload.map((address) => ({
        ...address,
        userID: user.id,
      }));

      const response = await createORUpdateMultipleAddressForUser(payload);

      if (!response.success) {
        throw new Error("Failed to save address");
      }

      await fetchAddresses();
      setShowAddressForm(false);
      setShowSidePanel(false);
      setInitialSetup(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelection = (address) => {
    // Create a new address object with the selected type
    const updatedAddress = {
      ...address,
      addressType: address.addressType, // Preserve the selected type
    };

    // Update the appropriate address state and order info
    if (updatedAddress.addressType === "Shipping") {
      setSelectedShippingAddress(updatedAddress);
      setOrderInfo((prev) => ({
        ...prev,
        shippingAddressID: updatedAddress.addressID,
      }));
    } else {
      setSelectedBillingAddress(updatedAddress);
      setOrderInfo((prev) => ({
        ...prev,
        billingAddressID: updatedAddress.addressID,
      }));
    }

    setShowSidePanel(false);
  };

  const AddressSelectionPanel = () => {
    const [selectedType, setSelectedType] = useState(
      currentEditType || "Shipping"
    );

    return (
      <Offcanvas
        show={showSidePanel}
        onHide={() => setShowSidePanel(false)}
        placement="end"
        className="address-selection-panel"
      >
        <Offcanvas.Header closeButton className="panel-header">
          <Offcanvas.Title className="panel-title">
            Select {selectedType} Address
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="panel-body">
          {showAddressForm ? (
            <SingleAddressForm
              onSubmit={handleAddressSubmit}
              onCancel={() => setShowAddressForm(false)}
              loading={loading}
              initialAddressType={selectedType}
            />
          ) : (
            <>
              <div className="address-list">
                {addresses.map((address, index) => {
                  // Determine if this address is currently selected for the selected type
                  const isCurrentlySelected =
                    selectedType === "Shipping"
                      ? selectedShippingAddress?.addressID === address.addressID
                      : selectedBillingAddress?.addressID === address.addressID;

                  return (
                    <div key={index} className="address-selection-item mb-3">
                      <div
                        variant="outline-primary"
                        className={`address-card ${
                          isCurrentlySelected ? "selected" : ""
                        }`}
                        onClick={() => {
                          const updatedAddress = {
                            ...address,
                            addressType: selectedType,
                          };
                          handleAddressSelection(updatedAddress);
                        }}
                      >
                        <div className="address-card-header">
                          <div className="address-name">
                            <span className="name">{address.fullName}</span>
                            {isCurrentlySelected && (
                              <span className="current-badge">Current</span>
                            )}
                          </div>
                          <div className="address-type">
                            {address.addressType}
                          </div>
                        </div>
                        <div className="address-details">
                          <div className="address-line">
                            {address.addressLine1}
                          </div>
                          {address.addressLine2 && (
                            <div className="address-line">
                              {address.addressLine2}
                            </div>
                          )}
                          <div className="address-line">
                            {address.city}, {address.state} {address.zipCode}
                          </div>
                          <div className="address-line">{address.country}</div>
                          <div className="address-phone">{address.number}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={() => setShowAddressForm(true)}
                  className="w-full"
                >
                  Add New Address
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    );
  };

  const renderAddressCard = (addressType) => {
    const selectedAddress =
      addressType === "Shipping"
        ? selectedShippingAddress
        : selectedBillingAddress;

    const isShipping = addressType === "Shipping";

    return (
      <Card className="address-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div
                className={`address-type-icon ${
                  isShipping ? "shipping-icon" : "billing-icon"
                }`}
              >
                {isShipping ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 8h14M5 8a2 2 0 100 4h14a2 2 0 100-4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                    <path d="M10 12L8 12M16 12L12 12" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M12 11C12 8.79086 13.7909 7 16 7H22V15H16C13.7909 15 12 13.2091 12 11Z" />
                    <path d="M6 12h4" />
                  </svg>
                )}
              </div>
              <h5 className="mb-0 font-weight-bold">{addressType} Address</h5>
            </div>
            <Button
              className="btn-change"
              onClick={() => {
                setCurrentEditType(addressType);
                setShowSidePanel(true);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              {selectedAddress ? "Edit" : "Add"} Address
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {selectedAddress ? (
            <div
              className="address-content"
              style={{ "--gradient-stop": isShipping ? "0%" : "100%" }}
            >
              <div className="address-field">
                <div className="address-label">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Full Name
                </div>
                <div className="address-value">{selectedAddress.fullName}</div>
              </div>

              <div className="address-field">
                <div className="address-label">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Street Address
                </div>
                <div className="address-value">
                  {selectedAddress.addressLine1}
                  {selectedAddress.addressLine2 && (
                    <div>{selectedAddress.addressLine2}</div>
                  )}
                </div>
              </div>

              <div className="address-field">
                <div className="address-label">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Location
                </div>
                <div className="address-value">
                  {selectedAddress.city}, {selectedAddress.state}{" "}
                  {selectedAddress.zipCode}
                  <div>{selectedAddress.country}</div>
                </div>
              </div>

              <div className="address-field">
                <div className="address-label">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Phone
                </div>
                <div className="address-value">{selectedAddress.number}</div>
              </div>
            </div>
          ) : (
            <div className="empty-address">
              <svg
                className="empty-address-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <p className="empty-address-text">
                No {addressType.toLowerCase()} address selected
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  if (initialSetup) {
    return (
      <div className="mb-4">
        <h5>Add Your Addresses</h5>
        {error && <div className="alert alert-danger mb-3">{error}</div>}
        <InitialAddressSetup onSubmit={handleAddressSubmit} loading={loading} />
      </div>
    );
  }

  return (
    <div className="mb-4">
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <div className="address-grid">
        {renderAddressCard("Shipping")}
        {renderAddressCard("Billing")}
      </div>

      <AddressSelectionPanel />
    </div>
  );
};

export default AddressSection;
