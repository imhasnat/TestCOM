import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
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
  addressType: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  userName: "test",
};

const AddressSection = ({ user, setOrderInfo }) => {
  const [shippingAddress, setShippingAddress] = useState({
    ...initialAddressState,
    addressType: "Shipping",
  });
  const [billingAddress, setBillingAddress] = useState({
    ...initialAddressState,
    addressType: "Billing",
  });
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasShippingAddress, setHasShippingAddress] = useState(false);
  const [hasBillingAddress, setHasBillingAddress] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;

      try {
        const response = await getAddressByUserId(user.id);
        if (response.success && response.data) {
          const addresses = Array.isArray(response.data)
            ? response.data
            : [response.data];

          const shipping = addresses.find(
            (addr) => addr.addressType === "Shipping"
          );
          const billing = addresses.find(
            (addr) => addr.addressType === "Billing"
          );

          if (shipping) {
            setShippingAddress((prev) => ({
              ...prev,
              ...shipping,
            }));
            setHasShippingAddress(true);
          }

          if (billing) {
            setBillingAddress((prev) => ({
              ...prev,
              ...billing,
            }));
            setHasBillingAddress(true);
            if (
              JSON.stringify(shipping) ===
              JSON.stringify({ ...billing, addressType: "Shipping" })
            ) {
              setSameAsShipping(true);
            }
          }

          setOrderInfo((prev) => ({
            ...prev,
            shippingAddressID: shipping?.addressID,
            billingAddressID: billing?.addressID,
          }));
          console.log(response.data);
        }
      } catch (err) {
        setError("Failed to fetch addresses");
        console.error(err);
      }
    };

    fetchAddresses();
  }, [user?.id]);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress({
        ...shippingAddress,
        addressType: "Billing",
        addressID: billingAddress.addressID,
      });
      setIsEditingBilling(false);
    }
  }, [sameAsShipping, shippingAddress]);

  const handleInitialSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const addressPayload = [
        {
          ...shippingAddress,
          userID: user.id,
          addressType: "Shipping",
        },
        {
          ...(sameAsShipping ? shippingAddress : billingAddress),
          userID: user.id,
          addressType: "Billing",
        },
      ];

      const response = await createORUpdateMultipleAddressForUser(
        addressPayload
      );

      if (!response.success) {
        throw new Error("Failed to save addresses");
      }

      if (response.data) {
        const { billing, shipping } = response.data;

        if (shipping && shipping.success) {
          setShippingAddress((prev) => ({
            ...prev,
            addressID: shipping.id,
          }));
          setHasShippingAddress(true);
        }

        if (billing && billing.success) {
          setBillingAddress((prev) => ({
            ...prev,
            addressID: billing.id,
          }));
          setHasBillingAddress(true);
        }

        setOrderInfo((prev) => ({
          ...prev,
          shippingAddressID: shipping.id,
          billingAddressID: billing.id,
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (addressType) => {
    setLoading(true);
    setError(null);

    try {
      const addressToUpdate =
        addressType === "Shipping" ? shippingAddress : billingAddress;
      const addressPayload = [
        {
          ...addressToUpdate,
          userID: user.id,
          addressType,
        },
      ];

      // If updating shipping and billing is same as shipping, update billing too
      if (addressType === "Shipping" && sameAsShipping) {
        addressPayload.push({
          ...addressToUpdate,
          userID: user.id,
          addressType: "Billing",
          addressID: billingAddress.addressID,
        });
      }

      const response = await createORUpdateMultipleAddressForUser(
        addressPayload
      );

      if (!response.success) {
        throw new Error("Failed to update address");
      }

      if (response.data) {
        const { billing, shipping } = response.data;

        if (shipping && shipping.success && addressType === "Shipping") {
          setShippingAddress((prev) => ({
            ...prev,
            addressID: shipping.id,
          }));
          setIsEditingShipping(false);
        }

        if (billing && billing.success && addressType === "Billing") {
          setBillingAddress((prev) => ({
            ...prev,
            addressID: billing.id,
          }));
          setIsEditingBilling(false);
        }

        setOrderInfo((prev) => ({
          ...prev,
          ...(shipping && { shippingAddressID: shipping.id }),
          ...(billing && { billingAddressID: billing.id }),
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAddressCard = (addressType) => {
    const isShipping = addressType === "Shipping";
    const currentAddress = isShipping ? shippingAddress : billingAddress;
    const hasAddress = isShipping ? hasShippingAddress : hasBillingAddress;
    const isEditing = isShipping ? isEditingShipping : isEditingBilling;
    const setIsEditing = isShipping
      ? setIsEditingShipping
      : setIsEditingBilling;
    const setAddress = isShipping ? setShippingAddress : setBillingAddress;

    return (
      <Card className="mb-3">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{addressType} Address</h5>
            {hasAddress && !isEditing && !(!isShipping && sameAsShipping) && (
              <Button variant="link" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          {!isShipping && (
            <Form.Check
              type="checkbox"
              label="Same as shipping address"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="mb-3"
            />
          )}

          {(!sameAsShipping || isShipping) && (
            <>
              {isEditing || !hasAddress ? (
                <>
                  <AddressForm
                    addressData={currentAddress}
                    setAddressData={setAddress}
                    disabled={!isShipping && sameAsShipping}
                  />
                  {((hasAddress && isEditing) ||
                    (!hasShippingAddress &&
                      !hasBillingAddress &&
                      !isShipping)) && (
                    <div className="mt-3">
                      <Button
                        variant="primary"
                        onClick={() =>
                          hasAddress
                            ? handleUpdateAddress(addressType)
                            : handleInitialSave()
                        }
                        disabled={loading}
                        className="me-2"
                      >
                        {loading
                          ? "Saving..."
                          : hasAddress
                          ? "Update Address"
                          : "Save Address"}
                      </Button>
                      {hasAddress && (
                        <Button
                          variant="outline-secondary"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="address-wrapper">
                  <p>
                    <span className="ms-2">
                      <div className="address-container">
                        <input
                          type="radio"
                          name={`${currentAddress.addressType}Address`}
                          value={currentAddress.id}
                          className="address-radio"
                        />
                        <div className="address-details">
                          <p className="address-name">
                            {currentAddress.fullName}
                          </p>
                          <p className="address-line">
                            {currentAddress.addressLine1}
                            {currentAddress.addressLine2 && (
                              <>, {currentAddress.addressLine2}</>
                            )}
                          </p>
                          <p className="address-location">
                            {currentAddress.city}, {currentAddress.state},
                            {currentAddress.zipCode}
                          </p>
                          <p className="address-country">
                            {currentAddress.country}
                          </p>
                          <p className="address-phone">
                            {currentAddress.number}
                          </p>
                        </div>
                      </div>
                    </span>
                  </p>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="mb-4">
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {renderAddressCard("Shipping")}
      {renderAddressCard("Billing")}
    </div>
  );
};

export default AddressSection;
