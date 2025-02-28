"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "./footer.css";

const Footer = () => {
  return (
    <Container className="py-5 px-4 px-md-5 bg-light text-sm mt-5">
      {/* TOP */}
      <Row className="flex-column flex-md-row justify-content-between">
        {/* LEFT */}
        <Col xs={12} md={6} lg={3} className="mb-4 mb-lg-0">
          <Link href="/" passHref>
            <Card.Title className="text-dark display-6 mb-3">
              <b>BHECom</b>
            </Card.Title>
          </Link>
          <Card.Text>Dakkhinkhan, Uttara, Dhaka, Bangladesh</Card.Text>
          <Card.Text className="fw-semibold">info@byteheart.com</Card.Text>
          <Card.Text className="fw-semibold">+880 1716 592102</Card.Text>
          <div className="d-flex gap-3">
            <Image src="/facebook.png" alt="Facebook" width={16} height={16} />
            <Image
              src="/instagram.png"
              alt="Instagram"
              width={16}
              height={16}
            />
            <Image src="/youtube.png" alt="YouTube" width={16} height={16} />
            <Image
              src="/pinterest.png"
              alt="Pinterest"
              width={16}
              height={16}
            />
            <Image src="/x.png" alt="Twitter" width={16} height={16} />
          </div>
        </Col>

        {/* CENTER */}
        <Col
          xs={12}
          lg={5}
          className="d-none d-lg-flex justify-content-between"
        >
          <div>
            <h5 className="fw-bold">COMPANY</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="#" className="black " passHref>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  Affiliates
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="fw-bold">SHOP</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="#" className="black" passHref>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  Men
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  Women
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="fw-bold">HELP</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="#" className="black" passHref>
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  My Account
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  Find a Store
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  Legal & Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="black" passHref>
                  Gift Card
                </Link>
              </li>
            </ul>
          </div>
        </Col>

        {/* RIGHT */}
        <Col xs={12} md={6} lg={3} className="mb-4 mb-lg-0">
          <h5 className="fw-bold">SUBSCRIBE</h5>
          <p>
            Be the first to get the latest news about trends, promotions, and
            much more!
          </p>
          <Form className="d-flex">
            <Form.Control
              type="text"
              placeholder="Email address"
              className="me-2"
            />
            <Button variant="dark" className="px-4">
              JOIN
            </Button>
          </Form>
          <Card.Text className="fw-semibold mt-3">Secure Payments</Card.Text>
          <div className="d-flex gap-2">
            <Image src="/discover.png" alt="Discover" width={40} height={20} />
            <Image src="/skrill.png" alt="Skrill" width={40} height={20} />
            <Image src="/paypal.png" alt="Paypal" width={40} height={20} />
            <Image
              src="/mastercard.png"
              alt="Mastercard"
              width={40}
              height={20}
            />
            <Image src="/visa.png" alt="Visa" width={40} height={20} />
          </div>
        </Col>
      </Row>

      {/* BOTTOM */}
      <Row className="mt-5 align-items-center">
        <Col xs={12} md={6} className="text-center text-md-start">
          ©2024 BHECom
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
