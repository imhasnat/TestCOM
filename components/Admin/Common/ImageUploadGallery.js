import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, Button, Row, Col, Container, Modal } from "react-bootstrap";
import Image from "next/image";
import FormProgressBar from "./FormProgressBar";
import InfoComponent from "./InfoComponent ";
import { deleteSingleImage } from "api/product/productApi";

const ImageUploadGallery = ({
  handleCurrentStep,
  handleImageGallerySubmit,
  initialImages = [],
  isEditMode,
}) => {
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isEditMode && initialImages.length > 0) {
      setExistingImages(initialImages);
    }
  }, [isEditMode, initialImages]);

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
            isNew: true,
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
      // Cleanup previews
      images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  const handleShowDeleteModal = (image) => {
    setImageToDelete(image);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setImageToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete || !imageToDelete.imageId) {
      handleCloseDeleteModal();
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteSingleImage(imageToDelete.imageId);
      if (response.success) {
        setExistingImages((prevImages) =>
          prevImages.filter((img) => img.imageId !== imageToDelete.imageId)
        );
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      // You might want to show an error toast/alert here
    } finally {
      setIsDeleting(false);
      handleCloseDeleteModal();
    }
  };

  const handleRemoveNewImage = (index) => {
    const imageToRemove = images[index];
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("imageFiles", image.file);
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

            {/* Existing Images Section */}
            {isEditMode && existingImages.length > 0 && (
              <div className="mb-4">
                <h5 className="mb-3">Current Images</h5>
                <Row>
                  {existingImages.map((image, index) => (
                    <Col key={image.imageId} xs={6} md={4} className="mb-3">
                      <div className="position-relative">
                        <Image
                          src={image.preview}
                          alt={`Product image ${index + 1}`}
                          width={100}
                          height={100}
                          className="img-fluid rounded"
                          style={{
                            height: "150px",
                            width: "100%",
                            objectFit: "contain",
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute"
                          onClick={() => handleShowDeleteModal(image)}
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
              </div>
            )}

            {/* Upload New Images Section */}
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
              <p>Drag and drop new images here, or click to select images</p>
            </div>

            {/* New Images Preview */}
            {images.length > 0 && (
              <div className="mt-4">
                <h5 className="mb-3">New Images to Upload</h5>
                <Row>
                  {images.map((image, index) => (
                    <Col key={index} xs={6} md={4} className="mb-3">
                      <div className="position-relative">
                        <Image
                          src={image.preview}
                          alt={`New image ${index + 1}`}
                          width={100}
                          height={100}
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
                          onClick={() => handleRemoveNewImage(index)}
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
              </div>
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
              {(images.length > 0 ||
                (!isEditMode && existingImages.length > 0)) && (
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              )}
            </div>
          </Card>
        </Col>
        <Col md={3} className="ps-md-0 pt-md-6">
          <InfoComponent />
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this image? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteImage}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ImageUploadGallery;
