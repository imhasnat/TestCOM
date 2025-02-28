const { Offcanvas, Button } = require("bootstrap");
import { useState } from "react";
import "./address-section-panel.css";
import SingleAddressForm from "./SingleAddressForm";

const AddressSelectionPanel = ({
  currentEditType,
  showSidePanel,
  showAddressForm,
  addresses,
  selectedShippingAddress,
  selectedBillingAddress,
}) => {
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

export default AddressSelectionPanel;
