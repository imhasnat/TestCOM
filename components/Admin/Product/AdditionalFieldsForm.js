import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap";
import FormProgressBar from "../Common/FormProgressBar";
import "react-quill/dist/quill.snow.css";
import { getProductFieldsByCategoryId } from "api/product/productApi";
import InfoComponent from "../Common/InfoComponent ";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AdditionalFieldsForm = ({
  initialData,
  handleAdditionalFieldSubmit,
  categoryId,
  handleCurrentStep,
  updateFormData,
  productId,
  isEditMode,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [additionalData, setAdditionalData] = useState([]);
  const [isFieldsLoading, setIsFieldsLoading] = useState(false);

  // Update useEffect to properly handle initialData changes
  useEffect(() => {
    if (initialData.productDetailList?.length > 0) {
      const updatedFormData = {
        ...formData,
        description: initialData.description || "",
        shortDescription: initialData.shortDescription || "",
      };

      // Map product detail list values to form data
      initialData.productDetailList.forEach((detail) => {
        updatedFormData[detail.detailName] = detail.detailValue;
      });

      setFormData(updatedFormData);
    }
  }, [initialData]);

  // Separate useEffect for loading dynamic fields - only runs when categoryId changes
  useEffect(() => {
    const fetchAdditionalFields = async () => {
      if (!categoryId) {
        setAdditionalData([]);
        return;
      }

      setIsFieldsLoading(true);
      try {
        const response = await getProductFieldsByCategoryId(categoryId);
        const fields = response.data;

        if (fields && fields.length > 0) {
          setAdditionalData(fields);

          // If in edit mode, map the existing values to the fields
          if (isEditMode && initialData.productDetailList) {
            const existingValues = {};
            initialData.productDetailList.forEach((detail) => {
              existingValues[detail.detailName] = detail.detailValue;
            });

            // Create new form data with existing values
            const newFields = fields.reduce((acc, field) => {
              acc[field.entityName] = existingValues[field.entityName] || "";
              return acc;
            }, {});

            // Merge with current form data while preserving other fields
            setFormData((prevData) => ({
              ...prevData,
              ...newFields,
            }));
          } else {
            // In create mode, just initialize empty fields
            const newFields = fields.reduce((acc, field) => {
              acc[field.entityName] = "";
              return acc;
            }, {});

            setFormData((prevData) => ({
              ...prevData,
              ...newFields,
            }));
          }
        }
      } catch (err) {
        console.error("Error loading additional fields:", err);
        setAdditionalData([]);
      } finally {
        setIsFieldsLoading(false);
      }
    };

    fetchAdditionalFields();
  }, [categoryId, isEditMode]); // Remove initialData from dependencies

  // Separate useEffect for initializing form data
  useEffect(() => {
    setFormData({
      description: initialData.description || "",
      shortDescription: initialData.shortDescription || "",
      ...formData,
    });
  }, [initialData.description, initialData.shortDescription]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);

    // Create updated productDetailList for dynamic fields
    const updatedDetailList = additionalData.map((field) => ({
      productID: productId,
      detailName: field.entityName,
      detailValue:
        field.entityName === name ? value : formData[field.entityName] || "",
    }));

    // Update parent component with all necessary data
    updateFormData({
      ...newFormData,
      productDetailList: updatedDetailList,
    });
  };

  // Handle rich text editor changes
  const handleQuillChange = (value) => {
    const newFormData = {
      ...formData,
      description: value,
    };
    setFormData(newFormData);
    updateFormData(newFormData);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const productDetailList = additionalData.map((field) => ({
      productID: productId,
      detailName: field.entityName,
      detailValue: formData[field.entityName] || "",
    }));

    const formattedData = {
      description: formData.description || "",
      shortDescription: formData.shortDescription || "",
      productDetailList,
    };

    handleAdditionalFieldSubmit(formattedData);
  };

  const steps = [
    { number: 1, label: "Add Product" },
    { number: 2, label: "Product Detail Configuration" },
    { number: 3, label: "Product Image Gallery" },
  ];

  if (isFieldsLoading) {
    return (
      <Container className="my-5">
        <FormProgressBar currentStep={2} steps={steps} />
        <div className="text-center mt-4">Loading additional fields...</div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <FormProgressBar currentStep={2} steps={steps} />
      <Row>
        <Col md={9} className="pe-0">
          <Card className="shadow p-4 rounded card mt-4">
            <Form onSubmit={handleSubmit}>
              <h4 className="mb-5 text-center fs-3">
                {isEditMode ? "Edit Product Details" : "Additional Fields Form"}
              </h4>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group controlId="shortDescription">
                    <Form.Label>Short Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="shortDescription"
                      value={formData.shortDescription || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={12} className="mb-3">
                  <Form.Group controlId="description">
                    <Form.Label>Details</Form.Label>
                    <ReactQuill
                      value={formData.description || ""}
                      onChange={handleQuillChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {additionalData.length > 0 && (
                <Row>
                  {additionalData.map((field) => (
                    <Col md={6} className="mb-3" key={field.productFieldID}>
                      <Form.Group controlId={field.entityName}>
                        <Form.Label>{field.entityName}</Form.Label>
                        <Form.Control
                          type="text"
                          name={field.entityName}
                          value={formData[field.entityName] || ""}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
              )}

              <div className="d-flex justify-content-between">
                <Button
                  variant="primary"
                  type="button"
                  className="mt-4"
                  onClick={handleCurrentStep}
                >
                  Back
                </Button>
                <Button variant="primary" type="submit" className="mt-4">
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
