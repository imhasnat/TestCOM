import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap";
import FormProgressBar from "../Common/FormProgressBar";
import { useRouter } from "next/navigation";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import InfoComponent from "../Common/InfoComponent ";

const AdditionalFieldsForm = ({
  initialData,
  handleAdditionalFieldSubmit,
  categoryId,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [additionalData, setAdditionalData] = useState([]);

  useEffect(() => {
    const fetchAdditionalFields = async () => {
      const dummyFields = ["Field 1", "Field 2", "Field 3"];
      const newFields = dummyFields.reduce((acc, field, index) => {
        acc[`additionalField-${index}`] = "";
        return acc;
      }, {});
      setAdditionalData(dummyFields);
      setFormData((prevData) => ({ ...prevData, ...newFields }));
    };

    fetchAdditionalFields();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuillChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Transform additionalData into productDetailList
    const productDetailList = additionalData.map((fieldLabel, index) => ({
      productID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      detailName: fieldLabel,
      detailValue: formData[`additionalField-${index}`],
    }));

    // Construct the final JSON
    const formattedData = {
      description: formData.description,
      shortDescription: formData.shortDescription,
      productDetailList,
    };

    console.log("Formatted JSON:", formattedData);
    handleAdditionalFieldSubmit(formattedData);

    // Proceed with navigation or API call
    // navigate.push("/product/product-image-gallery");
  };

  const steps = [
    { number: 1, label: "Add Product" },
    { number: 2, label: "Product Detail Configuration" },
    { number: 3, label: "Product Image Gallery" },
  ];

  return (
    <Container className="my-5">
      <FormProgressBar currentStep={2} steps={steps} />

      <Row>
        <Col md={9} className="pe-0">
          <Card className="shadow p-4 rounded card mt-4">
            <Form onSubmit={handleSubmit}>
              <h4 className="mb-5 text-center fs-3">Additional Fields Form</h4>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group controlId="shortDescription">
                    <Form.Label>Short Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={12} className="mb-3">
                  <Form.Group controlId="description">
                    <Form.Label>Details</Form.Label>
                    <ReactQuill
                      value={formData.description}
                      onChange={handleQuillChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                {additionalData.map((fieldLabel, index) => (
                  <Col md={6} className="mb-3" key={index}>
                    <Form.Group controlId={`additionalField-${index}`}>
                      <Form.Label>{fieldLabel}</Form.Label>
                      <Form.Control
                        type="text"
                        name={`additionalField-${index}`}
                        value={formData[`additionalField-${index}`]}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                ))}
              </Row>
              <div className="text-end">
                <Button variant="primary" type="submit" className="mt-3">
                  Next
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
        <Col md={3} className="ps-md-0 pt-md-16">
          <InfoComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default AdditionalFieldsForm;
