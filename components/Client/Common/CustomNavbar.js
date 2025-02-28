"use client";
import React, { useState } from "react";
import { Navbar, Nav, Container, Row, Col, Dropdown } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import Menu from "./Menu";
import NavIcons from "./NavIcons";
import AuthModal from "./AuthModal";
import "../../../styles/navbar.css";
import CategoriesDropdown from "./CategoriesDropdown";
import { useAuth } from "contexts/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { useCart } from "contexts/CartContext";
import BrandDropdown from "./BrandDropdown";

export default function CustomNavbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();
  const { setCartItems } = useCart();

  const handleAuthModalShow = () => setShowAuthModal(true);
  const handleAuthModalClose = () => setShowAuthModal(false);

  const handleLogout = () => {
    logout();
    setCartItems([]);
  };

  const UserMenu = () => (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="user-dropdown">
        <span className="me-2">
          <FaUserCircle />
        </span>
        {user.userName}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} href="/profile">
          Profile
        </Dropdown.Item>
        <Dropdown.Item as={Link} href="/order-list">
          My Orders
        </Dropdown.Item>
        {user.roleName === "Admin" && (
          <Dropdown.Item as={Link} href="/Dashboard">
            Admin Dashboard
          </Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <>
      <Navbar
        bg="light"
        expand="md"
        className="py-3 px-3 justify-content-between"
      >
        <Container className="d-flex justify-content-between w-100">
          {/* MOBILE VIEW */}
          <Navbar.Brand as={Link} href="/" className="d-lg-none">
            <div className="fs-2 tracking-wide">BHECom</div>
          </Navbar.Brand>

          {/* Mobile View */}
          <Nav className="  d-lg-none">
            <div className="d-flex align-items-center ">
              <SearchBar />
              <Menu />
            </div>
          </Nav>

          {/* Desktop View */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`d-none d-lg-block gap-3 nav-hide`}
          >
            <Row className="w-100 align-items-center">
              <Col md={6} className="d-flex align-items-center gap-1">
                <Link href="/">
                  <Navbar.Brand className="d-none d-lg-flex align-items-center gap-2">
                    <Image src="/logo.png" alt="Logo" width={24} height={24} />
                    <div className="fs-2 tracking-wide">BHECom</div>
                  </Navbar.Brand>
                </Link>
                <Nav className="d-none d-lg-flex gap-3">
                  <CategoriesDropdown />
                  <BrandDropdown />
                  <Nav.Link as={Link} href="/products">
                    Products
                  </Nav.Link>
                  {user ? (
                    <UserMenu />
                  ) : (
                    <Nav.Link onClick={handleAuthModalShow}>Login</Nav.Link>
                  )}
                </Nav>
              </Col>

              <Col
                md={6}
                className="d-none d-lg-flex align-items-center justify-end gap-1 pe-0"
              >
                <SearchBar />
                <NavIcons showAuthModal={handleAuthModalShow} />
              </Col>
            </Row>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Auth Modal */}
      <AuthModal show={showAuthModal} handleClose={handleAuthModalClose} />
    </>
  );
}
