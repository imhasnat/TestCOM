import React from "react";
import { useEffect, useState } from "react";
import { Card, Button, Modal, Container } from "react-bootstrap";
import Link from "next/link";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import DataTable from "components/Admin/Common/DataTable";
import { useRouter } from "next/navigation";
import { getAllStore } from "api/store/storeApi";

const StoreTable = () => {
  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useRouter();

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllStore();

        const transformedData = response.data.map((store) => ({
          id: store.storeID,
          storeName: store.storeName || "N/A",
          agencyName: store.agencyName || "N/A",
          contactPerson: store.contactPerson || "N/A",
          contactPhone: store.contactPhone || "N/A",
          address: {
            line1: store.addressLine || "N/A",
            city: store.city || "N/A",
            state: store.state || "N/A",
            zip: store.zipCode || "N/A",
            country: store.country || "N/A",
          },
          userName: store.userName || "N/A",
          description: store.description || "N/A",
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

  // Handle Edit button click
  const handleEditClick = (id) => {
    navigate.push(`/store/store-form?storeId=${id}`);
    console.log(`Edit item with ID: ${id}`);
  };

  // Handle Delete button click to open confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    setData((prevData) => prevData.filter((store) => store.id !== deleteId));
    setShowDeleteModal(false);
  };

  const columns = [
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
  ];

  return (
    <div className="mt-5 px-5">
      <Card className="p-4 shadow-lg">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Store List</h2>
          <Link href="/store/store-form">
            <Button variant="primary">Add Store</Button>
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

      {/* Delete Confirmation Modal */}
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

export default StoreTable;
