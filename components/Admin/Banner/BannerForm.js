"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import ImageUploader from "../Common/ImageUploader";
import { createBanner } from "api/banner/bannerApi";
import { toast } from "node_modules/react-toastify/dist";

const BannerForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    buttonText: "",
    buttonLink: "",
    imageFile: null,
    preview: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    buttonText: "",
    buttonLink: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
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

    if (!formData.title) {
      newErrors.title = "Title is required";
    }
    if (!formData.buttonText) {
      newErrors.buttonText = "Button text is required";
    }
    if (!formData.buttonLink) {
      newErrors.buttonLink = "Button link is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("subTitle", formData.subTitle);
      formDataToSend.append("buttonText", formData.buttonText);
      formDataToSend.append("buttonLink", formData.buttonLink);

      if (formData.imageFile) {
        formDataToSend.append("imageFile", formData.imageFile);
      }

      const response = await createBanner(formDataToSend);

      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setFormData({
        title: "",
        subTitle: "",
        buttonText: "",
        buttonLink: "",
        imageFile: null,
        preview: "",
      });
      toast.success("Banner created successfully");
      // Navigate to the next page on success
      // router.push("/banners");
    } catch (error) {
      toast.error(error.message);
      console.error("Error creating banner:", error);
    }
  };

  return (
    <Card className="mt-5 mb-4 p-3 border-0 shadow-lg">
      <h4>Add Banner</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter banner title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="subTitle" className="mb-3">
          <Form.Label>Subtitle</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter banner subtitle"
            name="subTitle"
            value={formData.subTitle}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="buttonText" className="mb-3">
          <Form.Label>Button Text</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter button text"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            isInvalid={!!errors.buttonText}
          />
          <Form.Control.Feedback type="invalid">
            {errors.buttonText}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="buttonLink" className="mb-3">
          <Form.Label>Button Link</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter button link"
            name="buttonLink"
            value={formData.buttonLink}
            onChange={handleChange}
            isInvalid={!!errors.buttonLink}
          />
          <Form.Control.Feedback type="invalid">
            {errors.buttonLink}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="imageUpload" className="mb-3">
          <Form.Label>Banner Image</Form.Label>
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

export default BannerForm;
