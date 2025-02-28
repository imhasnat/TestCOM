import { useState } from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
// import "../../styles/common.css";
import Link from "next/link";

const CartPage = () => {
  // Dummy data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product 1",
      price: 276,
      quantity: 1,
      image: "/ceramic.jpeg",
    },
    {
      id: 2,
      name: "Product 2",
      price: 145,
      quantity: 1,
      image: "/ceramic.jpeg",
    },
  ]);

  // Handle quantity increase
  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handle quantity decrease
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };
  // Handle product removal
  const removeProduct = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingFee = 50; // Placeholder for shipping fee
  const total = subtotal + shippingFee;

  return (
    <Container className="my-15">
      <h2>Shopping Cart</h2>
      <Row>
        {/* Cart Items */}
        <Col xs={12} md={8}>
          {cartItems.map((item) => (
            <Card className="p-3 mb-3" key={item.id}>
              <Row className="align-items-center">
                <Col xs={3}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                  />
                </Col>
                <Col xs={5}>
                  <h5>{item.name}</h5>
                  <p className="mb-2">$ {item.price * item.quantity}</p>
                  <div className="fs-4" onClick={() => removeProduct(item.id)}>
                    <Trash />
                  </div>
                </Col>
                <Col xs={4} className="text-end">
                  <div className="d-flex align-items-center justify-content-end">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </Button>
                    <span className="px-2">{item.quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>

        {/* Order Summary */}
        <Col xs={12} md={4}>
          <Card className="p-3">
            <h5>Order Summary</h5>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>$ {subtotal}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Shipping Fee</span>
              <span>$ {shippingFee}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <strong>Total</strong>
              <strong>$ {total}</strong>
            </div>
            <Link href={"/checkout"} className="w-100">
              <Button className="w-100 custom-button mt-3">
                Proceed to Checkout
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
