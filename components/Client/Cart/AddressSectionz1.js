import React, { useState, useEffect } from "react";
import { Card, Form, Button, Offcanvas } from "react-bootstrap";
import AddressForm from "./AddressForm";
import {
  getAddressByUserId,
  createORUpdateMultipleAddressForUser,
} from "api/address/addressApi";
import "./address-section.css";

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
};

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
  const [currentEditType, setCurrentEditType] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAddresses();
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

        // Set initial selected addresses
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
    } catch (err) {
      setError("Failed to fetch addresses");
      console.error(err);
    }
  };

  const handleAddressSelection = (address) => {
    if (currentEditType === "Shipping") {
      setSelectedShippingAddress(address);
      setOrderInfo((prev) => ({
        ...prev,
        shippingAddressID: address.addressID,
      }));
    } else {
      setSelectedBillingAddress(address);
      setOrderInfo((prev) => ({
        ...prev,
        billingAddressID: address.addressID,
      }));
    }
    setShowSidePanel(false);
  };

  const handleEditClick = (addressType) => {
    setCurrentEditType(addressType);
    setShowSidePanel(true);
  };

  const handleAddAddress = async (newAddress) => {
    setLoading(true);
    setError(null);

    try {
      const addressPayload = [
        {
          ...newAddress,
          userID: user.id,
        },
      ];

      const response = await createORUpdateMultipleAddressForUser(
        addressPayload
      );

      if (!response.success) {
        throw new Error("Failed to save address");
      }

      await fetchAddresses();
      setShowAddressForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const AddressSelectionPanel = () => (
    <Offcanvas
      show={showSidePanel}
      onHide={() => setShowSidePanel(false)}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Select {currentEditType} Address</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {addresses.map((address, index) => (
          <div key={index} className="address-selection-item mb-3">
            <Form.Check
              type="radio"
              name="addressSelection"
              id={`address-${index}`}
              checked={
                currentEditType === "Shipping"
                  ? selectedShippingAddress?.addressID === address.addressID
                  : selectedBillingAddress?.addressID === address.addressID
              }
              onChange={() => handleAddressSelection(address)}
              label={
                <div className="address-details">
                  <p className="mb-1">{address.fullName}</p>
                  <p className="mb-1">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="mb-1">{address.addressLine2}</p>
                  )}
                  <p className="mb-1">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="mb-1">{address.country}</p>
                  <p className="mb-0">{address.number}</p>
                </div>
              }
            />
          </div>
        ))}
        <Button
          variant="primary"
          onClick={() => {
            setShowSidePanel(false);
            setShowAddressForm(true);
          }}
        >
          Add New Address
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );

  const renderAddressCard = (addressType) => {
    const selectedAddress =
      addressType === "Shipping"
        ? selectedShippingAddress
        : selectedBillingAddress;

    return (
      <Card className="mb-3">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{addressType} Address</h5>
            {selectedAddress && (
              <Button
                variant="link"
                onClick={() => handleEditClick(addressType)}
              >
                Edit
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          {selectedAddress ? (
            <div className="address-wrapper">
              <p className="mb-1">{selectedAddress.fullName}</p>
              <p className="mb-1">{selectedAddress.addressLine1}</p>
              {selectedAddress.addressLine2 && (
                <p className="mb-1">{selectedAddress.addressLine2}</p>
              )}
              <p className="mb-1">
                {selectedAddress.city}, {selectedAddress.state}{" "}
                {selectedAddress.zipCode}
              </p>
              <p className="mb-1">{selectedAddress.country}</p>
              <p className="mb-0">{selectedAddress.number}</p>
            </div>
          ) : (
            <div className="text-center">
              <p>No {addressType.toLowerCase()} address found</p>
              <Button
                variant="primary"
                onClick={() => setShowAddressForm(true)}
              >
                Add Address
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="mb-4">
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {showAddressForm ? (
        <div>
          <h5>Add New Address</h5>
          <AddressForm
            addressData={initialAddressState}
            onSubmit={handleAddAddress}
          />
          <Button
            variant="secondary"
            onClick={() => setShowAddressForm(false)}
            className="mt-3"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          {renderAddressCard("Shipping")}
          {renderAddressCard("Billing")}
        </>
      )}

      <AddressSelectionPanel />
    </div>
  );
};

export default AddressSection;
