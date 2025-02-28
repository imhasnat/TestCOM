"use client";

import React from "react";
import "./filter.css";
import { TiDelete } from "react-icons/ti";

const Filter = ({
  categories,
  brands,
  filterData,
  onFilterChange,
  onClearFilters,
  allFilter = true,
}) => {
  // Handle sort filter change
  const handleSortChange = (e) => {
    const value = e.target.value;
    onFilterChange({
      lowToHigh: value === "asc price",
      highToLow: value === "desc price",
    });
  };

  // Handle price changes
  const handlePriceChange = (e, field) => {
    const value = e.target.value;
    onFilterChange({ [field]: value ? value : null });
  };

  // Handle category and brand changes
  const handleSelectChange = (e, field) => {
    onFilterChange({ [field]: e.target.value ? e.target.value : null });
  };

  // Determine if basic filters are applied
  const hasBasicFilters =
    filterData.lowToHigh ||
    filterData.highToLow ||
    filterData.minPrice ||
    filterData.maxPrice;

  // Determine if category or brand filters are applied
  const hasCategoryOrBrandFilters = filterData.categoryId || filterData.brandId;

  // Show the clear filters button based on the given conditions
  const showClearFilters = allFilter
    ? hasBasicFilters || hasCategoryOrBrandFilters
    : hasBasicFilters;

  // Hide the button when `allFilter` is false, and only category/brand filters are set
  const hideClearFilters =
    !allFilter && !hasBasicFilters && hasCategoryOrBrandFilters;

  return (
    <div className="filter-container">
      <div className="filter-options">
        {/* Sort Filter */}
        <select
          name="sort"
          className="sort-select"
          onChange={handleSortChange}
          value={
            filterData.lowToHigh
              ? "asc price"
              : filterData.highToLow
              ? "desc price"
              : ""
          }
        >
          <option value="">Sort By</option>
          <option value="asc price">Price (Low to High)</option>
          <option value="desc price">Price (High to Low)</option>
        </select>

        {/* Price Range Filters */}
        <input
          type="text"
          name="minPrice"
          placeholder="Min Price"
          className="filter-input"
          value={filterData.minPrice || ""}
          onChange={(e) => handlePriceChange(e, "minPrice")}
        />
        <input
          type="text"
          name="maxPrice"
          placeholder="Max Price"
          className="filter-input"
          value={filterData.maxPrice || ""}
          onChange={(e) => handlePriceChange(e, "maxPrice")}
        />

        {/* Category Filter - Only show if allFilter is true */}
        {allFilter && (
          <select
            name="categoryId"
            className="filter-select"
            value={filterData.categoryId || ""}
            onChange={(e) => handleSelectChange(e, "categoryId")}
          >
            <option value="">Category</option>
            {categories.map((category) => (
              <option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </option>
            ))}
          </select>
        )}

        {/* Brand Filter - Only show if allFilter is true */}
        {allFilter && (
          <select
            name="brandId"
            className="filter-select"
            value={filterData.brandId || ""}
            onChange={(e) => handleSelectChange(e, "brandId")}
          >
            <option value="">Brand</option>
            {brands.map((brand) => (
              <option key={brand.brandID} value={brand.brandID}>
                {brand.brandName}
              </option>
            ))}
          </select>
        )}

        {/* Clear Filters Button */}
        {showClearFilters && !hideClearFilters && (
          <div
            className="clear-filters-btn rounded-pill p-2 pl-0 border-none"
            onClick={onClearFilters}
            title="Remove all filters"
          >
            <span className="d-flex gap-1 align-items-center">
              <TiDelete size={20} className="danger text-danger" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
