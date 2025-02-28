import React, { useState, useEffect } from "react";
import { NavDropdown } from "react-bootstrap";
import Link from "next/link";
import styles from "./CategoriesDropdown.module.css";
import { getAllCategories } from "api/categories/categoriesApi";

const CategoryItem = ({ category, allCategories, level = 0, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("right");

  useEffect(() => {
    const checkDropdownPosition = () => {
      const rect = document
        .querySelector(`[data-category-id="${category.categoryID}"]`)
        ?.getBoundingClientRect();

      if (rect && rect.right + 320 > window.innerWidth) {
        setDropdownPosition("left");
      } else {
        setDropdownPosition("right");
      }
    };

    checkDropdownPosition();
    window.addEventListener("resize", checkDropdownPosition);
    return () => window.removeEventListener("resize", checkDropdownPosition);
  }, [category.categoryID]);

  const getSubcategories = (parentId) => {
    return allCategories.filter(
      (cat) =>
        cat.parentCategoryID === parentId &&
        cat.categoryID !== cat.parentCategoryID &&
        cat.parentCategoryID !== "00000000-0000-0000-0000-000000000000"
    );
  };

  const generateCategorySlug = (category) => {
    const formattedName = category.categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return `/category?name=${formattedName}&id=${encodeURIComponent(
      category.categoryID
    )}`;
  };

  const subcategories = getSubcategories(category.categoryID);
  const hasSubcategories = subcategories.length > 0;

  return (
    <div
      className={`${styles.categoryContainer}`}
      data-category-id={category.categoryID}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={generateCategorySlug(category)}
        className={`${styles.categoryItem}`}
      >
        <span>{category.categoryName}</span>
        {hasSubcategories && <span className={styles.arrowRight}>→</span>}
      </Link>

      {hasSubcategories && isHovered && (
        <div
          className={styles.subcategoriesContainer}
          style={{ [dropdownPosition]: 0 }}
        >
          {subcategories.map((subcategory) => (
            <CategoryItem
              key={subcategory.categoryID}
              category={subcategory}
              allCategories={allCategories}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoriesDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [isMainDropdownHovered, setIsMainDropdownHovered] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const getParentCategories = () => {
    return categories.filter(
      (category) =>
        category.parentCategoryID === "00000000-0000-0000-0000-000000000000" ||
        category.categoryID === category.parentCategoryID
    );
  };

  return (
    <div
      className={styles.dropdownContainer}
      onMouseEnter={() => setIsMainDropdownHovered(true)}
      onMouseLeave={() => setIsMainDropdownHovered(false)}
    >
      <NavDropdown
        title={
          <span className={styles.dropdownTitle}>
            <span>Categories</span>
          </span>
        }
        show={isMainDropdownHovered}
        className={styles.categoriesDropdown}
      >
        <div className={styles.megaMenu}>
          {getParentCategories().map((category) => (
            <CategoryItem
              key={category.categoryID}
              category={category}
              allCategories={categories}
              onHover={(hover) =>
                setIsMainDropdownHovered(hover || isMainDropdownHovered)
              }
            />
          ))}
        </div>
      </NavDropdown>
    </div>
  );
};

export default CategoriesDropdown;
