"use client";
import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import FormProgressBar from "../Common/FormProgressBar";
import InfoComponent from "../Common/InfoComponent ";
import ImageUploader from "../Common/ImageUploader";

const StoreForm = ({ handleStoreSubmit, initialData, updateFormData }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({
    agencyName: "",
    contactPhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
    updateFormData(newFormData);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (imageData) => {
    const newFormData = {
      ...formData,
      imageFile: imageData?.file || null,
      preview: imageData?.preview || "",
      // If a new image is uploaded, set the existing image URL to null
      image: imageData?.file ? null : formData.image,
    };
    setFormData(newFormData);
    updateFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    let validationErrors = {};

    if (!formData.agencyName) {
      validationErrors.agencyName = "Agency Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.agencyName)) {
      validationErrors.agencyName = "Agency Name can only contain letters";
    }

    if (!formData.contactPhone) {
      validationErrors.contactPhone = "Contact Phone is required";
    } else if (!/^\d+$/.test(formData.contactPhone)) {
      validationErrors.contactPhone = "Contact Phone can only contain numbers";
    }

    // Image validation for create operation
    if (!initialData.image && !formData.imageFile) {
      validationErrors.image = "Image is required for new stores";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Transform formData to FormData
    const formDataToSubmit = new FormData();

    // Handle image fields based on create/update scenario
    if (formData.imageFile) {
      // New image uploaded - include the file and set image to null
      formDataToSubmit.append("imageFile", formData.imageFile);
      formDataToSubmit.append("image", "");
    } else if (formData.image) {
      // No new image - keep existing image URL
      formDataToSubmit.append("imageFile", "");
      formDataToSubmit.append("image", formData.image);
    }

    // Append all other form fields
    for (const key in formData) {
      if (key !== "imageFile" && key !== "image" && key !== "preview") {
        formDataToSubmit.append(key, formData[key] || "");
      }
    }

    handleStoreSubmit(formDataToSubmit);
  };

  return (
    <Container className="my-5">
      <FormProgressBar currentStep={1} />
      <Row>
        <Col md={9} className="pe-0">
          <Card className="p-4 shadow-lg">
            <h2 className="text-center mb-4">Store Form</h2>
            <Form onSubmit={handleSubmit}>
              {/* Section 1: Store Information */}
              <Card className="mb-4 p-3 border-0 shadow-lg">
                <h4>Store Information</h4>
                <Col md={6}>
                  <Form.Group controlId="storeName" className="mb-3">
                    <Form.Label>Store Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter store name"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter store description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Row>
                  <Form.Group controlId="imageUpload" className="mb-3">
                    <Form.Label>
                      Store Image{" "}
                      {!initialData.image && (
                        <span className="text-danger">*</span>
                      )}
                    </Form.Label>
                    <ImageUploader
                      multiple={false}
                      onChange={handleImageChange}
                      value={
                        formData.image || formData.preview
                          ? [
                              {
                                preview: formData.preview || formData.image,
                                path: formData.image,
                              },
                            ]
                          : []
                      }
                    />
                    {errors.image && (
                      <div className="text-danger mt-1">{errors.image}</div>
                    )}
                  </Form.Group>
                </Row>
              </Card>

              {/* Section 2: Agent Information */}
              <Card className="mb-4 p-3 border-0 shadow-lg">
                <h4>Agent Information</h4>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="agencyName" className="mb-3">
                      <Form.Label>Agency Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter agency name"
                        name="agencyName"
                        value={formData.agencyName}
                        onChange={handleChange}
                        isInvalid={!!errors.agencyName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.agencyName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="contactPerson" className="mb-3">
                      <Form.Label>Contact Person</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter contact person"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="contactEmail" className="mb-3">
                      <Form.Label>Contact Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter contact email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="contactPhone" className="mb-3">
                      <Form.Label>Contact Phone</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter contact phone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        isInvalid={!!errors.contactPhone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contactPhone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>

              {/* Section 3: Address Information */}
              <Card className="mb-4 p-3 border-0 shadow-lg">
                <h4>Address Information</h4>
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="addressLine" className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter address"
                        name="addressLine"
                        value={formData.addressLine}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="city" className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="state" className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="zipCode" className="mb-3">
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter zip code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="country" className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      >
                        <option value="">Select Country</option>
                        <option value="USA">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="Australia">Australia</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <div className="text-end">
                <Button
                  variant="primary"
                  type="submit"
                  className="btn btn-primary"
                >
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

export default StoreForm;
