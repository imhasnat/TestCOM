"use client";

import React, { useState } from "react";
import { Modal, Button, Form, Tab, Nav, Alert } from "react-bootstrap";
import styles from "./AuthModal.module.css";
import { useAuth } from "contexts/AuthContext";

const AuthModal = ({ show, handleClose }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
    roleName: "User",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (activeTab === "login") {
        await login({
          userName: formData.userName,
          password: formData.password,
        });

        setFormData({
          userName: "",
          password: "",
          confirmPassword: "",
          roleName: "User",
        });
        handleClose();
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        await register(formData);
        setRegistrationSuccess(true);
        setActiveTab("login");
        setFormData({
          userName: formData.userName,
          password: "",
          confirmPassword: "",
          roleName: "User",
        });
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className={styles.authModal}
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Nav
          variant="tabs"
          activeKey={activeTab}
          onSelect={(k) => {
            setActiveTab(k);
            setError("");
            setRegistrationSuccess(false);
          }}
          className={`${styles.authTabs} w-100 justify-content-center`}
        >
          <Nav.Item>
            <Nav.Link eventKey="login" className={styles.authTab}>
              Login
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="register" className={styles.authTab}>
              Register
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="userName">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className={styles.inputField}
              placeholder="Email or Mobile Number"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.inputField}
              required
            />
          </Form.Group>
          {activeTab === "register" && (
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles.inputField}
                required
              />
            </Form.Group>
          )}
          <Button
            type="submit"
            className={`${styles.submitButton} w-100`}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : activeTab === "login"
              ? "Log In"
              : "Sign Up"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
