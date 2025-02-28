import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import Add from "./Common/Add";
import styles from "./CustomizeProducts.module.css"; // Custom CSS for additional styling

const CustomizeProducts = ({ productId }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Static data for variants and product options
  const variants = useMemo(
    () => [
      {
        _id: "1",
        choices: { Color: "Black", Size: "Medium" },
        stock: { inStock: true, quantity: 10 },
      },
      {
        _id: "2",
        choices: { Color: "Purple", Size: "Large" },
        stock: { inStock: true, quantity: 5 },
      },
      {
        _id: "3",
        choices: { Color: "Grey", Size: "Small" },
        stock: { inStock: true, quantity: 4 },
      },
    ],
    []
  );

  const productOptions = [
    {
      name: "Color",
      choices: [
        { description: "Black", value: "#000000" },
        { description: "Purple", value: "#6e00b3" },
        { description: "Grey", value: "#f6f6f6" },
      ],
    },
    {
      name: "Size",
      choices: [
        { description: "Small" },
        { description: "Medium" },
        { description: "Large" },
      ],
    },
  ];

  useEffect(() => {
    const variant = variants.find((v) => {
      const variantChoices = v.choices;
      return (
        variantChoices &&
        Object.entries(selectedOptions).every(
          ([key, value]) => variantChoices[key] === value
        )
      );
    });
    setSelectedVariant(variant);
  }, [selectedOptions, variants]);

  const handleOptionSelect = (optionType, choice) => {
    setSelectedOptions((prev) => ({ ...prev, [optionType]: choice }));
  };

  return (
    <div className="d-flex flex-column gap-4">
      {productOptions.map((option) => (
        <div className="d-flex flex-column gap-2" key={option.name}>
          <h4 className="fw-bold">Choose a {option.name}</h4>
          <div className="d-flex align-items-center gap-2">
            {option.choices.map((choice) => {
              const selected =
                selectedOptions[option.name] === choice.description;

              const clickHandler = () =>
                handleOptionSelect(option.name, choice.description);

              return option.name === "Color" ? (
                <div
                  className={`${styles.colorOption} ${
                    selected && styles.selected
                  }`}
                  style={{
                    backgroundColor: choice.value,
                    cursor: "pointer",
                  }}
                  onClick={clickHandler}
                  key={choice.description}
                />
              ) : (
                <Button
                  className={`${styles.optionButton} ${
                    selected ? styles.selectedOption : ""
                  }`}
                  onClick={clickHandler}
                  key={choice.description}
                >
                  {choice.description}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
      <Add
        productId={productId}
        variantId={
          selectedVariant?._id || "00000000-0000-0000-0000-000000000000"
        }
        stockNumber={selectedVariant?.stock?.quantity || 0}
      />
      {!selectedVariant && (
        <p className="text-danger">Selected variant is out of stock.</p>
      )}
    </div>
  );
};

export default CustomizeProducts;
