"use client";
// import node module libraries
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "styles/theme.scss";
// import "bootstrap/dist/css/bootstrap.min.css";

// import sub components
import NavbarVertical from "/layouts/navbars/NavbarVertical";
import NavbarTop from "/layouts/navbars/NavbarTop";

export default function DashboardLayout({ children }) {
  const [showMenu, setShowMenu] = useState(true);
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };

  return (
    <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
      <div className="navbar-vertical navbar">
        <NavbarVertical
          showMenu={showMenu}
          onClick={(value) => setShowMenu(value)}
        />
      </div>
      <div id="page-content">
        <div className="header">
          <NavbarTop
            data={{
              showMenu: showMenu,
              SidebarToggleMenu: ToggleMenu,
            }}
          />
        </div>
        {children}
      </div>
      <ToastContainer
        autoClose={1500}
        position="top-center"
        pauseOnFocusLoss={false}
        hideProgressBar={true}
        pauseOnHover={false}
      />
    </div>
  );
}
