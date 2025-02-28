import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import StoreForm from "./StoreForm";
import StoreConfigForm from "./StoreConfigForm";
import FieldConfigForm from "./FieldConfigForm";
import {
  createAndUpdateStoreProductField,
  createStore,
  getStoreById,
  getStoreConfigById,
  getStoreProductFieldBySotreId,
  updateStore,
  updateStoreConfig,
} from "api/store/storeApi";
import "./store-form.css";

const StoreMultiStep = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeIdFromParams = searchParams.get("storeId");

  const [currentStep, setCurrentStep] = useState(2);
  const [isLoading, setIsLoading] = useState(storeIdFromParams ? true : false);
  const [storeID, setStoreID] = useState(storeIdFromParams || "");
  const [storeData, setStoreData] = useState({
    storeName: "",
    description: "",
    agencyName: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    addressType: "",
    addressLine: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    imageFile: null,
    preview: "",
    image: "", // Add this to handle existing image
  });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([
    {
      categoryID: "",
      storeCategoryID: "",
      fields: [
        {
          fields: "",
        },
      ],
    },
  ]);

  // Fetch existing store data if storeId is present
  useEffect(() => {
    const fetchStoreData = async () => {
      if (storeIdFromParams) {
        try {
          // Fetch store details
          const storeResponse = await getStoreById(storeIdFromParams);
          if (storeResponse.success) {
            const storeDetails = storeResponse.data;

            // Update store data
            setStoreData({
              storeName: storeDetails.storeName || "",
              description: storeDetails.description || "",
              agencyName: storeDetails.agencyName || "",
              contactPerson: storeDetails.contactPerson || "",
              contactEmail: storeDetails.contactEmail || "",
              contactPhone: storeDetails.contactPhone || "",
              addressLine: storeDetails.addressLine || "",
              city: storeDetails.city || "",
              state: storeDetails.state || "",
              zipCode: storeDetails.zipCode || "",
              country: storeDetails.country || "",
              imageFile: null,
              preview: storeDetails.image || "",
              image: storeDetails.image || "",
            });

            // Fetch store configuration
            const configResponse = await getStoreConfigById(storeIdFromParams);
            if (configResponse.success) {
              // Set selected brands and categories
              setSelectedBrands(
                configResponse.data.storeBrands.map((brand) => ({
                  storeID: storeIdFromParams,
                  brandID: brand?.brandID,
                  brandName: brand?.brandName,
                  storeBrandID: brand?.storeBrandID,
                }))
              );
              setSelectedCategories(
                configResponse.data.storeCategories.map((category) => ({
                  storeID: storeIdFromParams,
                  categoryID: category?.categoryID,
                  categoryName: category?.categoryName,
                  storeCategoryID: category?.storeCategoryID,
                }))
              );
            }

            // Fetch product fields
            const fieldResponse = await getStoreProductFieldBySotreId(
              storeIdFromParams
            );
            if (fieldResponse.success && fieldResponse.data.length > 0) {
              // Transform product fields to match the expected format
              const transformedCategories = fieldResponse.data.reduce(
                (acc, field) => {
                  const existingCategoryIndex = acc.findIndex(
                    (cat) => cat.storeCategoryID === field.storeCategoryID
                  );

                  if (existingCategoryIndex !== -1) {
                    acc[existingCategoryIndex].fields.push({
                      productFieldID: field.productFieldID,
                      fields: field.entityName,
                    });
                  } else {
                    acc.push({
                      categoryID: field.categoryID,
                      storeCategoryID: field.storeCategoryID,
                      fields: [
                        {
                          productFieldID: field.productFieldID,
                          fields: field.entityName,
                        },
                      ],
                    });
                  }

                  return acc;
                },
                []
              );

              setCategories(transformedCategories);
            }
          }
        } catch (error) {
          console.error("Error fetching store data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStoreData();
  }, [storeIdFromParams]);

  const updateFormData = (newData) => {
    setStoreData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // Handle submissions for each step
  const handleStoreSubmit = async (storeData) => {
    try {
      let response;

      if (storeID) {
        // Update existing store
        storeData.append("storeID", storeID);

        response = await updateStore(storeID, storeData);
        if (response.success) {
          setCurrentStep(2);
        }
      } else {
        // Create new store
        response = await createStore(storeData);
        if (response.success) {
          setStoreID(response.data.storeId);
          setCurrentStep(2);
        }
      }
    } catch (err) {
      console.error("Store submission failed:", err);
    }
  };

  const handleConfigSubmit = async (configData) => {
    try {
      if (storeID) {
        const response = await updateStoreConfig(storeID, configData);
        if (response.success) setCurrentStep(3);
      }
    } catch (err) {
      console.error("Config submission failed:", err);
    }
  };

  const handleFieldConfigSubmit = async (fieldData) => {
    try {
      const response = await createAndUpdateStoreProductField(fieldData);

      if (response.success) {
        router.push("/store/store-list");
        console.log("All forms submitted successfully!", response);
      }
    } catch (err) {
      console.error("Field config submission failed:", err);
    }
  };

  const handleCurrentStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Container className="mt-20 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StoreForm
            handleStoreSubmit={handleStoreSubmit}
            initialData={storeData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <StoreConfigForm
            handleConfigSubmit={handleConfigSubmit}
            storeId={storeID}
            handleCurrentStep={handleCurrentStep}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        );
      case 3:
        return (
          <FieldConfigForm
            onSubmit={handleFieldConfigSubmit}
            storeId={storeID}
            handleCurrentStep={handleCurrentStep}
            categories={categories}
            setCategories={setCategories}
          />
        );
      default:
        return null;
    }
  };

  return <Container>{renderCurrentStep()}</Container>;
};

export default StoreMultiStep;
