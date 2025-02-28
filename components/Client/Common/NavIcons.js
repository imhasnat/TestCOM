"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dropdown } from "react-bootstrap";
import CartModal from "../Cart/CartModal";
import "../Cart/cart-modal.css";
import { useCart } from "contexts/CartContext";
import { IoMdHeartEmpty } from "react-icons/io";
import { useWishlist } from "contexts/WishlistContext";
import { useRouter } from "next/navigation";

const NavIcons = () => {
  const [showCartModal, setShowCartModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const router = useRouter();

  // Only render counts after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWishlistClick = () => {
    router.push("/wishlist"); // Redirect to the wishlist page
  };

  return (
    <div className="d-flex align-items-center gap-4 lg:gap-6">
      {/* Wishlist Button */}
      <div
        onClick={handleWishlistClick}
        style={{ cursor: "pointer", position: "relative" }}
      >
        <div>
          <IoMdHeartEmpty size={24} />
          {mounted && (
            <div
              className="position-absolute w-6 h-6 bg-danger rounded-circle text-white d-flex align-items-center justify-content-center"
              style={{
                top: "-5px",
                left: "15px",
                minWidth: "20px",
                height: "20px",
                transform: "translate(0%, -10%)",
                fontSize: "12px",
              }}
            >
              {getWishlistCount()}
            </div>
          )}
        </div>
      </div>

      {/* Cart Dropdown */}
      <Dropdown>
        <Dropdown.Toggle
          variant="light"
          className="ps-0"
          id="cart-dropdown"
          onClick={() => setShowCartModal(true)}
        >
          <div className="relative">
            <Image src="/cart.png" alt="" width={22} height={22} />
            {mounted && (
              <div
                className="position-absolute top-0 end-0 w-6 h-6 bg-danger rounded-circle text-white d-flex align-items-center justify-content-center"
                style={{
                  minWidth: "20px",
                  height: "20px",
                  transform: "translate(0%, -10%)",
                  fontSize: "12px",
                }}
              >
                {getCartCount()}
              </div>
            )}
          </div>
        </Dropdown.Toggle>
        {/* Add Cart-specific dropdown content here if needed */}
      </Dropdown>

      {/* Cart Modal */}
      <CartModal show={showCartModal} onHide={() => setShowCartModal(false)} />
    </div>
  );
};

export default NavIcons;
