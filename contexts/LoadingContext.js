"use client";

import React, { createContext, useContext, useState } from "react";
import { Spinner } from "react-bootstrap";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(0); // Counter for multiple requests

  const value = {
    setLoading: (isLoading) => {
      setLoading((prev) => (isLoading ? prev + 1 : Math.max(0, prev - 1)));
    },
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {loading > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Spinner
            animation="border"
            variant="primary"
            style={{
              width: "3rem",
              height: "3rem",
            }}
          />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
