"use client";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import { FaSearch, FaSort } from "react-icons/fa";
import "./data-table.css";
import { useState } from "react";

const DataTable = ({ data, columns, pageIndex: initialPageIndex }) => {
  const [searchText, setSearchText] = useState(""); // Search input value
  const [filteredData, setFilteredData] = useState(data); // Data filtered by search
  const [currentPage, setCurrentPage] = useState(initialPageIndex || 0); // Track current page

  // Table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    state: { pageSize },
  } = useTable(
    {
      columns,
      data: filteredData, // Use filtered data for the table
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Handle Search
  const handleSearch = () => {
    const lowercasedSearch = searchText.toLowerCase();
    const newFilteredData = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowercasedSearch)
      )
    );
    setFilteredData(newFilteredData);
    gotoPage(0); // Reset pagination to the first page
  };

  return (
    <div>
      {/* Search Bar */}
      <Row className="mb-3">
        <Col sm={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={handleSearch}>
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>
        <Col xs={4} sm={2} md={1}>
          <Form.Select
            className="filter"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={`header-${headerGroupIndex}`} // Add a unique key here
            >
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={`header-column-${headerGroupIndex}-${columnIndex}`} // And here
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FaSort style={{ transform: "rotate(180deg)" }} />
                      ) : (
                        <FaSort />
                      )
                    ) : (
                      <FaSort style={{ color: "#ccc" }} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    {...cell.getCellProps()}
                    key={`cell-${row.id}-${cellIndex}`}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <Row className="align-items-center mt-3">
        <Col>
          <Pagination className="justify-content-center">
            <Pagination.First
              onClick={() => {
                gotoPage(0);
                setCurrentPage(0);
              }}
              disabled={!canPreviousPage}
            />
            <Pagination.Prev
              onClick={() => {
                previousPage();
                setCurrentPage((prev) => prev - 1);
              }}
              disabled={!canPreviousPage}
            />
            {pageOptions.map((pageNumber) => (
              <Pagination.Item
                key={`pagination-${pageNumber}`} // This key looks correct
                active={pageNumber === currentPage}
                onClick={() => {
                  gotoPage(pageNumber);
                  setCurrentPage(pageNumber);
                }}
              >
                {pageNumber + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => {
                nextPage();
                setCurrentPage((prev) => prev + 1);
              }}
              disabled={!canNextPage}
            />
            <Pagination.Last
              onClick={() => {
                gotoPage(pageOptions.length - 1);
                setCurrentPage(pageOptions.length - 1);
              }}
              disabled={!canNextPage}
            />
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default DataTable;
