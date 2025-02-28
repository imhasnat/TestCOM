import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const FormProgressBar = ({ currentStep = 1, steps }) => {
  const defaultSteps = [
    { number: 1, label: "Store Information" },
    { number: 2, label: "Store Configuration" },
    { number: 3, label: "Product Field Configuration" },
  ];

  const formSteps = steps || defaultSteps;

  return (
    <Container className="my-4 ">
      <Row className="align-items-start position-relative">
        {formSteps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Column */}
            <Col className="text-center d-flex flex-column align-items-center">
              {/* Circle with Number */}
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor:
                    currentStep >= step.number ? "#624bff" : "#f0f0f0",
                  color: currentStep >= step.number ? "white" : "#666",
                  border: "2px solid",
                  borderColor: currentStep >= step.number ? "#624bff" : "#ddd",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                  zIndex: 1,
                }}
              >
                {step.number}
              </div>

              {/* Label */}
              <span
                className="text-center"
                style={{
                  color: currentStep >= step.number ? "#624bff" : "#666",
                  fontWeight: currentStep >= step.number ? "bold" : "normal",
                  fontSize: "0.9rem",
                  maxWidth: "120px",
                  transition: "all 0.3s ease",
                }}
              >
                {step.label}
              </span>

              {/* Connecting Line */}
              {index < formSteps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "15%",
                    right: "15%",
                    height: "3px",
                    backgroundColor:
                      currentStep > step.number ? "#624bff" : "#ddd",
                    transition: "all 0.3s ease",
                  }}
                />
              )}
            </Col>
          </React.Fragment>
        ))}
      </Row>
    </Container>
  );
};

export default FormProgressBar;
