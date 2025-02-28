import React, { useState, useEffect } from "react";
import styles from "./PaymentComponent.module.css";
import Image from "next/image";
import { useCart } from "contexts/CartContext";
import { createOrder } from "api/order/orderApi";
import { useRouter } from "next/navigation";

const PaymentComponent = () => {
  const [selectedTab, setSelectedTab] = useState("Cash on Delivery");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState({});
  const { setCartItems, getCartCount } = useCart();
  const router = useRouter();

  const tabs = [
    {
      label: "Credit/Debit Card",
      comingSoon: true,
      imgSrc: "/images/credit-card.png",
    },
    { label: "Nagad", comingSoon: true, imgSrc: "/images/nagad.png" },
    {
      label: "Save bKash Account",
      comingSoon: true,
      imgSrc: "/images/bkash.png",
    },
    {
      label: "Cash on Delivery",
      comingSoon: false,
      imgSrc: "/images/cash.png",
    },
    { label: "Instalment", comingSoon: true, imgSrc: "/images/instalment.png" },
    { label: "Rocket", comingSoon: true, imgSrc: "/images/rocket.png" },
  ];

  useEffect(() => {
    const fetchOrderInfo = async () => {
      setIsLoading(true);
      try {
        const getSessionData = () => {
          const savedOrderInfo = sessionStorage.getItem("orderInfo");
          return savedOrderInfo ? JSON.parse(savedOrderInfo) : {};
        };

        const orderInfo = getSessionData();

        setOrderInfo(orderInfo);
      } catch (error) {
        console.error("Error fetching order info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderInfo();
  }, []);

  const handleTabClick = (tabLabel) => {
    setSelectedTab(tabLabel);
  };

  const clearSessionStorage = () => {
    sessionStorage.removeItem("orderInfo");
  };

  const handleConfirmOrder = async () => {
    try {
      setError(null);
      setSuccessMessage("");

      const payload = { ...orderInfo, orderNumber: "1" };

      const response = await createOrder(payload);
      if (!response.success)
        throw new Error(response.message || "Failed to create order");

      if (response.success) {
        setSuccessMessage("Order placed successfully!");
        clearSessionStorage();
        setCartItems([]);

        // Redirect to the Thank You Page with order ID
        setTimeout(() => {
          router.push(`/thank-you?orderNumber=${response.data.orderNumber}`);
        }, 2000);
      }
    } catch (err) {
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <p>Loading order details...</p>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-10">
      <h4 className="mb-4">Select Payment Method</h4>

      <div className="row">
        <div className="col-md-8">
          <div className={styles.paymentMethod}>
            <div className={styles.tabOptionContainer}>
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`${styles.tabOption} ${
                    selectedTab === tab.label ? styles.active : ""
                  }`}
                  onClick={() => handleTabClick(tab.label)}
                >
                  <Image
                    width={100}
                    height={100}
                    src={tab.imgSrc}
                    alt={`${tab.label} logo`}
                    className={styles.tabImage}
                  />
                  <p>{tab.label}</p>
                </div>
              ))}
            </div>
            <div className={styles.paymentBox}>
              {selectedTab === "Cash on Delivery" ? (
                <div className={styles.textLeft}>
                  <p>
                    - You may pay in cash to our courier upon receiving your
                    parcel at the doorstep
                  </p>
                  <p>
                    - Before agreeing to receive the parcel, check if your
                    delivery status has been updated to Out for Delivery
                  </p>
                  <p>
                    - Before receiving, confirm that the airway bill shows that
                    the parcel is from Daraz
                  </p>
                  <p>
                    - Before you make payment to the courier, confirm your order
                    number, sender information, and tracking number on the
                    parcel
                  </p>
                </div>
              ) : (
                <div className={styles.comingSoonText}>
                  <p>Coming Soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={`${styles.orderSummary} shadow`}>
            <h5 className={`${styles.orderSummaryTitle}`}>Order Summary</h5>
            <div className={styles.summaryDetails}>
              <p>
                Subtotal ({getCartCount()} item and shipping fee included): Tk
                {orderInfo?.totalDeliveryFee}
              </p>

              <p className={styles.total}>
                <strong>Total Amount:</strong> Tk{orderInfo?.totalAmount}
              </p>
            </div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          <button
            className={styles.confirmButton}
            onClick={() => handleConfirmOrder()}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
