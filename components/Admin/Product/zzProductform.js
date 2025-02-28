import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import Select from "react-select";
import FormProgressBar from "../Common/FormProgressBar";
import Image from "next/image";
import InfoComponent from "../Common/InfoComponent ";

const ProductForm = ({
  handleProductSubmit,
  initialData,
  updateFormData,
  productErrors,
}) => {
  const [formData, setFormData] = useState(initialData);

  const [errors, setErrors] = useState(productErrors);
  const [storeOptions, setStoreOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  useEffect(() => {
    // Fetch store options
    const fetchStores = async () => {
      try {
        const response = await fetch(
          "http://api.byteheart.com/api/Products/GetAllStore"
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          const formattedData = data
            .filter((store) => store.storeName)
            .map((store) => ({
              value: store.storeID,
              label: store.storeName,
            }));

          setStoreOptions(formattedData);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  const fetchConfig = async (storeId) => {
    try {
      const response = await fetch(
        `http://api.byteheart.com/api/Products/GetStoreConfigById/${storeId}`
      );
      const data = await response.json();

      // Remove duplicates from storeBrands using Set
      const uniqueBrands = Array.from(
        new Map(
          data.storeBrands.map((brand) => [
            brand.brandName,
            {
              value: brand.storeBrandID,
              label: brand.brandName,
            },
          ])
        ).values()
      );

      // Remove duplicates from storeCategories using Set
      const uniqueCategories = Array.from(
        new Map(
          data.storeCategories.map((category) => [
            category.categoryName,
            {
              value: category?.storeCategoryID,
              label: category?.categoryName,
            },
          ])
        ).values()
      );

      setBrandOptions(uniqueBrands);
      setCategoryOptions(uniqueCategories);
    } catch (error) {
      console.error("Error fetching config:", error);
      // Clear options in case of error
      setBrandOptions([]);
      setCategoryOptions([]);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await fetch(
        `http://api.byteheart.com/api/Products/GetSubCategories/${categoryId}`
      );
      const data = await response.json();

      // Convert the single subcategory object into a format suitable for react-select
      if (data) {
        const subCategoryOption = {
          value: data?.categoryID,
          label: data.categoryName,
          description: data.description,
          isActive: data.isActive,
        };

        // Only add active subcategories
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          preview: reader.result,
        });
        updateFormData({
          ...formData,
          imageFile: file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    updateFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, description: value });
    updateFormData({ ...formData, description: value });
  };

  const handleStoreChange = (selectedOption) => {
    setFormData({
      ...formData,
      storeID: selectedOption ? selectedOption.value : null,
    });
    updateFormData({
      ...formData,
      storeID: selectedOption ? selectedOption.value : null,
    });
    if (selectedOption) {
      fetchConfig(selectedOption.value);
    } else {
      setBrandOptions([]);
      setCategoryOptions([]);
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

  const handleCategoryChange = (selectedOption) => {
    setFormData({
      ...formData,
      categoryID: selectedOption ? selectedOption.value : "",
      subCategory: "", // Reset subCategory when category changes
    });
    updateFormData({
      ...formData,
      categoryID: selectedOption ? selectedOption.value : "",
      subCategory: "", // Reset subCategory when category changes
    });

    if (selectedOption) {
      fetchSubCategories(selectedOption.value);
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

    // Create a FormData object
    const submitFormData = new FormData();

    // Append form data fields
    submitFormData.append("storeID", formData.storeID);
    submitFormData.append("categoryID", formData.categoryID);
    submitFormData.append("subCategory", formData.subCategory);
    submitFormData.append("brandID", formData.brandID);
    submitFormData.append("productName", formData.productName);
    submitFormData.append("price", parseFloat(formData.price));
    submitFormData.append("stock", parseInt(formData.stock));

    // Append the image file if it exists
    if (formData.imageFile) {
      submitFormData.append("imageFile", formData.imageFile);
    }

    // Log each entry in the FormData for debugging
    for (let [key, value] of submitFormData.entries()) {
      console.log(key, value);
    }

    handleProductSubmit(submitFormData);
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
            <h2 className="text-center mb-5 fs-3">Add New Product</h2>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="store">
                    <Form.Label>Store</Form.Label>
                    <Select
                      name="store"
                      value={
                        storeOptions.find(
                          (option) => option.value === formData.storeID
                        ) || null
                      }
                      options={storeOptions}
                      onChange={handleStoreChange}
                      isClearable
                      placeholder="Select or search for a store"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="brandName">
                    <Form.Label>Brand</Form.Label>
                    <Select
                      name="brandName"
                      value={
                        brandOptions.find(
                          (option) => option.value === formData.brandID
                        ) || null
                      }
                      options={brandOptions}
                      onChange={handleBrandChange}
                      isClearable
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
                      value={
                        categoryOptions.find(
                          (option) => option.value === formData?.categoryID
                        ) || null
                      }
                      options={categoryOptions}
                      onChange={handleCategoryChange}
                      isClearable
                      placeholder="Select a category"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="subCategory">
                    <Form.Label>Sub Category</Form.Label>
                    <Select
                      name="subCategory"
                      value={
                        subCategoryOptions.find(
                          (option) => option.value === formData.subCategory
                        ) || null
                      }
                      options={subCategoryOptions}
                      onChange={handleSubCategoryChange}
                      isClearable
                      isDisabled={!formData?.categoryID}
                      placeholder="Select a subcategory"
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* Rest of the form remains the same */}
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
                  <Form.Label>Upload Product Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {formData.preview && (
                    <div className="mt-3">
                      <Image
                        src={formData.preview}
                        alt="Product Preview"
                        width={200}
                        height={200}
                      />
                    </div>
                  )}
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
