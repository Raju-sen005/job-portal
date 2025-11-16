import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo-cwp.png";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    function setupDropdown(toggleId, dropdownId) {
      const toggle = document.getElementById(toggleId);
      const dropdown = document.getElementById(dropdownId);
      let isOpen = false;

      if (!toggle || !dropdown) return;

      const toggleHandler = (event) => {
        event.stopPropagation();
        if (!isOpen) {
          dropdown.style.display = "block";
          dropdown.classList.remove("fade-out");
          dropdown.classList.add("show");
          isOpen = true;
        } else {
          dropdown.classList.add("fade-out");
          setTimeout(() => {
            dropdown.style.display = "none";
            dropdown.classList.remove("show", "fade-out");
            isOpen = false;
          }, 300);
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
            dropdown.style.display = "none";
            dropdown.classList.remove("show", "fade-out");
            isOpen = false;
          }, 300);
        }
      };

      toggle.addEventListener("click", toggleHandler);
      document.addEventListener("click", outsideClickHandler);

      return () => {
        toggle.removeEventListener("click", toggleHandler);
        document.removeEventListener("click", outsideClickHandler);
      };
    }

    setupDropdown("notificationToggle", "notificationDropdown");
  }, [notifications]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token"); // ya jo bhi login me save kiya ho
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, []);
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

    // Initialize dropdowns
    setupDropdown("profileToggleDesktop", "profileDropdownDesktop");
    setupDropdown("profileToggleMobile", "profileDropdownMobile");
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-white d-none d-lg-flex">
      <div className="container">
        {/* Left: Logo */}
        <NavLink className="navbar-brand d-flex align-items-center pe-3" to="/">
          <img src={logo} alt="Logo" height={"55px"} />
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
                to="/Job"
              >
                Work Opportunities
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/Profile/:id"
              >
                Profile
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right: Buttons */}
        <div className="d-flex align-items-center gap-lg-4 gap-2">
          <div className="dropdown position-relative">
            {/* Bell Icon */}
            <div
              id="notificationToggle"
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
            >
              <i className="far fa-bell fs-5 bell-icon"></i>
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}
            </div>

            {/* Dropdown Menu */}
            <ul
              id="notificationDropdown"
              className="dropdown-menu dropdown-menu-custom shadow m-2"
              style={{ display: "none" }}
            >
              {notifications.length === 0 ? (
                <li className="dropdown-item">No new notifications</li>
              ) : (
                notifications.map((n) => (
                  <li
                    key={n.id}
                    className="dropdown-item d-flex align-items-center gap-2"
                  >
                    {n.user?.profileImage && (
                      <img
                        src={`http://localhost:5000/uploads/${n.user.profileImage}`}
                        alt="user"
                        className="rounded-circle"
                        style={{ width: "30px", height: "30px" }}
                      />
                    )}
                    <div>
                      {n.message}
                      <br />
                      <small>{new Date(n.createdAt).toLocaleString()}</small>
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
              {profile?.profileImage && (
                <img
                  src={`http://localhost:5000/uploads/${profile.profileImage}`}
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
                  to="/profile/:id"
                >
                  <i className="bi bi-person"></i> Profile
                </Link>
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center gap-3"
                  href="/change-password"
                >
                  <i className="bi bi-key"></i> Password Change
                </a>
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
