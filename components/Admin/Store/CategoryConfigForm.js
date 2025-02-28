import { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import FormProgressBar from "../Common/FormProgressBar";

const CategoryConfigForm = () => {
  const [categories, setCategories] = useState([{ name: "" }]);

  const handleCategoryChange = (index, event) => {
    const newCategories = [...categories];
    newCategories[index].name = event.target.value;
    setCategories(newCategories);
  };

  const addNewCategoryField = () => {
    setCategories([...categories, { name: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Categories:", categories);
    // Handle form submission logic here, e.g., send to API
  };

  return (
    <Container className="mt-5">
      <FormProgressBar currentStep={3} />
      <Card className="p-4 shadow-lg">
        <h2 className="text-center mb-4">Field Configuration</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            {categories.map((category, index) => (
              <Col key={index} md={8} className="mb-3 ">
                <Form.Group controlId={`category-${index}`}>
                  <Form.Label>Field {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={category.name}
                    onChange={(event) => handleCategoryChange(index, event)}
                    placeholder="Enter Field name"
                  />
                </Form.Group>
              </Col>
            ))}
            <Col
              md={4}
              className="d-flex align-items-end justify-content-end mb-3"
            >
              <Button variant="secondary" onClick={addNewCategoryField}>
                Add Field
              </Button>
            </Col>
          </Row>

          <div className="text-end">
            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default CategoryConfigForm;
