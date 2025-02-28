import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { getAllStore } from "api/store/storeApi";
import { createOrUpdateCoupon } from "api/order/orderApi";

const CouponForm = () => {
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      code: "",
      discountPercentage: 0,
      discountAmount: 0,
      minimumOrderAmount: 0,
      expirationDate: "",
      storeId: "",
      isActive: false,
    },
  });

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all stores when the component mounts
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await getAllStore();
        setStores(response.data || []);
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError("Failed to fetch stores.");
      }
    };
    fetchStores();
  }, []);

  // Form submission handler
  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createOrUpdateCoupon(data);
      setSuccess("Coupon created successfully!");
      reset(); // Reset form fields after success
    } catch (err) {
      console.error("Error creating coupon:", err);
      setError("Failed to create coupon. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="mt-5 mb-4 p-3 border-0 shadow-lg">
        <h4>Create Coupon</h4>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="code" className="mb-3">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter coupon code"
              {...register("code", { required: true })}
            />
          </Form.Group>

          <Form.Group controlId="discountPercentage" className="mb-3">
            <Form.Label>Discount Percentage</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter discount percentage"
              {...register("discountPercentage", {
                required: true,
                min: 0,
                max: 100,
              })}
            />
          </Form.Group>

          <Form.Group controlId="discountAmount" className="mb-3">
            <Form.Label>Discount Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter discount amount"
              {...register("discountAmount", { required: true, min: 0 })}
            />
          </Form.Group>

          <Form.Group controlId="minimumOrderAmount" className="mb-3">
            <Form.Label>Minimum Order Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter minimum order amount"
              {...register("minimumOrderAmount", {
                required: true,
                min: 0,
              })}
            />
          </Form.Group>

          <Form.Group controlId="expirationDate" className="mb-3">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control
              type="datetime-local"
              {...register("expirationDate", { required: true })}
            />
          </Form.Group>

          <Form.Group controlId="storeId" className="mb-3">
            <Form.Label>Store</Form.Label>
            <Form.Select
              {...register("storeId", { required: true })}
              defaultValue=""
            >
              <option value="" disabled>
                Select a store
              </option>
              {stores.map((store) => (
                <option key={store.storeID} value={store.storeID}>
                  {store.storeName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="isActive" className="mb-3">
            <Form.Label>Is Active</Form.Label>
            <Form.Check
              type="checkbox"
              label="Active"
              {...register("isActive")}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Create Coupon"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CouponForm;
