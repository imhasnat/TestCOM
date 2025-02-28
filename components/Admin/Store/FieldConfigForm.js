import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import FormProgressBar from "../Common/FormProgressBar";
import { getStoreConfigById } from "api/product/productApi";
import InfoComponent from "../Common/InfoComponent ";
import { deleteStoreProductField } from "api/store/storeApi";

const FieldConfigForm = ({
  handleCurrentStep,
  onSubmit,
  storeId,
  categories,
  setCategories,
}) => {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getStoreConfigById(storeId);
        if (!response.success) {
          throw new Error("Failed to fetch categories");
        }
        const options = response.data.storeCategories.map((category) => ({
          id: category.categoryID,
          name: category.categoryName,
          storeCategoryID: category.storeCategoryID,
        }));
        setCategoryOptions(options);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [storeId]);

  const handleCategoryChange = (index, event) => {
    const newCategories = [...categories];
    const selectedOption = categoryOptions.find(
      (option) => option.name === event.target.value
    );

    if (selectedOption) {
      newCategories[index] = {
        ...newCategories[index],
        categoryID: selectedOption.id,
        storeCategoryID: selectedOption.storeCategoryID,
      };
      setCategories(newCategories);
    }
  };

  const handleFieldChange = (catIndex, fieldIndex, event) => {
    const newCategories = [...categories];
    newCategories[catIndex].fields[fieldIndex] = {
      ...newCategories[catIndex].fields[fieldIndex],
      fields: event.target.value,
    };
    setCategories(newCategories);
  };

  const addNewCategory = () => {
    setCategories([
      ...categories,
      {
        categoryID: "",
        storeCategoryID: "",
        fields: [
          {
            productFieldID: "",
            fields: "",
          },
        ],
      },
    ]);
  };

  const addNewField = (catIndex) => {
    const newCategories = [...categories];
    newCategories[catIndex].fields.push({
      productFieldID: "",
      fields: "",
    });
    setCategories(newCategories);
  };

  const removeField = async (catIndex, fieldIndex) => {
    // Don't allow removal if it's the first field of the first category
    if (catIndex === 0 && fieldIndex === 0) return;

    const newCategories = [...categories];
    const fieldToDelete = newCategories[catIndex].fields[fieldIndex];

    // Delete from database if it exists
    if (fieldToDelete.productFieldID) {
      try {
        await deleteStoreProductField(fieldToDelete.productFieldID);
      } catch (error) {
        console.error("Error deleting field:", error);
        return;
      }
    }

    // Remove the field
    newCategories[catIndex].fields.splice(fieldIndex, 1);

    // If all fields are removed from a non-first category, remove the category
    if (catIndex !== 0 && newCategories[catIndex].fields.length === 0) {
      newCategories.splice(catIndex, 1);
    }

    setCategories(newCategories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedPayload = categories.map((category) => {
      // Format fields array
      const formattedFields = category.fields.map((field) => {
        // Base field object
        const formattedField = {
          fields: field.fields,
        };

        // Only add productFieldID if it has a value
        if (field.productFieldID) {
          formattedField.productFieldID = field.productFieldID;
        }

        return formattedField;
      });

      return {
        categoryID: category.categoryID,
        storeCategoryID: category.storeCategoryID,
        fields: formattedFields,
      };
    });

    onSubmit(formattedPayload);
  };

  return (
    <Container className="my-5">
      <FormProgressBar currentStep={3} />
      <Row>
        <Col md={9} className="pe-0">
          <Card className="form-card p-4 shadow-lg border-0">
            <h2 className="text-center mb-4 text-primary">
              Field Configuration
            </h2>
            <div className="text-end">
              <Button
                variant="primary"
                className="mb-3 px-4 rounded-pill"
                onClick={addNewCategory}
              >
                <i className="fas fa-plus me-2"></i>Add New Category
              </Button>
            </div>
            <Form onSubmit={handleSubmit}>
              {categories.map((category, catIndex) => (
                <Card
                  className="category-card p-4 mb-3 shadow-sm border-0"
                  key={catIndex}
                >
                  <div className="category-header d-flex justify-content-between align-items-start mb-3">
                    <h5 className="mb-0">Category {catIndex + 1}</h5>
                  </div>
                  <Row>
                    <Col md={8}>
                      <Form.Group controlId={`category-${catIndex}`}>
                        <Form.Label className="text-muted">
                          Select Category
                        </Form.Label>
                        <Form.Control
                          as="select"
                          value={
                            categoryOptions.find(
                              (option) => option.id === category.categoryID
                            )?.name || ""
                          }
                          onChange={(event) =>
                            handleCategoryChange(catIndex, event)
                          }
                          className="form-select-custom"
                        >
                          <option value="">Select a category</option>
                          {categoryOptions.map((option) => (
                            <option key={option.id} value={option.name}>
                              {option.name}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                      <Button
                        variant="outline-primary"
                        className="rounded-pill w-100"
                        onClick={() => addNewField(catIndex)}
                      >
                        <i className="fas fa-plus me-2"></i>Add Field
                      </Button>
                    </Col>
                  </Row>

                  {category.fields.map((field, fieldIndex) => (
                    <Row key={fieldIndex} className="mt-3 align-items-end">
                      <Col md={!(catIndex === 0 && fieldIndex === 0) ? 10 : 12}>
                        <Form.Group
                          controlId={`field-${catIndex}-${fieldIndex}`}
                        >
                          <Form.Label className="text-muted">
                            Field {fieldIndex + 1}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={field.fields}
                            onChange={(event) =>
                              handleFieldChange(catIndex, fieldIndex, event)
                            }
                            placeholder="Enter field name"
                            className="form-control-custom"
                          />
                        </Form.Group>
                      </Col>
                      {/* Show remove button for all fields except the first field of the first category */}
                      {!(catIndex === 0 && fieldIndex === 0) && (
                        <Col md={2}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="w-100 mb-3"
                            onClick={() => removeField(catIndex, fieldIndex)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                        </Col>
                      )}
                    </Row>
                  ))}
                </Card>
              ))}

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-primary"
                  type="button"
                  className="px-4 rounded-pill"
                  onClick={handleCurrentStep}
                >
                  <i className="fas fa-arrow-left me-2"></i>Back
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="px-4 rounded-pill"
                >
                  Submit<i className="fas fa-arrow-right ms-2"></i>
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
};

export default FieldConfigForm;
