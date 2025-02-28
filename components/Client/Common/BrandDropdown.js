import React, { useState, useEffect } from "react";
import { NavDropdown } from "react-bootstrap";
import Link from "next/link";
import styles from "./CategoriesDropdown.module.css";
import { getAllBrands } from "api/brand/brandApi";

const BrandDropdown = () => {
  const [brands, setBrands] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        if (response.success) {
          setBrands(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchBrands();
  }, []);

  const generateBrandSlug = (brand) => {
    const formattedName = brand.brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `/brand?name=${formattedName}&id=${encodeURIComponent(
      brand.brandID
    )}`;
  };

  return (
    <div
      className={styles.dropdownContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavDropdown
        title="Brands"
        show={isHovered}
        className={styles.categoriesDropdown}
      >
        {brands.map((brand) => (
          <div key={brand.brandID} className={styles.categoryContainer}>
            <Link
              href={`${generateBrandSlug(brand)}`}
              className={styles.categoryItem}
            >
              {brand.brandName}
            </Link>
          </div>
        ))}
      </NavDropdown>
    </div>
  );
};

export default BrandDropdown;
