// import type { Metadata } from "next";
"use client";
import { Inter } from "next/font/google";
import { CartProvider } from "contexts/CartContext";
import { AuthProvider } from "contexts/AuthContext";
import CustomNavbar from "components/Client/Common/CustomNavbar";
import Footer from "components/Client/Common/Footer";
import { LoadingProvider, useLoading } from "contexts/LoadingContext";
import { useEffect } from "react";
import { initializeApiClient } from "api/service/apiClient";
import { ToastContainer } from "node_modules/react-toastify/dist";
import { WishlistProvider } from "contexts/WishlistContext";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "BHE-com Application",
//   description: "BHE-com Application",
// };

function InitializeApi({ children }) {
  const { setLoading } = useLoading();

  useEffect(() => {
    initializeApiClient(setLoading);
  }, [setLoading]);

  return children;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingProvider>
          <InitializeApi>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <ToastContainer
                    autoClose={1500}
                    position="top-center"
                    pauseOnFocusLoss={false}
                    hideProgressBar={true}
                    pauseOnHover={false}
                  />
                  <CustomNavbar />
                  {children}
                  <Footer />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </InitializeApi>
        </LoadingProvider>
      </body>
    </html>
  );
}
