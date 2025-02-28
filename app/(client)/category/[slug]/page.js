"use client";
import CategoryByProducts from "components/Client/Product/CategoryByProducts";

export default function Page({ params }) {
  const { slug } = params;

  if (!slug) {
    return <ErrorMessage message="Invalid URL" />;
  }

  // Extract the category ID from the end of the slug
  const categoryID = slug.split("__").pop();

  if (!categoryID) {
    return <ErrorMessage message="Category ID not found" />;
  }

  return (
    <div className="container px-4 py-10">
      <CategoryByProducts categoryID={categoryID} />
    </div>
  );
}

// Error message component for better reusability
const ErrorMessage = ({ message }) => (
  <div className="px-4 my-6">
    <div className="text-center text-danger">{message}</div>
  </div>
);
