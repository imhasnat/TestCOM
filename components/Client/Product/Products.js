import React, { useEffect, useState, useCallback, useRef } from "react";
import ProductList from "./ProductList";
import { searchProducts } from "api/product/productApi";
import { Button, Col, Container, Row } from "react-bootstrap";
import { getAllCategories } from "api/categories/categoriesApi";
import { getAllBrands } from "api/brand/brandApi";
import Image from "next/image";
import Filter from "./Filter";
import "./all-product.css";

// Error Boundary Component remains unchanged
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const Products = ({ id, element, allFilter, param }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const [filterData, setFilterData] = useState({
    page: 1,
    pageSize: 8,
    lowToHigh: null,
    highToLow: null,
    latestToOld: null,
    minPrice: null,
    maxPrice: null,
    brandId: null,
    categoryId: null,
    searchTerm: param || null,
  });

  // Single effect to handle filter data initialization
  useEffect(() => {
    const initializeFilterData = () => {
      if (id && element) {
        setFilterData((prev) => ({
          ...prev,
          page: 1,
          [element]: id,
          // Reset other filters when navigating to category/brand page
          lowToHigh: null,
          highToLow: null,
          latestToOld: null,
          minPrice: null,
          maxPrice: null,
          // Only reset the other ID if we're setting one
          ...(element === "categoryId" ? { brandId: null } : {}),
          ...(element === "brandId" ? { categoryId: null } : {}),
        }));
      } else {
        setFilterData((prev) => ({
          ...prev,
          page: 1,
          categoryId: null,
          brandId: null,
        }));
      }
    };

    initializeFilterData();
  }, [id, element]);

  // Separate effect for search term updates
  useEffect(() => {
    setFilterData((prev) => ({
      ...prev,
      searchTerm: param || null,
      page: 1,
    }));
  }, [param]);

  // Main effect for fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setProducts([]); // Clear existing products

        const response = await searchProducts(filterData);

        if (!response?.data || response.data.length === 0) {
          setHasMore(false);
          setProducts([]);
        } else {
          setProducts(response.data);
          setFilterData((prev) => ({
            ...prev,
            page: 2,
          }));
          setHasMore(true);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
        setProducts([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if filterData is properly initialized
    if (initialized) {
      fetchProducts();
    }
  }, [
    initialized,
    filterData.searchTerm,
    filterData.lowToHigh,
    filterData.highToLow,
    filterData.latestToOld,
    filterData.minPrice,
    filterData.maxPrice,
    filterData.brandId,
    filterData.categoryId,
  ]);

  // Effect for infinite scroll
  useEffect(() => {
    if (filterData.page === 1 || !initialized) return;

    const fetchMoreProducts = async () => {
      try {
        const response = await searchProducts(filterData);

        if (!response?.data || response.data.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prevProducts) => {
            const currentProducts = Array.isArray(prevProducts)
              ? prevProducts
              : [];
            return [...currentProducts, ...response.data];
          });
          setFilterData((prev) => ({
            ...prev,
            page: prev.page + 1,
          }));
        }
      } catch (error) {
        console.error("Error fetching more products:", error);
        setError("Failed to fetch more products");
        setHasMore(false);
      }
    };

    const onIntersection = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        fetchMoreProducts();
      }
    };

    const observer = new IntersectionObserver(onIntersection);
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, filterData.page, isLoading, initialized]);

  // Initial fetch of filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
        ]);
        setCategories(categoryRes.data || []);
        setBrands(brandRes.data || []);
        setInitialized(true);
      } catch (err) {
        console.error("Error fetching categories or brands:", err);
        setError("Failed to fetch filter options");
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = useCallback((updatedFilter) => {
    setProducts([]); // Clear existing products
    setHasMore(true); // Reset hasMore
    setFilterData((prev) => ({
      ...prev,
      ...updatedFilter,
      page: 1,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterData((prev) => {
      const baseReset = {
        lowToHigh: null,
        highToLow: null,
        latestToOld: null,
        minPrice: null,
        maxPrice: null,
        page: 1,
      };

      if (allFilter) {
        return {
          ...prev,
          ...baseReset,
          categoryId: null,
          brandId: null,
        };
      }

      return {
        ...prev,
        ...baseReset,
      };
    });
  }, [allFilter]);

  if (!initialized) return null;

  return (
    <Container className="px-4 ">
      <Row className="my-5">
        <Col md={12} className="px-0">
          <Filter
            categories={categories}
            brands={brands}
            filterData={filterData}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            allFilter={allFilter}
          />
        </Col>

        <Col md={12} className="mt-8">
          {error ? (
            <div className="text-center text-danger">{error}</div>
          ) : products.length === 0 && !isLoading ? (
            <div className="text-center p-4">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <ProductList
              products={products}
              perPage={8}
              isPagi={false}
              currentPage={filterData.page}
              onPageChange={handleFilterChange}
            />
          )}
          {hasMore && !isLoading && products.length > 0 && (
            <div ref={loaderRef}>Loading more products...</div>
          )}
          {isLoading && <div>Loading...</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default function ProductsWrapper({
  id = null,
  element = null,
  allFilter = true,
  param = null,
}) {
  return (
    <ErrorBoundary>
      <Products id={id} element={element} allFilter={allFilter} param={param} />
    </ErrorBoundary>
  );
}
