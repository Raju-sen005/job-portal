import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function CreateJob() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    jobType: "",
    experienceLevel: "",
    salaryFrom: "",
    salaryTo: "",
    jobLocation: "",
    email: "",
    tags: [""],
    tagInput: "",
    description: "",
    benefits: [""],
    benefitInput: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Tags handle
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = formData.tagInput.trim();
      if (value && !formData.tags.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, value],
          tagInput: "",
        }));
      } else {
        setFormData((prev) => ({ ...prev, tagInput: "" }));
      }
    }
  };

  // Benefits handle
  const handleBenefitKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = formData.benefitInput.trim();
      if (value && !formData.benefits.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          benefits: [...prev.benefits, value],
          benefitInput: "",
        }));
      } else {
        setFormData((prev) => ({ ...prev, benefitInput: "" }));
      }
    }
  };

  const handleSubmit = async () => {
    const payload = {
      title: formData.jobTitle,
      department: formData.department,
      type: formData.jobType,
      experienceLevel: formData.experienceLevel,
      salaryFrom: formData.salaryFrom,
      salaryTo: formData.salaryTo,
      location: formData.jobLocation,
      email: formData.email,
      tags: formData.tags,
      description: formData.description,
      benefits: formData.benefits,
    };
console.log("Payload sent to backend:", payload);

    try {
        const token = localStorage.getItem("token"); 
      const response = await axios.post(
        "http://localhost:5000/api/jobs",
        payload,
        { headers: { "Content-Type": "application/json" ,
            Authorization: `Bearer ${token}`, // ✅ token add kiya
        } }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Job saved successfully!");
        setFormData({
          jobTitle: "",
          department: "",
          jobType: "",
          experienceLevel: "",
          salaryFrom: "",
          salaryTo: "",
          jobLocation: "",
          email: "",
          tags: [],
          tagInput: "",
          description: "",
          benefits: [],
          benefitInput: "",
        });
      }
    } catch (error) {
      console.error("AxiosError:", error.response || error);
      alert("Error saving job! Check console for details.");
    }
  };

  return (
    <>
      <Header />
      <section>
        <div className="container">
          <div className="mt-5">
            <h2 className="fs-4 fw-bold" style={{ color: "#212529" }}>
              Company Create Job
            </h2>
            <p className="fw-light fs-small">Create job with details.</p>
          </div>

          <div className="row">
            <div className="col-md-3">
              <ul className="nav flex-column" id="sideMenu">
                <li className="nav-item">
                  <a
                    className="nav-link ps-0 text-dark"
                    aria-current="page"
                    href="#job-title"
                    style={{ top: "20px" }}
                  >
                    Job title & department details
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link ps-0 text-dark" href="#job-details">
                    Job Details & Responsivities
                  </a>
                </li>
              </ul>
            </div>

            <div
              className="col-md-9"
              id="scrollArea"
              data-bs-spy="scroll"
              data-bs-target="#sideMenu"
              data-bs-offset="100"
              data-bs-smooth-scroll="true"
              tabIndex="0"
              style={{ height: "100vh", overflowY: "auto" }}
            >
              {/* Job Title & Department */}
              <div className="job-title" id="job-title">
                <h4 className="fs-4 text-dark mb-4">
                  Job Title & Department Details
                </h4>
                <form className="row g-4 small">
                  <div className="col-12">
                    <label htmlFor="jobTitle" className="form-label">
                      Job Title
                    </label>
                    <input
                      type="text"
                      className="form-control bg-gray rounded-0"
                      id="jobTitle"
                      name="jobTitle"
                      placeholder="Job Title"
                      value={formData.jobTitle}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="department" className="form-label">
                      Department
                    </label>
                    <input
                      type="text"
                      className="form-control bg-gray rounded-0"
                      id="department"
                      name="department"
                      placeholder="Department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="jobType" className="form-label">
                      Job Type
                    </label>
                    <input
                      type="text"
                      className="form-control bg-gray rounded-0"
                      id="jobType"
                      name="jobType"
                      placeholder="Job Type"
                      value={formData.jobType}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="experienceLevel" className="form-label">
                      Experience Level
                    </label>
                    <input
                      type="text"
                      className="form-control bg-gray rounded-0"
                      id="experienceLevel"
                      name="experienceLevel"
                      placeholder=" Experience Level"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 d-flex align-items-end">
                    <div className="w-50 pe-2">
                      <label htmlFor="salaryFrom" className="form-label">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="salaryFrom"
                        name="salaryFrom"
                        placeholder="30,000"
                        value={formData.salaryFrom}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="w-50 ps-2">
                      <label
                        htmlFor="salaryTo"
                        className="form-label invisible"
                      >
                        To
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="salaryTo"
                        name="salaryTo"
                        placeholder="50,000"
                        value={formData.salaryTo}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="jobLocation" className="form-label">
                      Job Location
                    </label>
                    <input
                      type="text"
                      className="form-control bg-gray rounded-0"
                      id="jobLocation"
                      name="jobLocation"
                      placeholder="Job Location"
                      value={formData.jobLocation}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      className="form-control bg-gray rounded-0"
                      id="email"
                      name="email"
                      placeholder="Enter contact email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Tags */}
                  <div className="col-md-6">
                    <label htmlFor="tags" className="form-label">
                      Tags
                    </label>
                    <div
                      className="form-control d-flex flex-wrap align-items-center gap-1"
                      style={{ minHeight: "45px", cursor: "text" }}
                      onClick={() =>
                        document.getElementById("tagInput").focus()
                      }
                    >
                      {formData.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="badge bg-gray text-dark border fw-light rounded-0 d-flex align-items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            className="btn-close btn-close-black btn-sm ms-1"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                tags: prev.tags.filter(
                                  (_, index) => index !== i
                                ),
                              }))
                            }
                          ></button>
                        </span>
                      ))}
                      <input
                        id="tagInput"
                        type="text"
                        className="border-0 flex-grow-1"
                        style={{ minWidth: "100px", outline: "none" }}
                        placeholder="Type tag and press Enter or ,"
                        value={formData.tagInput || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tagInput: e.target.value,
                          }))
                        }
                        onKeyDown={handleTagKeyDown}
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Job Details & Benefits */}
              <div className="job-details pt-4" id="job-details">
                <h4 className="fs-4 text-dark mb-3">
                  Job Details & Responsivities
                </h4>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Job Details & Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="6"
                    placeholder="Enter a description"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="benefits" className="form-label">
                    Benefits
                  </label>
                  <div className="border p-2 align-items-center">
                    {formData.benefits.map((benefit, i) => (
                      <span
                        key={i}
                        className="badge bg-gray text-dark border fw-light rounded-0 me-1"
                      >
                        {benefit}{" "}
                        <button
                          type="button"
                          className="btn-close btn-close-black rounded-0 btn-sm ms-1"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              benefits: prev.benefits.filter(
                                (_, index) => index !== i
                              ),
                            }))
                          }
                        ></button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="border-0 mt-2"
                      style={{ outline: "none" }}
                      placeholder="Add new benefit and press Enter or ,"
                      value={formData.benefitInput || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          benefitInput: e.target.value,
                        }))
                      }
                      onKeyDown={handleBenefitKeyDown}
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Save Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default CreateJob;
