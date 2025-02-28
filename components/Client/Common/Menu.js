import { useState, useEffect } from "react";
import {
  FiMenu,
  FiChevronRight,
  FiChevronDown,
  FiHome,
  FiPackage,
  FiGrid,
} from "react-icons/fi";
import Link from "next/link";
import { Offcanvas, Button, Accordion } from "react-bootstrap";
import styles from "./Menu.module.css";
import { getAllCategories } from "api/categories/categoriesApi";

const Menu = () => {
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories();

        if (response.success) {
          const organizedCategories = organizeCategoriesHierarchy(
            response.data
          );
          setCategories(organizedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchCategories();
    }
  }, [show]);

  const organizeCategoriesHierarchy = (categoriesList) => {
    const isParentCategory = (category) => {
      return (
        category.parentCategoryID === "00000000-0000-0000-0000-000000000000" ||
        category.categoryID === category.parentCategoryID
      );
    };

    const parentCategories = categoriesList.filter(isParentCategory);
    const childCategories = categoriesList.filter(
      (cat) => !isParentCategory(cat)
    );

    return parentCategories.map((parent) => ({
      ...parent,
      children: childCategories.filter(
        (child) => child.parentCategoryID === parent.categoryID
      ),
    }));
  };

  const createCategorySlug = (category) => {
    const formattedName = category.categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const encodedId = encodeURIComponent(category.categoryID);
    return `${formattedName}__${encodedId}`;
  };

  const RecursiveCategory = ({ category, depth = 0 }) => {
    const hasChildren = category.children && category.children.length > 0;
    const categoryLink = `/category/${createCategorySlug(category)}`;
    const paddingLeft = `${depth * 1.5 + 1.5}rem`;

    if (hasChildren) {
      return (
        <Accordion key={category.categoryID}>
          <Accordion.Item
            eventKey={category.categoryID}
            className={styles.nestedAccordionItem}
          >
            <div className={styles.categoryWrapper}>
              <Link
                href={categoryLink}
                className={styles.categoryLink}
                style={{ paddingLeft }}
                onClick={handleClose}
              >
                {category.categoryName}
              </Link>
              <Accordion.Header className={styles.expandButton}>
                <FiChevronRight className={styles.accordionIcon} />
              </Accordion.Header>
            </div>
            <Accordion.Body className={styles.accordionBody}>
              {category.children.map((child) => (
                <RecursiveCategory
                  key={child.categoryID}
                  category={child}
                  depth={depth + 1}
                />
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      );
    }

    return (
      <div className={styles.categoryWrapper}>
        <Link
          href={categoryLink}
          className={styles.categoryLink}
          style={{ paddingLeft }}
          onClick={handleClose}
        >
          {category.categoryName}
        </Link>
      </div>
    );
  };

  return (
    <>
      <Button variant="link" onClick={handleShow} className={styles.menuButton}>
        <FiMenu size={24} />
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        className={styles.menuOffcanvas}
      >
        <Offcanvas.Header closeButton className={styles.menuHeader}>
          <Offcanvas.Title className={styles.menuTitle}>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.menuBody}>
          <nav className={styles.navigation}>
            <Link className={styles.menuLink} href="/" onClick={handleClose}>
              <FiHome size={20} />
              <span>Homepage</span>
            </Link>

            <Accordion className={styles.mainAccordion}>
              <Accordion.Item eventKey="0" className={styles.accordionItem}>
                <Accordion.Header className={styles.mainAccordionHeader}>
                  <div className={styles.headerContent}>
                    <FiGrid size={20} />
                    <span>Categories</span>
                    {/* <FiChevronDown className={styles.headerIcon} /> */}
                  </div>
                </Accordion.Header>
                <Accordion.Body className={styles.mainAccordionBody}>
                  {loading ? (
                    <div className={styles.loading}>
                      <div className={styles.loadingSpinner}></div>
                      Loading categories...
                    </div>
                  ) : (
                    <>
                      {categories.map((category) => (
                        <RecursiveCategory
                          key={category.categoryID}
                          category={category}
                        />
                      ))}
                    </>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Link
              className={styles.menuLink}
              href="/products"
              onClick={handleClose}
            >
              <FiPackage size={20} />
              <span>All products</span>
            </Link>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Menu;
