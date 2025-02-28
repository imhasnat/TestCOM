import { Trash } from "node_modules/react-bootstrap-icons/dist";
import React from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import "./group-cart.css";

const GroupedCartItems = ({
  cartItems,
  handleRemoveItem,
  handleQuantityUpdate,
  handleShippingFeeChange,
  storeShippingFees,
  isCheckout,
  isLoading,
}) => {
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.storeID]) {
      acc[item.storeID] = {
        storeName: item.storeName,
        items: [],
      };
    }
    acc[item.storeID].items.push(item);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(groupedItems).map(([storeID, group]) => (
        <Card key={storeID} className="p-3 mb-4">
          <div className="store-header-container mb-1">
            <span className="certified-badge">
              <span className="store-name">{group.storeName || "N/A"}</span>
              <span className="badge">Certified Store</span>
            </span>
          </div>
          {group.items.map((item) => (
            <Card className="p-3 mb-3" key={item.cartItemID}>
              <Row className="align-items-center">
                <Col xs={12} md={3}>
                  <Image
                    src={item?.image}
                    alt={item.productName}
                    width={100}
                    height={100}
                    className="rounded"
                    style={{ objectFit: "contain" }}
                  />
                </Col>
                <Col xs={6} md={5} className="mt-3 mt-md-0">
                  <h5>{item?.productName}</h5>
                  <p className="mb-2">
                    Tk
                    {(
                      (item.price - (item.price * (item.discount || 0)) / 100) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                  {isCheckout && (
                    <div
                      className="fs-4"
                      onClick={() => handleRemoveItem(item.cartItemID)}
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      role="button"
                      aria-label="Remove item"
                    >
                      <Trash />
                    </div>
                  )}
                </Col>
                {isCheckout && (
                  <Col xs={6} md={4} className="text-end">
                    <div className="d-flex align-items-center justify-content-end">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleQuantityUpdate(item.cartItemID, "decrement")
                        }
                        disabled={isLoading || item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="px-3">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleQuantityUpdate(item.cartItemID, "increment")
                        }
                        disabled={isLoading}
                      >
                        +
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>
            </Card>
          ))}
          {isCheckout && (
            <Card className="mb-3">
              <Card.Header>Delivery Option</Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Form.Check
                    type="radio"
                    id={`standard-delivery${storeID}`}
                    name={`deliveryOption${storeID}`}
                    checked={storeShippingFees[storeID] === 80}
                    onChange={() => handleShippingFeeChange(storeID, 80)}
                  />
                  <label
                    htmlFor={`standard-delivery${storeID}`}
                    className="ms-2"
                  >
                    Tk80 Standard Delivery
                    <small className="text-muted ms-3">Get by Dec 1-3</small>
                  </label>
                </div>
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    id={`express-delivery${storeID}`}
                    name={`deliveryOption${storeID}`}
                    checked={storeShippingFees[storeID] === 160}
                    onChange={() => handleShippingFeeChange(storeID, 160)}
                  />
                  <label
                    htmlFor={`express-delivery${storeID}`}
                    className="ms-2"
                  >
                    Tk160 Express Delivery
                    <small className="text-muted ms-3">Get by Nov 29-30</small>
                  </label>
                </div>
              </Card.Body>
            </Card>
          )}
        </Card>
      ))}
    </div>
  );
};

export default GroupedCartItems;
