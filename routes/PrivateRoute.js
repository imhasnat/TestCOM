"use client";

import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user]);

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      {user ? children : null}
      <AuthModal show={showAuthModal} handleClose={handleAuthModalClose} />
    </>
  );
};

export default PrivateRoute;
