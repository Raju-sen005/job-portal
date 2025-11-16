import React, { useState } from "react";
import profile from "../assets/images/profile.png";
import Footer from "./Footer";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    navigate(
      `/jobs?search=${encodeURIComponent(
        search
      )}&experience=${encodeURIComponent(
        experience
      )}&salary=${encodeURIComponent(salary)}&location=${encodeURIComponent(
        location
      )}`
    );
  };

  return (
    <>
      <Header />

      {/* Search Section */}
      <section>
        <div className="container pt-4 px-0 find-job">
          <div className="pt-4">
            <h1 className="fs-4 fw-bold text-black">Find a job with Us</h1>
            <p className="text-dark">
              Experience the benefits of candidate Tracking management and
              Forecasting
            </p>
          </div>

          <div className="row pb-4">
            <div className="col-md-4">
              <div className="input-group">
                <span
                  className="input-group-text bg-white border-end-0"
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Job title, keywords, or company"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Experience Level"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Salary estimate"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <div className="col-md-4" style={{ width: "23%" }}>
              <input
                type="text"
                className="form-control"
                placeholder="City, State, or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="col-md-4" style={{ width: "10%" }}>
              <button
                type="button"
                className="form-control"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Career Profile Section */}
      <section className="bg-user-profile pb-4">
        <div className="container">
          <div className="row bg-white rounded shadow-sm p-5 mt-4">
            <div className="col-md-6">
              <div className="d-flex gap-4 align-items-center">
                <div
                  className="position-relative"
                  style={{ width: "100%", height: "100%" }}
                >
                  <svg width="100" height="100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#e0e0e0"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#1A2FE7"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray="282.6"
                      strokeDashoffset="211.95"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="position-absolute translate-middle top-start fw-bold">
                    25%
                  </div>
                </div>

                <div>
                  <h4 className="fw-bold">Complete Career Profile</h4>
                  <p className="text-muted mb-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Morbi sagittis, elit vitae hendrerit fringilla, mauris ipsum
                    faucibus magna.
                  </p>

                  <a
                    href="/profile-complete"
                    className="btn my-btn text-dark fw-semibold"
                  >
                    Complete My Career Profile
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-6 text-center">
              <img src={profile} alt="Profile Illustration" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Dashboard;
