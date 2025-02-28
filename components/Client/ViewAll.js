"use client";
import Link from "next/link";
import { Button } from "react-bootstrap";

const ViewAll = () => {
  return (
    <div className="d-flex justify-content-center mt-4">
      <Link href={"/products"}>
        <Button className="w-auto view-button">View All</Button>
      </Link>
    </div>
  );
};

export default ViewAll;
