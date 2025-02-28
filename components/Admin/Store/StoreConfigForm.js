import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ProgressBar,
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import FormProgressBar from "../Common/FormProgressBar";
import InfoComponent from "../Common/InfoComponent ";
import { getAllCategories } from "api/categories/categoriesApi";
import { getAllBrands } from "api/brand/brandApi";

const PLACEHOLDER_ID = "0000-0000-0000-0000";

export default function StoreConfigForm({
  handleConfigSubmit,
  storeId,
  handleCurrentStep,
  selectedBrands,
  setSelectedBrands,
  selectedCategories,
  setSelectedCategories,
}) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCreateMode] = useState(
    !selectedBrands.some((brand) => brand.storeBrandID)
  );

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        if (!response.success) {
          throw new Error("Failed to fetch brands");
        }
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (!response.success) {
          throw new Error("Failed to fetch categories");
        }
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchBrands();
    fetchCategories();
  }, []);

  const handleBrandChange = (brandId, brandName) => {
    setSelectedBrands((prev) => {
      const existingBrand = prev.find((brand) => brand.brandID === brandId);

      if (existingBrand) {
        return prev.filter((brand) => brand.brandID !== brandId);
      }

      const newBrand = {
        storeID: storeId,
        brandID: brandId,
        brandName: brandName,
        storeBrandID: PLACEHOLDER_ID,
      };

      return [...prev, newBrand];
    });
  };

  const handleCategoryChange = (categoryId, categoryName) => {
    setSelectedCategories((prev) => {
      const existingCategory = prev.find(
        (category) => category.categoryID === categoryId
      );

      if (existingCategory) {
        return prev.filter((category) => category.categoryID !== categoryId);
      }

      const newCategory = {
        storeID: storeId,
        categoryID: categoryId,
        categoryName: categoryName,
        storeCategoryID: PLACEHOLDER_ID,
      };

      return [...prev, newCategory];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      storeID: storeId,
      storeBrands: selectedBrands.map((brand) => ({
        ...brand,
        // Preserve existing storeBrandID in update mode, use placeholder in create mode
        storeBrandID: brand.storeBrandID || PLACEHOLDER_ID,
      })),
      storeCategories: selectedCategories.map((category) => ({
        ...category,
        // Preserve existing storeCategoryID in update mode, use placeholder in create mode
        storeCategoryID: category.storeCategoryID || PLACEHOLDER_ID,
      })),
    };

    handleConfigSubmit(formData);
  };

  return (
    <Container className="mt-5">
      <FormProgressBar currentStep={2} />
      <Row>
        <Col md={9} className="pe-0">
          <Card className="p-4 shadow-lg">
            <h2>Store Configuration</h2>
            <Form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-between align-items-center my-4">
                <h4 className="mb-0">Brands</h4>
              </div>
              <Row className="g-2">
                {brands.map((brand) => (
                  <Col xs={12} sm={6} md={4} key={brand.brandID}>
                    <Form.Check
                      type="checkbox"
                      label={brand.brandName}
                      id={`brand-${brand.brandID}`}
                      checked={selectedBrands.some(
                        (b) => b.brandID === brand.brandID
                      )}
                      onChange={() =>
                        handleBrandChange(brand.brandID, brand.brandName)
                      }
                    />
                  </Col>
                ))}
              </Row>

              <div className="d-flex justify-content-between align-items-center my-4">
                <h4 className="mb-0">Categories</h4>
              </div>
              <Row className="g-2">
                {categories.map((category) => (
                  <Col xs={12} sm={6} md={4} key={category.categoryID}>
                    <Form.Check
                      type="checkbox"
                      label={category.categoryName}
                      id={`category-${category.categoryID}`}
                      checked={selectedCategories.some(
                        (c) => c.categoryID === category.categoryID
                      )}
                      onChange={() =>
                        handleCategoryChange(
                          category.categoryID,
                          category.categoryName
                        )
                      }
                    />
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
                <Button variant="primary" type="submit" className="mt-4">
                  Next
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
        <Col md={3} className="ps-md-0 pt-md-10">
          <InfoComponent />
        </Col>
      </Row>
    </Container>
  );
}
