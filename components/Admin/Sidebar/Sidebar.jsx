"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import adminTTE from "/dist/img/AdminLTELogo.png";
import user2 from "/dist/img/user2-160x160.jpg";
import Link from "next/link";
import "../../../app/globals.css";

const Sidebar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* <div className="brand-link">
        <Image
          width={300}
          height={300}
          src={adminTTE}
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
        />
        <span className="brand-text font-weight-light">AdminLTE 3</span>
      </div> */}

      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <Image
              width={300}
              height={300}
              src={user2}
              className="img-circle elevation-2"
              alt="User Image"
            />
          </div>
          <div className="info">
            <Link href="/" className="d-block">
              ByteHeart
            </Link>
          </div>
        </div>

        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw"></i>
              </button>
            </div>
          </div>
        </div>

        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item menu-open">
              <Link href="#" className="nav-link active">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>
                  Dashboard
                  {/* <i className="right fas fa-angle-left"></i> */}
                </p>
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link href="pages/widgets.html" className="nav-link">
                <i className="nav-icon fas fa-th"></i>
                <p>
                  Widgets
                  <span className="right badge badge-danger">New</span>
                </p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon fas fa-copy"></i>
                <p>
                  Layout Options
                  <i className="fas fa-angle-left right"></i>
                  <span className="badge badge-info right">6</span>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="pages/layout/top-nav.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Top Navigation</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/layout/top-nav-sidebar.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Top Navigation + Sidebar</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/layout/boxed.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Boxed</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/layout/fixed-sidebar.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Fixed Sidebar</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/layout/fixed-sidebar-custom.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>
                      Fixed Sidebar <small>+ Custom Area</small>
                    </p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/layout/fixed-topnav.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Fixed Navbar</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/layout/fixed-footer.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Fixed Footer</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/layout/collapsed-sidebar.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Collapsed Sidebar</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon fas fa-chart-pie"></i>
                <p>
                  Charts
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="pages/charts/chartjs.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>ChartJS</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/charts/flot.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Flot</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/charts/inline.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Inline</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/charts/uplot.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>uPlot</p>
                  </Link>
                </li>
              </ul>
            </li> */}
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon fas fa-tree"></i>
                <p>
                  UI Elements
                  <i className="fas fa-angle-left right"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="/admin/ui/general" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>General</p>
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link href="pages/UI/icons.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Icons</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/UI/buttons.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Buttons</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/UI/sliders.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Sliders</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/UI/modals.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Modals & Alerts</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/UI/navbar.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Navbar & Tabs</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/UI/timeline.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Timeline</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/UI/ribbons.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Ribbons</p>
                  </Link>
                </li> */}
              </ul>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon fas fa-edit"></i>
                <p>
                  Forms
                  <i className="fas fa-angle-left right"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="/admin/forms/page-form" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Page </p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/forms/page-form" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Page Form</p>
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link href="pages/forms/general.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>General Elements</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/forms/general.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>General Elements</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/forms/advanced.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Advanced Elements</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/forms/editors.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Editors</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/forms/validation.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Validation</p>
                  </Link>
                </li> */}
              </ul>
            </li>
            {/* <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon fas fa-table"></i>
                <p>
                  Tables
                  <i className="fas fa-angle-left right"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="pages/tables/simple.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Simple Tables</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/tables/data.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>DataTables</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/tables/jsgrid.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>jsGrid</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-header">EXAMPLES</li>
            <li className="nav-item">
              <Link href="pages/calendar.html" className="nav-link">
                <i className="nav-icon far fa-calendar-alt"></i>
                <p>
                  Calendar
                  <span className="badge badge-info right">2</span>
                </p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="pages/gallery.html" className="nav-link">
                <i className="nav-icon far fa-image"></i>
                <p>Gallery</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="pages/kanban.html" className="nav-link">
                <i className="nav-icon fas fa-columns"></i>
                <p>Kanban Board</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon far fa-envelope"></i>
                <p>
                  Mailbox
                  <i className="fas fa-angle-left right"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="pages/mailbox/mailbox.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Inbox</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/mailbox/compose.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Compose</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/mailbox/read-mail.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Read</p>
                  </Link>
                </li>
              </ul>
            </li> */}
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon fas fa-book"></i>
                <p>
                  Pages
                  <i className="fas fa-angle-left right"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="pages/examples/invoice.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Invoice</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/examples/profile.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Profile</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/examples/e-commerce.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>E-commerce</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/examples/projects.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Projects</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/examples/project-add.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Project Add</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/examples/project-edit.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Project Edit</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/examples/project-detail.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Project Detail</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/examples/contacts.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Contacts</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/examples/faq.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>FAQ</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/examples/contact-us.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Contact us</p>
                  </Link>
                </li>
              </ul>
            </li>
            {/* <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon far fa-plus-square"></i>
                <p>
                  Extras
                  <i className="fas fa-angle-left right"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>
                      Login & Register v1
                      <i className="fas fa-angle-left right"></i>
                    </p>
                  </Link>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <Link
                        href="pages/examples/login.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Login v1</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="pages/examples/register.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Register v1</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="pages/examples/forgot-password.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Forgot Password v1</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="pages/examples/recover-password.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Recover Password v1</p>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>
                      Login & Register v2
                      <i className="fas fa-angle-left right"></i>
                    </p>
                  </Link>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <Link
                        href="pages/examples/login-v2.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Login v2</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="pages/examples/register-v2.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Register v2</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="pages/examples/forgot-password-v2.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Forgot Password v2</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="pages/examples/recover-password-v2.html"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Recover Password v2</p>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/examples/lockscreen.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Lockscreen</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/examples/legacy-user-menu.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Legacy User Menu</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="pages/examples/language-menu.html"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Language Menu</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/examples/404.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Error 404</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/examples/500.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Error 500</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/examples/pace.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Pace</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/examples/blank.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Blank Page</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="starter.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Starter Page</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon fas fa-search"></i>
                <p>
                  Search
                  <i className="fas fa-angle-left right"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="pages/search/simple.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Simple Search</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="pages/search/enhanced.html" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Enhanced</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-header">MISCELLANEOUS</li>
            <li className="nav-item">
              <Link href="iframe.html" className="nav-link">
                <i className="nav-icon fas fa-ellipsis-h"></i>
                <p>Tabbed IFrame Plugin</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="https://adminlte.io/docs/3.1/" className="nav-link">
                <i className="nav-icon fas fa-file"></i>
                <p>Documentation</p>
              </Link>
            </li>
            <li className="nav-header">MULTI LEVEL EXAMPLE</li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="fas fa-circle nav-icon"></i>
                <p>Level 1</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon fas fa-circle"></i>
                <p>
                  Level 1<i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Level 2</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>
                      Level 2<i className="right fas fa-angle-left"></i>
                    </p>
                  </Link>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <Link href="#" className="nav-link">
                        <i className="far fa-dot-circle nav-icon"></i>
                        <p>Level 3</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="#" className="nav-link">
                        <i className="far fa-dot-circle nav-icon"></i>
                        <p>Level 3</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="#" className="nav-link">
                        <i className="far fa-dot-circle nav-icon"></i>
                        <p>Level 3</p>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link href="#" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Level 2</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="fas fa-circle nav-icon"></i>
                <p>Level 1</p>
              </Link>
            </li>
            <li className="nav-header">LABELS</li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon far fa-circle text-danger"></i>
                <p className="text">Important</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon far fa-circle text-warning"></i>
                <p>Warning</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <i className="nav-icon far fa-circle text-info"></i>
                <p>Informational</p>
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
