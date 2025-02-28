"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import ImageUploader from "../Common/ImageUploader";
import { createCategory, getAllCategories } from "api/categories/categoriesApi";
import { toast } from "node_modules/react-toastify/dist";

const AddCategoryForm = () => {
  const navigate = useRouter();
  const [formData, setFormData] = useState({
    categoryName: "",
    parentCategoryID: "", // Initialize with empty string
    description: "",
    imageFile: null,
    preview: "",
    createdBy: "d2c848b8-2eed-4ec3-ae2b-81931bd7d35f",
  });
  const [parentCategoryOptions, setParentCategoryOptions] = useState([]);
  const [errors, setErrors] = useState({
    categoryName: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.success) {
          const categories = response.data;
          // Create options array with None as first option
          const options = [
            { value: "", label: "None" }, // Explicitly add None option
            ...categories.map((category) => ({
              value: category.categoryID,
              label: category.categoryName,
            })),
          ];
          setParentCategoryOptions(options);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "categoryName") {
      setErrors((prev) => ({
        ...prev,
        categoryName: "",
      }));
    }
  };

  const handleImageChange = (imageData) => {
    setFormData((prev) => ({
      ...prev,
      imageFile: imageData?.file || null,
      preview: imageData?.preview || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.categoryName) {
      newErrors.categoryName = "Category name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("categoryName", formData.categoryName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("createdBy", formData.createdBy);

      // Only append parentCategoryID if it's not empty (not "None")
      if (formData.parentCategoryID) {
        formDataToSend.append("parentCategoryID", formData.parentCategoryID);
      }

      // Add image if exists
      if (formData.imageFile) {
        formDataToSend.append("imageFile", formData.imageFile);
      }

      const response = await createCategory(formDataToSend);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setFormData({
        categoryName: "",
        parentCategoryID: "",
        description: "",
        imageFile: null,
        preview: "",
        createdBy: "d2c848b8-2eed-4ec3-ae2b-81931bd7d35f",
      });

      toast.success("Category created successfully");
    } catch (error) {
      toast.error(error.message);
      console.error("Error creating category:", error);
    }
  };

  return (
    <Card className="mt-5 mb-4 p-3 border-0 shadow-lg">
      <h4>Add Category</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="categoryName" className="my-3">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category name"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            isInvalid={!!errors.categoryName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.categoryName}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="parentCategoryID" className="mb-3">
          <Form.Label>Parent Category</Form.Label>
          <Form.Select
            name="parentCategoryID"
            value={formData.parentCategoryID}
            onChange={handleChange}
          >
            {/* Explicitly render None option */}
            <option value="">None</option>
            {/* Then render the rest of the options */}
            {parentCategoryOptions
              .filter((option) => option.value !== "") // Filter out the None option from the array
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter category description"
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
              formData.preview
                ? [
                    {
                      preview: formData.preview,
                      path: formData.preview,
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

export default AddCategoryForm;
