"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Row, Col } from "react-bootstrap";
import Image from "next/image";

const ImageUploader = ({
  multiple = false,
  onChange,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  value = [],
  showPreview = true,
  className = "",
  dropzoneText = "Drag and drop images here, or click to select",
}) => {
  const [images, setImages] = useState(
    Array.isArray(value) ? value : value ? [value] : []
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (imageFile) => {
    try {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });

      // For single file upload, include the old image path for cleanup
      const oldImagePath =
        !multiple && images.length > 0 ? images[0].path : null;

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
          oldImagePath,
        }),
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.imagePath;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (isUploading) return;
      setIsUploading(true);

      try {
        // For single file upload, clear existing images
        if (!multiple) {
          // Clear existing preview URLs
          images.forEach((image) => {
            if (image.preview) {
              URL.revokeObjectURL(image.preview);
            }
          });
          setImages([]);
        }

        // Handle max files limit
        let filesToProcess = acceptedFiles;
        if (!multiple) {
          filesToProcess = [acceptedFiles[0]];
        } else if (images.length + acceptedFiles.length > maxFiles) {
          filesToProcess = acceptedFiles.slice(0, maxFiles - images.length);
        }

        // Check for duplicates based on file content (using hash or similar method)
        const isDuplicate = (file) => {
          return images.some(
            (img) =>
              img.file &&
              img.file.name === file.name &&
              img.file.size === file.size &&
              img.file.lastModified === file.lastModified
          );
        };

        const newImages = await Promise.all(
          filesToProcess.map(async (file) => {
            // Skip if duplicate in multiple mode
            if (multiple && isDuplicate(file)) {
              return null;
            }

            const imagePath = await handleImageUpload(file);
            return {
              file,
              preview: URL.createObjectURL(file),
              path: imagePath,
            };
          })
        );

        const filteredImages = newImages.filter((img) => img !== null);
        const updatedImages = multiple
          ? [...images, ...filteredImages]
          : filteredImages;

        setImages(updatedImages);
        onChange?.(multiple ? updatedImages : updatedImages[0]);
      } catch (error) {
        console.error("Error processing images:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [images, multiple, maxFiles, onChange, isUploading]
  );

  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];

    // Revoke object URL to prevent memory leaks
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    try {
      // Call API to remove the image from server
      await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imagePath: imageToRemove.path,
        }),
      });

      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      onChange?.(multiple ? updatedImages : updatedImages[0]);
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  useEffect(() => {
    // Cleanup preview URLs when component unmounts
    return () => {
      images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple,
    maxSize,
    disabled: isUploading,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border p-4 mb-3 text-center ${
          isDragActive ? "bg-light" : ""
        }`}
        style={{
          border: "2px dashed #ced4da",
          cursor: isUploading ? "not-allowed" : "pointer",
          borderRadius: "5px",
          backgroundColor: "#f8f9fa",
          opacity: isUploading ? 0.7 : 1,
        }}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p>Uploading...</p>
        ) : (
          <>
            <p>{dropzoneText}</p>
            <small className="text-muted">
              {multiple
                ? `You can upload up to ${maxFiles} images`
                : "You can upload 1 image"}
            </small>
          </>
        )}
      </div>

      {showPreview && images.length > 0 && (
        <Row>
          {images.map((image, index) => (
            <Col key={index} xs={6} md={4} className="mb-3">
              <div className="position-relative">
                <Image
                  src={image.preview}
                  alt="Preview"
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
      )}
    </div>
  );
};

export default ImageUploader;
