import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import Select from "react-select";
import FormProgressBar from "../Common/FormProgressBar";
import ImageUploader from "../Common/ImageUploader";
import { getAllStore } from "api/store/storeApi";
import { getStoreConfigById } from "api/product/productApi";
import InfoComponent from "../Common/InfoComponent ";

const ProductForm = ({
  handleProductSubmit,
  initialData,
  updateFormData,
  productErrors,
  isEditMode,
}) => {
  const [formData, setFormData] = useState({
    ...initialData,
    existingImage: isEditMode ? initialData.image || null : null,
  });

  const [errors, setErrors] = useState(productErrors);
  const [storeOptions, setStoreOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  // Fetch store options on component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await getAllStore();
        if (response.success) {
          const formattedData = response.data
            .filter((store) => store.storeName)
            .map((store) => ({
              value: store.storeID,
              label: store.storeName ? store.storeName : "N/A",
            }));
          setStoreOptions(formattedData);

          // If in edit mode and storeID exists, fetch store config
          if (isEditMode && initialData.storeID) {
            await fetchConfig(initialData.storeID);
          }
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, [isEditMode, initialData.storeID]);

  const fetchConfig = async (storeId) => {
    setIsLoadingConfig(true);
    try {
      const response = await getStoreConfigById(storeId);
      if (response.success) {
        // Format and set brand options
        const uniqueBrands = Array.from(
          new Map(
            response.data.storeBrands.map((brand) => [
              brand.brandName,
              {
                value: brand.brandID,
                label: brand.brandName,
              },
            ])
          ).values()
        );
        setBrandOptions(uniqueBrands);

        // Format and set category options
        const uniqueCategories = Array.from(
          new Map(
            response.data.storeCategories.map((category) => [
              category.categoryName,
              {
                value: category?.categoryID,
                label: category?.categoryName,
              },
            ])
          ).values()
        );
        setCategoryOptions(uniqueCategories);

        // If in edit mode and categoryID exists, fetch subcategories
        if (isEditMode && initialData.categoryID) {
          await fetchSubCategories(initialData.categoryID);
        }
      }
    } catch (error) {
      console.error("Error fetching config:", error);
      setBrandOptions([]);
      setCategoryOptions([]);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(
        `http://api.byteheart.com/api/Products/GetSubCategories/${categoryId}`
      );
      const data = await response.json();

      if (data) {
        const subCategoryOption = {
          value: data?.categoryID,
          label: data.categoryName,
          description: data.description,
          isActive: data.isActive,
        };

        if (data.isActive) {
          setSubCategoryOptions([subCategoryOption]);
        } else {
          setSubCategoryOptions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategoryOptions([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    updateFormData({ ...formData, [name]: value });
  };

  const handleStoreChange = async (selectedOption) => {
    const storeId = selectedOption ? selectedOption.value : null;
    setFormData({
      ...formData,
      storeID: storeId,
      brandID: "", // Reset dependent fields
      categoryID: "",
      subCategory: "",
    });
    updateFormData({
      ...formData,
      storeID: storeId,
      brandID: "",
      categoryID: "",
      subCategory: "",
    });

    if (storeId) {
      await fetchConfig(storeId);
    } else {
      setBrandOptions([]);
      setCategoryOptions([]);
      setSubCategoryOptions([]);
    }
  };

  const handleBrandChange = (selectedOption) => {
    setFormData({
      ...formData,
      brandID: selectedOption ? selectedOption.value : "",
    });
    updateFormData({
      ...formData,
      brandID: selectedOption ? selectedOption.value : "",
    });
  };

  const handleCategoryChange = async (selectedOption) => {
    const categoryId = selectedOption ? selectedOption.value : "";
    setFormData({
      ...formData,
      categoryID: categoryId,
      subCategory: "", // Reset subcategory when category changes
    });
    updateFormData({
      ...formData,
      categoryID: categoryId,
      subCategory: "",
    });

    if (categoryId) {
      await fetchSubCategories(categoryId);
    } else {
      setSubCategoryOptions([]);
    }
  };

  const handleSubCategoryChange = (selectedOption) => {
    setFormData({
      ...formData,
      subCategory: selectedOption ? selectedOption.value : "",
    });
    updateFormData({
      ...formData,
      subCategory: selectedOption ? selectedOption.value : "",
    });
  };

  const handleImageChange = (imageData) => {
    const newFormData = {
      ...formData,
      imageFile: imageData?.file || null,
      preview: imageData?.preview || null,
      existingImage: imageData ? null : formData.existingImage, // Clear existing image if new image uploaded
    };
    setFormData(newFormData);
    updateFormData(newFormData);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName)
      newErrors.productName = "Product name is required";
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be positive";
    }
    if (!formData.stock) {
      newErrors.stock = "Stock is required";
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock must be non-negative";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("storeID", formData.storeID);
    formDataPayload.append("categoryID", formData.categoryID);
    // formDataPayload.append("subCategory", formData.subCategory);
    formDataPayload.append("brandID", formData.brandID);
    formDataPayload.append("productName", formData.productName);
    formDataPayload.append("price", parseFloat(formData.price));
    formDataPayload.append("stock", parseInt(formData.stock));

    if (isEditMode) {
      // For edit mode
      formDataPayload.append("productID", formData.productId);

      if (formData.imageFile) {
        // If new image is uploaded
        formDataPayload.append("imageFile", formData.imageFile);
        // formDataPayload.append("image", null);
      } else {
        // If using existing image
        // formDataPayload.append("imageFile", null);
        formDataPayload.append("image", formData.preview || null);
      }
    } else {
      // For create mode
      if (formData.imageFile) {
        formDataPayload.append("imageFile", formData.imageFile);
      }
    }

    handleProductSubmit(formDataPayload);
  };

  const steps = [
    { number: 1, label: "Add Product" },
    { number: 2, label: "Product Detail Configuration" },
    { number: 3, label: "Product Image Gallery" },
  ];

  return (
    <Container className="my-5">
      <FormProgressBar currentStep={1} steps={steps} />
      <Row className="gap-0 align-items-start">
        <Col md={9} className="pe-0">
          <Card className="shadow p-4 rounded card">
            <h2 className="text-center mb-5 fs-3">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h2>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="store">
                    <Form.Label>Store</Form.Label>
                    <Select
                      name="store"
                      value={storeOptions.find(
                        (option) => option.value === formData.storeID
                      )}
                      options={storeOptions}
                      onChange={handleStoreChange}
                      isClearable
                      isDisabled={isLoadingConfig}
                      placeholder="Select or search for a store"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="brandName">
                    <Form.Label>Brand</Form.Label>
                    <Select
                      name="brandName"
                      value={brandOptions.find(
                        (option) => option.value === formData.brandID
                      )}
                      options={brandOptions}
                      onChange={handleBrandChange}
                      isClearable
                      isDisabled={!formData.storeID || isLoadingConfig}
                      placeholder="Select a brand"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Select
                      name="category"
                      value={categoryOptions.find(
                        (option) => option.value === formData.categoryID
                      )}
                      options={categoryOptions}
                      onChange={handleCategoryChange}
                      isClearable
                      isDisabled={!formData.storeID || isLoadingConfig}
                      placeholder="Select a category"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="subCategory">
                    <Form.Label>Sub Category</Form.Label>
                    <Select
                      name="subCategory"
                      value={subCategoryOptions.find(
                        (option) => option.value === formData.subCategory
                      )}
                      options={subCategoryOptions}
                      onChange={handleSubCategoryChange}
                      isClearable
                      isDisabled={!formData.categoryID || isLoadingConfig}
                      placeholder="Select a subcategory"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group controlId="productName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      isInvalid={!!errors.productName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.productName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      isInvalid={!!errors.stock}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.stock}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Form.Group controlId="imageUpload" className="mb-3">
                  <ImageUploader
                    multiple={false}
                    onChange={handleImageChange}
                    value={
                      formData.existingImage
                        ? [
                            {
                              preview: formData.existingImage,
                              path: formData.existingImage,
                            },
                          ]
                        : formData.preview
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
              </Row>
              <div className="text-end">
                <Button type="submit" variant="primary" className="btn-lama">
                  Next
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
        <Col md={3}>
          <InfoComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductForm;
