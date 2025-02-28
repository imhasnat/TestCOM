import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Form } from "react-bootstrap";
import { searchProducts } from "api/product/productApi";

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true); // Start debouncing
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false); // Debouncing complete
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Debounce search term with 500ms delay
  const { debouncedValue: debouncedSearchTerm, isDebouncing } = useDebounce(
    searchTerm,
    500
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Use debounced value for API calls
  useEffect(() => {
    const fetchResults = async () => {
      // Only fetch if we're not currently debouncing
      if (debouncedSearchTerm.length >= 3 && !isDebouncing) {
        setIsLoading(true);
        setError(null);
        const pageParams = {
          page: 1,
          pageSize: 150,
          searchTerm: debouncedSearchTerm,
        };
        try {
          const response = await searchProducts(pageParams);
          if (
            response.success &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            setResults(response.data);
            setShowDropdown(true);
          } else {
            setResults([]);
            setError("No products found matching your search.");
            setShowDropdown(true);
          }
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
          setError("An error occurred while searching. Please try again.");
          setShowDropdown(true);
        } finally {
          setIsLoading(false);
        }
      } else if (debouncedSearchTerm.length < 3) {
        setResults([]);
        setError(null);
        setShowDropdown(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm, isDebouncing]);

  const handleProductSelect = (product) => {
    setShowDropdown(false);
    setSearchTerm(""); // Clear the search box
    router.push(
      `/product-details?name=${encodeURIComponent(product.productName)}&id=${
        product.productID
      }`
    );
  };

  // Pre-validate image URL and cache result
  const validateImageUrl = async (url, productId) => {
    if (loadedImages[productId] !== undefined) {
      return loadedImages[productId];
    }

    const img = document.createElement("img"); // Create a native img element
    img.onload = () => {
      setLoadedImages((prev) => ({
        ...prev,
        [productId]: url, // If image loads successfully, store the valid URL
      }));
    };
    img.onerror = () => {
      setLoadedImages((prev) => ({
        ...prev,
        [productId]: "/default.png", // If image fails to load, fallback to default image
      }));
    };
    img.src = url; // Trigger image loading

    // Check if image is loaded or not
    return img.src === url ? url : "/default.png"; // Return the URL if valid, fallback otherwise
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTerm.length >= 3) {
        setShowDropdown(false);
        router.push(`/search?param=${encodeURIComponent(searchTerm)}`);
      }
      return false;
    }
  };

  const handleViewAll = () => {
    setShowDropdown(false);
    router.push(`/search?param=${encodeURIComponent(searchTerm)}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length < 3) {
      setShowDropdown(false);
    }
  };

  const ProductImage = ({ product }) => {
    const [imageSrc, setImageSrc] = useState("/default.png");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const loadImage = async () => {
        if (product.image) {
          const validatedSrc = await validateImageUrl(
            product.image,
            product.productID
          );
          setImageSrc(validatedSrc);
        } else {
          setImageSrc("/default.png");
        }
        setIsLoading(false);
      };
      loadImage();
    }, [product.image, product.productID]);

    if (isLoading) {
      return <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />;
    }

    return (
      <Image
        src={imageSrc}
        alt={product.productName}
        fill
        style={{ objectFit: "cover" }}
        className="rounded"
      />
    );
  };

  return (
    <div className="ms-auto bg-light p-2 rounded">
      <div className="position-relative" ref={dropdownRef}>
        <Form className="d-flex align-items-center bg-white rounded shadow-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            placeholder="At least 3 characters"
            className="form-control border-0 shadow-none"
            aria-label="Search products"
          />
          <button
            type="button"
            onClick={handleViewAll}
            className="btn btn-link p-2 border-0"
            disabled={isLoading}
          >
            <Image
              src="/search.png"
              alt="search icon"
              width={16}
              height={16}
              unoptimized
            />
          </button>
        </Form>

        {showDropdown && !isDebouncing && (
          <div
            className="position-absolute w-100 mt-1 bg-white rounded shadow-lg border"
            style={{ maxHeight: "300px", overflowY: "auto", zIndex: 1000 }}
          >
            {isLoading ? (
              <div className="p-3 text-center">
                <div
                  className="spinner-border spinner-border-sm text-primary"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-3 text-center text-muted">{error}</div>
            ) : results.length > 0 ? (
              <>
                {results.slice(0, 5).map((product, index) => (
                  <React.Fragment key={product.productID}>
                    {index > 0 && <hr className="my-0 mx-3 opacity-25" />}
                    <div
                      className="px-3 py-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleProductSelect(product)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div className="flex-shrink-0">
                          <div
                            style={{
                              position: "relative",
                              width: "40px",
                              height: "40px",
                            }}
                          >
                            <ProductImage product={product} />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-medium">
                            {product.productName || "Unnamed Product"}
                          </div>
                          {product.price !== undefined &&
                          product.price !== null ? (
                            <div className="text-muted small">
                              $
                              {typeof product.price === "number"
                                ? product.price.toFixed(2)
                                : product.price}
                            </div>
                          ) : (
                            <div className="text-muted small">
                              Price not available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
                {results.length > 5 && (
                  <>
                    <hr className="my-0 mx-3 opacity-25" />
                    <div
                      className="px-3 py-2 text-center text-primary cursor-pointer hover:bg-gray-50"
                      onClick={handleViewAll}
                      style={{ cursor: "pointer" }}
                    >
                      View all {results.length} results
                    </div>
                  </>
                )}
              </>
            ) : (
              searchTerm.length >= 3 && (
                <div className="p-3 text-center text-muted">
                  No results found
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
