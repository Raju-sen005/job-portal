import React, { useState, useEffect } from "react";
import logo from "../assets/images/cwp-black.png";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);

  // ✅ Fetch company info
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/company/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompany(res.data);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, []);

  // ✅ Fetch all company applications
  useEffect(() => {
    const controller = new AbortController();

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // 🛑 Agar token missing hai, skip request

        const res = await axios.get(
          "http://localhost:5000/api/application/company/all",
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        // ✅ Safely filter only unread applications
        const unread = Array.isArray(res.data.applications)
          ? res.data.applications.filter((app) => !app.read)
          : [];

        setApplications(unread);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching applications:", error);
        }
      }
    };

    fetchApplications();
    const interval = setInterval(fetchApplications, 30000); // 30 sec refresh

    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, []);

  // ✅ Dropdown setup function
  useEffect(() => {
    function setupDropdown(toggleId, dropdownId) {
      const toggle = document.getElementById(toggleId);
      const dropdown = document.getElementById(dropdownId);
      let isOpen = false;

      if (!toggle || !dropdown) return;

      const toggleHandler = (event) => {
        event.stopPropagation();
        if (!isOpen) {
          dropdown.classList.remove("fade-out");
          dropdown.classList.add("show");
          isOpen = true;
        } else {
          dropdown.classList.add("fade-out");
          setTimeout(() => {
            dropdown.classList.remove("show", "fade-out");
            isOpen = false;
          }, 500);
        }
      };

      const outsideClickHandler = (event) => {
        if (
          isOpen &&
          !dropdown.contains(event.target) &&
          !toggle.contains(event.target)
        ) {
          dropdown.classList.add("fade-out");
          setTimeout(() => {
            dropdown.classList.remove("show", "fade-out");
            isOpen = false;
          }, 500);
        }
      };

      toggle.addEventListener("click", toggleHandler);
      document.addEventListener("click", outsideClickHandler);

      return () => {
        toggle.removeEventListener("click", toggleHandler);
        document.removeEventListener("click", outsideClickHandler);
      };
    }

    setupDropdown("profileToggleDesktop", "profileDropdownDesktop");
    setupDropdown("notificationToggle", "notificationDropdown");
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-white d-none d-lg-flex shadow-sm">
      <div className="container">
        {/* Left: Logo */}
        <NavLink className="navbar-brand d-flex align-items-center pe-3" to="/">
          <img src={logo} alt="Logo" height="55px" />
        </NavLink>

        {/* Center: Nav Links */}
        <div
          className="collapse navbar-collapse justify-content-start"
          id="navbarContentDesktop"
        >
          <ul className="navbar-nav mb-2 mb-lg-0 gap-lg-4 fs-6">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/dashboard"
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/my-jobs"
              >
                My Jobs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/application"
              >
                Application
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/company-profile"
              >
                Company
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right: Buttons */}
        <div className="d-flex align-items-center gap-lg-4 gap-2">
          {/* Create Job Button */}
          <button className="btn-create-job d-flex align-items-center gap-2 px-2 py-1">
            <Link
              to="/create-job"
              className="text-decoration-none text-primary-dark"
            >
              <i className="fas fa-plus me-2"></i>Create Job
            </Link>
          </button>

          {/* Notification Bell */}
          <div className="position-relative dropdown">
            <i
              id="notificationToggle"
              className="far fa-bell fs-5 bell-icon"
              style={{ cursor: "pointer" }}
            ></i>
            {applications.length > 0 && (
              <span className="notification-badge">{applications.length}</span>
            )}

            <ul
              id="notificationDropdown"
              className="dropdown-menu dropdown-menu-custom shadow m-2"
            >
              {applications.length === 0 ? (
                <li className="dropdown-item">No new applications</li>
              ) : (
                applications.map((app) => (
                  <li
                    key={app.id}
                    className="dropdown-item d-flex align-items-center gap-2"
                  >
                    {app.User?.Profile?.profileImage && (
                      <img
                        src={`http://localhost:5000/uploads/${app.User.Profile.profileImage}`}
                        alt="user"
                        className="rounded-circle"
                        style={{ width: "30px", height: "30px" }}
                      />
                    )}
                    <div>
                      <strong>{app.User?.name}</strong> applied for{" "}
                      <em>{app.Job?.title}</em>
                      <br />
                      <small>{new Date(app.createdAt).toLocaleString()}</small>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <div
              id="profileToggleDesktop"
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
            >
              {company?.companyLogo && (
                <img
                  src={`http://localhost:5000/uploads/${company.companyLogo}`}
                  className="rounded-circle object-fit-cover nav-profile-img"
                  style={{ width: "30px", height: "30px" }}
                  alt="Company Logo"
                />
              )}
              <i className="fas fa-chevron-down dropdown-icon"></i>
            </div>

            <ul
              id="profileDropdownDesktop"
              className="dropdown-menu dropdown-menu-custom shadow m-2"
            >
              <li>
                <Link
                  className="dropdown-item d-flex align-items-center gap-3"
                  to="/profile"
                >
                  <i className="bi bi-person"></i> Profile
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item d-flex align-items-center gap-3"
                  to="/change-password"
                >
                  <i className="bi bi-key"></i> Password Change
                </Link>
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center gap-3"
                  href="#"
                >
                  <i className="bi bi-gem"></i> My Subscriptions
                </a>
              </li>
              <li>
                <hr className="dropdown-divider mx-3" />
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center gap-3"
                  href="/"
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
