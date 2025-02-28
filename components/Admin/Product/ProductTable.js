import React from "react";
import { useEffect, useState } from "react";
import { Card, Button, Modal, Container } from "react-bootstrap";
import Link from "next/link";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import DataTable from "components/Admin/Common/DataTable";
import { useRouter } from "next/navigation";
import { getAllProducts } from "api/product/productApi";

const ProductTable = () => {
  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProducts();
        const transformedData = response.data.map((product) => ({
          id: product.productID,
          productName: product.productName || "N/A",
          sellerName: product.sellerName || "N/A",
          price: product.price || "N/A",
          stock: product.stock || "N/A",
          categoryName: product.categoryName || "N/A",
          brandName: product.brandName || "N/A",
        }));
        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (id) => {
    navigate.push(`/product/product-form?id=${id}`);
    console.log(`Edit item with ID: ${id}`);
  };

  const handleDeleteClick = (id) => {
    console.log(id);
    return;
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setData((prevData) => prevData.filter((store) => store.id !== deleteId));
    setShowDeleteModal(false);
  };

  const columns = [
    { Header: "Product Name", accessor: "productName" },
    { Header: "Seller Name", accessor: "sellerName" },
    { Header: "Price", accessor: "price" },
    { Header: "Stock", accessor: "stock" },
    { Header: "Category", accessor: "categoryName" },
    { Header: "Brand", accessor: "brandName" },
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
  ];

  return (
    <div className="mt-5 px-5">
      <Card className="p-4 shadow-lg">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Product List</h2>
          <Link href="/product/product-form">
            <Button variant="primary">Add Product</Button>
          </Link>
        </div>

        {loading ? (
          <>
            <Container className="my-20 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </Container>
          </>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <DataTable
            data={data}
            columns={columns}
            pageIndex={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this store?</Modal.Body>
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

export default ProductTable;
