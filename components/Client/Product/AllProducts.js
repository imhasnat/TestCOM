import React, { useEffect, useState, useCallback } from "react";
import ProductList from "./ProductList";
import { filterProducts } from "api/product/productApi";
import { Button, Col, Container, Row } from "react-bootstrap";
import { getAllCategories } from "api/categories/categoriesApi";
import { getAllBrands } from "api/brand/brandApi";
import Image from "next/image";
import Filter from "./Filter";
import "./all-product.css";
import debounce from "lodash/debounce";

// Error Boundary Component
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

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
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
  });

  // Create fetch function inside useCallback
  const fetchProducts = useCallback(async (filters) => {
    if (!filters) return;

    try {
      const response = await filterProducts(filters);
      setProducts(response.data || []);
      setTotalPages(response.totalPage || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    }
  }, []); // Empty dependency array as it only uses setState functions

  // Create debounced version of fetch
  const debouncedFetch = useCallback(
    (filters) => {
      const debouncedFn = debounce((f) => fetchProducts(f), 500);
      debouncedFn(filters);
      return () => debouncedFn.cancel();
    },
    [fetchProducts]
  );

  // Initialize component
  useEffect(() => {
    setInitialized(true);
    return () => setInitialized(false);
  }, []);

  // Fetch Categories and Brands on Mount
  useEffect(() => {
    let mounted = true;

    const fetchFilterOptions = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
        ]);

        if (!mounted) return;

        setCategories(categoryRes.data || []);
        setBrands(brandRes.data || []);
      } catch (err) {
        console.error("Error fetching categories or brands:", err);
        if (mounted) {
          setError("Failed to fetch filter options");
        }
      }
    };

    fetchFilterOptions();

    return () => {
      mounted = false;
    };
  }, []);

  // Use effect with debounced fetch
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      const cleanup = debouncedFetch(filterData);
      return () => {
        mounted = false;
        cleanup();
      };
    }
  }, [filterData, debouncedFetch]);

  const handlePageChange = useCallback((pageNumber) => {
    setFilterData((prev) => ({
      ...prev,
      page: pageNumber,
    }));
  }, []);

  const handleFilterChange = useCallback((updatedFilter) => {
    setFilterData((prev) => ({
      ...prev,
      ...updatedFilter,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterData({
      page: 1,
      pageSize: 8,
      lowToHigh: null,
      highToLow: null,
      latestToOld: null,
      minPrice: null,
      maxPrice: null,
      brandId: null,
      categoryId: null,
    });
  }, []);

  if (!initialized) return null;

  return (
    <Container className="px-4 py-5">
      {/* Campaign Section */}
      <Row className="campaign-section align-items-center d-none d-md-flex mb-4">
        <Col md={8} className="text-center text-md-start">
          <h1 className="campaign-title">
            Grab up to 50% off on
            <br /> Selected Products
          </h1>
          <Button variant="primary" className="mt-3 buy-now-btn">
            Buy Now
          </Button>
        </Col>
        <Col md={4} className="text-center">
          <Image
            src="/woman.png"
            alt="Woman promoting sale"
            width={300}
            height={300}
            className="campaign-image"
            priority={true}
          />
        </Col>
      </Row>

      {/* Filter Component */}
      <Row className="my-5">
        <Col md={12} className="px-0">
          <Filter
            categories={categories}
            brands={brands}
            filterData={filterData}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </Col>

        {/* Product List */}
        <Col md={12} className="mt-8">
          {error ? (
            <div className="text-center text-danger">{error}</div>
          ) : (
            <ProductList
              products={products}
              perPage={8}
              isPagi={true}
              currentPage={filterData.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

// Wrapper component with Error Boundary
export default function AllProductsWrapper() {
  return (
    <ErrorBoundary>
      <AllProducts />
    </ErrorBoundary>
  );
}
