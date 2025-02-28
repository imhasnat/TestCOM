"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Modal } from "react-bootstrap";

const CartModal = ({ show, onHide }) => {
  const handleCheckout = async () => {
    // Handle checkout logic
  };

  const handleNavigate = () => {
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="p-4 border-0"
      style={{
        position: "absolute",
        top: "0",
        right: "0",
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5">Shopping Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          height: "235px",
          overflowY: "scroll",
        }}
      >
        {/* Cart item list */}
        <div className="d-flex flex-column gap-3">
          <div className="d-flex gap-3">
            <Image
              src="/ceramic.jpeg"
              alt="Product Image"
              width={72}
              height={96}
              className="rounded"
              style={{ objectFit: "cover" }}
            />
            <div className="d-flex flex-column justify-content-between w-100">
              <div>
                <div className="d-flex justify-content-between align-items-center gap-3">
                  <h6 className="mb-0">Classic Ceramic Vase</h6>
                  <div className="px-2 py-1 bg-light border rounded">$500</div>
                </div>
                <div className="text-muted small">AVAILABLE</div>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Qty. 9</span>
                <span className="text-primary" role="button">
                  Remove
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex gap-3">
            <Image
              src="/ceramic.jpeg"
              alt="Product Image"
              width={72}
              height={96}
              className="rounded"
              style={{ objectFit: "cover" }}
            />
            <div className="d-flex flex-column justify-content-between w-100">
              <div>
                <div className="d-flex justify-content-between align-items-center gap-3">
                  <h6 className="mb-0">Classic Ceramic Vase</h6>
                  <div className="px-2 py-1 bg-light border rounded">$500</div>
                </div>
                <div className="text-muted small">AVAILABLE</div>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Qty. 9</span>
                <span className="text-primary" role="button">
                  Remove
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex gap-3">
            <Image
              src="/ceramic.jpeg"
              alt="Product Image"
              width={72}
              height={96}
              className="rounded"
              style={{ objectFit: "cover" }}
            />
            <div className="d-flex flex-column justify-content-between w-100">
              <div>
                <div className="d-flex justify-content-between align-items-center gap-3">
                  <h6 className="mb-0">Classic Ceramic Vase</h6>
                  <div className="px-2 py-1 bg-light border rounded">$500</div>
                </div>
                <div className="text-muted small">AVAILABLE</div>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Qty. 9</span>
                <span className="text-primary" role="button">
                  Remove
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex-column align-items-stretch gap-3">
        <div className="d-flex justify-content-between font-weight-bold">
          <span>Subtotal</span>
          <span>$4500</span>
        </div>
        <p className="text-muted small mb-3">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="d-flex gap-3 justify-content-between w-100">
          <Link href={"/cart"} className="w-100" onClick={handleNavigate}>
            <Button
              variant="outline-secondary"
              className="w-100 rounded"
              show={show}
            >
              View Cart
            </Button>
          </Link>
          <Link href={"/checkout"} className="w-100" onClick={handleNavigate}>
            <Button variant="dark" className="w-100 rounded">
              Checkout
            </Button>
          </Link>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;
