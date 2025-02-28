"use client";
import { useState, useMemo } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  InputGroup,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaSearch, FaSort } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Dummy data for the table
const dummyData = [
  {
    id: 1,
    storeName: "Store One",
    agencyName: "Agency One",
    contactPerson: "John Doe",
    contactEmail: "john@example.com",
    contactPhone: "+1234567890",
    addressType: "Office",
    address: {
      line1: "123 Main St",
      city: "Anytown",
      state: "NY",
      zip: "12345",
      country: "USA",
    },
    userName: "jdoe",
    description: "This is a store description.",
    brandName: "Brand A",
    categoryName: "Category X",
  },
  {
    id: 2,
    storeName: "Store Two",
    agencyName: "Agency Two",
    contactPerson: "Jane Smith",
    contactEmail: "jane@example.com",
    contactPhone: "+0987654321",
    addressType: "Warehouse",
    address: {
      line1: "456 Another St",
      city: "Othertown",
      state: "CA",
      zip: "67890",
      country: "USA",
    },
    userName: "jsmith",
    description: "Another store description.",
    brandName: "Brand B",
    categoryName: "Category Y",
  },
  // More dummy data here...
];

const DataTable = () => {
  const [data, setData] = useState(dummyData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useRouter();
  // Define columns (move this before using it in useMemo)
  const columns = useMemo(
    () => [
      {
        Header: "Store Name",
        accessor: "storeName",
      },
      {
        Header: "Agency Name",
        accessor: "agencyName",
      },
      {
        Header: "Contact Person",
        accessor: "contactPerson",
      },
      {
        Header: "Contact Phone",
        accessor: "contactPhone",
      },
      {
        Header: "Address",
        accessor: (row) =>
          `${row.address.line1}, ${row.address.city}, ${row.address.state} ${row.address.zip}, ${row.address.country}`,
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center align-items-center">
            <Button
              variant="warning"
              size="sm"
              className="mx-2"
              onClick={() => handleEditClick(row.original.id)}
            >
              <FaEdit />
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="mx-2"
              onClick={() => handleDeleteClick(row.original.id)}
            >
              <FaTrashAlt />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const tableData = useMemo(() => data, [data]);

  // Table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns: columns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Handle Delete button click
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Confirm delete and call delete API
  const confirmDelete = () => {
    setData((prevData) => prevData.filter((item) => item.id !== deleteId));
    setShowDeleteModal(false);
  };

  // Handle Edit button click
  const handleEditClick = (id) => {
    navigate.push("/forms/store-form");
    console.log(`Edit item with ID: ${id}`);
  };

  return (
    <div className="mt-5 px-5">
      <Card className="p-4 shadow-lg">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Store List</h2>
          <Link href="/forms/store-form">
            <Button variant="primary" type="submit">
              Add Store
            </Button>
          </Link>
        </div>
        {/* Search Bar */}
        <Row className=" ">
          <Col sm={5}>
            <InputGroup
              className="mb-3"
              style={{ minWidth: "100px", width: "100%" }}
            >
              <Form.Control
                placeholder="Search by Store, Agency, Contact..."
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col xs={4} sm={2} md={1}>
            <Form.Select
              className="mb-3"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{ width: "85px" }}
            >
              {[10, 20, 30].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Data Table */}
        <Table
          striped
          bordered
          hover
          responsive
          className="modern-table"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    key={i}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
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
                        // Always show the sort icon even when not sorted
                        <>
                          <FaSort style={{ transform: "rotate(0deg)" }} />
                        </>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr key={i} {...row.getRowProps()}>
                  {row.cells.map((cell, i) => (
                    <td key={i} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* Pagination Controls and Page Size Selection */}
        <Row className="align-items-center mt-3">
          <Col>
            <Pagination className="justify-content-center">
              <Pagination.First
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              />
              <Pagination.Prev
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              />
              {pageOptions.map((pageNumber) => (
                <Pagination.Item
                  key={pageNumber}
                  active={pageNumber === pageIndex}
                  onClick={() => gotoPage(pageNumber)}
                >
                  {pageNumber + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => nextPage()}
                disabled={!canNextPage}
              />
              <Pagination.Last
                onClick={() => gotoPage(pageOptions.length - 1)}
                disabled={!canNextPage}
              />
            </Pagination>
          </Col>
        </Row>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DataTable;
