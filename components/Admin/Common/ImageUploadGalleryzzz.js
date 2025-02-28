import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import Image from "next/image";
import FormProgressBar from "./FormProgressBar";
import InfoComponent from "./InfoComponent ";

const ImageUploadGallery = ({
  handleCurrentStep,
  handleImageGallerySubmit,
}) => {
  const [images, setImages] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newImages = acceptedFiles.reduce((uniqueImages, file) => {
        const isDuplicate = images.some(
          (img) => img.file.name === file.name && img.file.size === file.size
        );
        if (!isDuplicate) {
          uniqueImages.push({
            file,
            preview: URL.createObjectURL(file),
          });
        }
        return uniqueImages;
      }, []);
      setImages((prevImages) => [...prevImages, ...newImages]);
    },
    [images]
  );

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(images[index].preview);
    setImages((prevImages) =>
      prevImages
        .filter((_, i) => i !== index)
        .map((image) => ({
          ...image,
          preview: URL.createObjectURL(image.file),
        }))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("imageFiles", image.file);
    });

    images.forEach((image) => {
      console.log(
        `File: ${image.file.name}, Size: ${image.file.size} bytes, Type: ${image.file.type}`
      );
    });
    handleImageGallerySubmit(formData);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const steps = [
    { number: 1, label: "Add Product" },
    { number: 2, label: "Product Detail Configuration" },
    { number: 3, label: "Product Image Gallery" },
  ];

  return (
    <Container className="my-5">
      <FormProgressBar currentStep={3} steps={steps} />

      <Row className="gap-0 align-items-start">
        <Col md={9} className="pe-0">
          <Card className="p-4 shadow-sm">
            <h4 className="mb-4">Product Image Gallery</h4>
            <div
              {...getRootProps()}
              className="border p-4 mb-3 text-center"
              style={{
                border: "2px dashed #ced4da",
                cursor: "pointer",
                borderRadius: "5px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <input {...getInputProps()} />
              <p>Drag and drop images here, or click to select images</p>
            </div>

            <Row>
              {images.map((image, index) => (
                <Col key={index} xs={6} md={4} className="mb-3">
                  <div className="position-relative">
                    <Image
                      width={100}
                      height={100}
                      src={image.preview}
                      alt="Preview"
                      className="img-fluid rounded"
                      style={{
                        height: "150px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute"
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        borderRadius: "50%",
                        padding: "1px 5px",
                        top: "-10px",
                        right: "-10px",
                      }}
                    >
                      &times;
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
            <div className="d-flex justify-content-between">
              <Button
                variant="primary"
                type="button"
                className="mt-4"
                onClick={handleCurrentStep}
              >
                Back
              </Button>
              {images.length > 0 && (
                <div className="text-end mt-3">
                  <Button variant="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col md={3} className="ps-md-0 pt-md-6">
          <InfoComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default ImageUploadGallery;
