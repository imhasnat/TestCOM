"use client";

import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import ImageUploader from "../Common/ImageUploader";
import { toast } from "node_modules/react-toastify/dist";
import { createBrand } from "api/brand/brandApi";

const AddBrandForm = () => {
  const [formData, setFormData] = useState({
    brandName: "",
    description: "",
    image: "",
    createdBy: "d2c848b8-2eed-4ec3-ae2b-81931bd7d35f",
  });

  const [errors, setErrors] = useState({
    brandName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when the user starts typing
    if (name === "brandName") {
      setErrors({
        ...errors,
        brandName: "",
      });
    }
  };

  const handleImageChange = (imageData) => {
    const newFormData = {
      ...formData,
      imageFile: imageData?.file || null,
      preview: imageData?.preview || "",
    };
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset errors
    setErrors({
      brandName: "",
    });

    // Validation: Check if brandName is empty
    if (formData.brandName.trim() === "") {
      setErrors({
        brandName: "Brand Name is required",
      });
      return;
    }

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("brandName", formData.brandName);
      formDataPayload.append("description", formData.description);
      formDataPayload.append(
        "createdBy",
        "d2c848b8-2eed-4ec3-ae2b-81931bd7d35f"
      );

      if (formData.imageFile) {
        formDataPayload.append("imageFile", formData.imageFile);
      }
      const response = await createBrand(formDataPayload);

      if (!response.success) {
        throw new Error("Failed to create brand");
      }

      setFormData({
        brandName: "",
        description: "",
        imageFile: null,
      });
      toast.success("Brand created successfully!");
      console.log("Brand created successfully", response);
    } catch (error) {
      console.error("Error creating brand:", error);
      toast.error("Error creating brand: " + error.message);
    }
  };

  return (
    <Card className="mt-5 mb-4 p-3 border-0 shadow-lg">
      <h4>Add Brand</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="brandName" className="my-3">
          <Form.Label>Brand Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter brand name"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            isInvalid={!!errors.brandName} // Add visual error indication
          />
          <Form.Control.Feedback type="invalid">
            {errors.brandName} {/* Show error message */}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter brand description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="imageUpload" className="mb-3">
          <ImageUploader
            multiple={false}
            onChange={handleImageChange}
            value={
              formData.image
                ? [
                    {
                      preview: formData.preview,
                      path: formData.image,
                    },
                  ]
                : []
            }
          />
        </Form.Group>

        <div className="text-end">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AddBrandForm;
