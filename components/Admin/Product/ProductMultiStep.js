import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useSearchParams } from "next/navigation";
import ImageUploadGallery from "../Common/ImageUploadGallery";

import AdditionalFieldsForm from "./AdditionalFieldsForm";
import {
  createAndUpdateProductDetails,
  createProduct,
  createProductGallery,
  getProductsById,
  getAllProductDetailByProductId,
  getProductGallery,
  updateProduct,
} from "api/product/productApi";
import { useRouter } from "next/navigation";
import ProductForm from "./ProductForm ";

const ProductMultiStep = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const isEditMode = Boolean(productId);

  const [currentStep, setCurrentStep] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({
    preview: null,
    storeID: null,
    categoryID: "",
    subCategory: "",
    brandID: "",
    productName: "",
    price: "",
    stock: "",
    imageFile: null,
  });
  const [productErrors, setProductErrors] = useState({});
  const [additionalFormData, setAdditionalFormData] = useState({
    shortDescription: "",
    description: "",
    productDetailList: [],
  });
  const [galleryImages, setGalleryImages] = useState([]);
  const [formEdited, setFormEdited] = useState(false);

  // Fetch existing product data if in edit mode
  useEffect(() => {
    const fetchProductData = async () => {
      if (!isEditMode) return;

      setIsLoading(true);
      try {
        // Fetch basic product details
        const productResponse = await getProductsById(productId);
        if (productResponse.success) {
          setProductData({
            ...productData,
            storeID: productResponse.data.storeID,
            categoryID: productResponse.data.categoryID,
            subCategory: productResponse.data.subCategory,
            brandID: productResponse.data.brandID,
            productName: productResponse.data.productName,
            price: productResponse.data.price.toString(),
            stock: productResponse.data.stock.toString(),
            preview: productResponse.data.image,
            productId: productId,
          });
        }

        // Fetch additional details
        const detailsResponse = await getAllProductDetailByProductId(productId);
        if (detailsResponse.success) {
          setAdditionalFormData({
            shortDescription: detailsResponse.data.shortDescription || "",
            description: detailsResponse.data.description || "",
            productDetailList: detailsResponse.data.productDetailList || [],
          });
        }

        // Fetch gallery images
        const galleryResponse = await getProductGallery(productId);
        if (galleryResponse.success) {
          setGalleryImages(
            galleryResponse.images.map((image) => ({
              preview: image.imagePath,
              file: null,
              existingImage: true,
              imageId: image.imageId,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProductErrors({
          fetch: "Failed to load product data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId, isEditMode]);

  const updateFormData = (newData) => {
    setProductData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const updateAdditionalFormData = (newData) => {
    setFormEdited(true);
    setAdditionalFormData((prev) => ({
      ...prev,
      ...newData,
      // Preserve productDetailList structure
      productDetailList: Array.isArray(newData.productDetailList)
        ? newData.productDetailList
        : prev.productDetailList,
    }));
  };

  const handleCurrentStep = () => {
    if (currentStep > 1) {
      // If form was edited, fetch latest data when going back to step 2
      if (currentStep === 3 && formEdited && isEditMode) {
        const fetchLatestDetails = async () => {
          try {
            const detailsResponse = await getAllProductDetailByProductId(
              productId
            );
            if (detailsResponse.success) {
              setAdditionalFormData({
                shortDescription: detailsResponse.data.shortDescription || "",
                description: detailsResponse.data.description || "",
                productDetailList: detailsResponse.data.productDetailList || [],
              });
            }
          } catch (error) {
            console.error("Error fetching latest details:", error);
          }
        };
        fetchLatestDetails();
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProductSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (productData.imageFile) {
        formData.set("imageFile", productData.imageFile);
      }

      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      console.log(formDataObject, isEditMode);

      const response = isEditMode
        ? await updateProduct(productId, formData)
        : await createProduct(formData);

      if (response.success) {
        const responseId = isEditMode ? productId : response.id;
        setProductData((prev) => ({
          ...prev,
          productId: responseId,
        }));
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setProductErrors({
        submit: error?.message || "Failed to submit form. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdditionalFieldSubmit = async (additionalData) => {
    setIsLoading(true);
    try {
      const formattedData = {
        productId: productData.productId,
        description: additionalData.description,
        shortDescription: additionalData.shortDescription,
        productDetailList: additionalData.productDetailList,
      };

      setAdditionalFormData(formattedData); // Update state before API call

      const response = isEditMode
        ? await createAndUpdateProductDetails(formattedData)
        : await createAndUpdateProductDetails(formattedData);

      if (response.success) {
        setFormEdited(false);
        setCurrentStep(3);
      }
    } catch (error) {
      console.error("Error submitting additional fields:", error);
      setProductErrors({
        submit:
          error.response?.message || "Failed to submit additional details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGallerySubmit = async (imageFiles) => {
    setIsLoading(true);
    try {
      const response = isEditMode
        ? await createProductGallery(productData.productId, imageFiles)
        : await createProductGallery(productData.productId, imageFiles);

      if (response.success) {
        router.push("/product/product-list");
      }
    } catch (error) {
      console.error("Error submitting gallery:", error);
      setProductErrors({
        submit: error.response?.message || "Failed to submit gallery images.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-20 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductForm
            handleProductSubmit={handleProductSubmit}
            initialData={productData}
            updateFormData={updateFormData}
            productErrors={productErrors}
            isEditMode={isEditMode}
          />
        );
      case 2:
        return (
          <AdditionalFieldsForm
            initialData={additionalFormData}
            handleAdditionalFieldSubmit={handleAdditionalFieldSubmit}
            categoryId={productData.categoryID}
            handleCurrentStep={handleCurrentStep}
            updateFormData={updateAdditionalFormData}
            productId={productData.productId}
            isEditMode={isEditMode}
          />
        );
      case 3:
        return (
          <ImageUploadGallery
            handleCurrentStep={handleCurrentStep}
            handleImageGallerySubmit={handleImageGallerySubmit}
            initialImages={galleryImages}
            isEditMode={isEditMode}
          />
        );
      default:
        return null;
    }
  };

  return <Container>{renderCurrentStep()}</Container>;
};

export default ProductMultiStep;
