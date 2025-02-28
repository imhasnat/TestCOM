import Image from "node_modules/next/image";
import { Card, Col, Container, Row } from "node_modules/react-bootstrap/esm";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getWishlistByWishlistId } from "api/wishlist/wishlistApi";

const SharedWishlist = () => {
  const searchParams = useSearchParams();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      const wishlistId = searchParams?.get("id");
      console.log(wishlistId);

      if (!wishlistId) {
        setError("Invalid wishlist ID");
        setLoading(false);
        return;
      }

      try {
        const response = await getWishlistByWishlistId(wishlistId);
        console.log(response.data);
        setWishlistItems(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error loading wishlist");
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [searchParams]);

  if (loading) {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading wishlist...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Card>
          <div className="text-center p-5">
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </Card>
      </Container>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Container className="py-5">
        <Card>
          <div className="text-center p-5">
            <h3 className="text-xl font-bold mb-2">Wishlist is empty</h3>
            <p>This wishlist has no items.</p>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          Shared Wishlist ({wishlistItems.length} items)
        </h2>
      </div>

      <div className="space-y-4">
        {wishlistItems?.map((item) => (
          <Card key={item.productID}>
            <div className="p-4">
              <Row className="items-center align-items-center">
                <Col xs={12} md={3}>
                  <div className="relative aspect-square">
                    <Image
                      width={150}
                      height={150}
                      src={item.image}
                      alt={item.productName}
                      className="object-fit-contain rounded-md"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                </Col>
                <Col xs={12} md={5}>
                  <div className="space-y-2">
                    <h4 className="  font-semibold">{item.productName}</h4>
                    <p className="fs-3 text-dark">
                      <b>Tk {item.price.toLocaleString()}</b>
                    </p>
                  </div>
                </Col>

                <Col xs={12} md={3}>
                  <div className="space-y-2">
                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default SharedWishlist;
