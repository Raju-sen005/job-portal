import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function CreateProfile({ userId }) {
  const [userName, setUserName] = useState("");
  const [preview, setPreview] = useState(null);
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();
  const [professionalHistory, setProfessionalHistory] = useState([
    {
      title: "",
      employmentType: "",
      companyName: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      profileHeadline: "",
    },
  ]);

  const [educationHistory, setEducationHistory] = useState([
    {
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      grade: "",
      activities: "",
      description: "",
    },
  ]);

  const [portfolio, setPortfolio] = useState([
    {
      title: "",
      image: "",
      link: "",
    },
  ]);

  // Handle change in portfolio inputs
  const handlePortfolioChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...portfolio];
    updated[index][name] = value;
    setPortfolio(updated);
  };

  // Add more portfolio entries
  const handleAddPortfolio = () => {
    setPortfolio([...portfolio, { title: "", image: "", link: "" }]);
  };

  // Remove portfolio entry
  const handleRemovePortfolio = (index) => {
    const updated = [...portfolio];
    updated.splice(index, 1);
    setPortfolio(updated);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...educationHistory];
    list[index][name] = value;
    setEducationHistory(list);
  };

  const handleAddEducation = () => {
    setEducationHistory([
      ...educationHistory,
      {
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        grade: "",
        activities: "",
        description: "",
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    const list = [...educationHistory];
    list.splice(index, 1);
    setEducationHistory(list);
  };

  const handleProfessionalChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const list = [...professionalHistory];
    list[index][name] = type === "checkbox" ? checked : value;
    setProfessionalHistory(list);
  };

  const handleAddMore = () => {
    setProfessionalHistory([
      ...professionalHistory,
      {
        title: "",
        employmentType: "",
        companyName: "",
        location: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        profileHeadline: "",
      },
    ]);
  };

  const handleRemove = (index) => {
    const list = [...professionalHistory];
    list.splice(index, 1);
    setProfessionalHistory(list);
  };

  const handlecancel = () => {
    navigate(`/dashboard`);
  };

  const handlePreview = () => {
    navigate(`/profile/${userId}`); // userId dynamic
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setShowModal(false); // close modal
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser); // parse only if exists
        console.log("User in localStorage:", user);
        setUserName(user.name || "Guest");
      } else {
        console.log("No user found in localStorage");
        setUserName("Guest"); // fallback
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUserName("Guest"); // fallback
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const data = new FormData();

    // Basic Info
    data.append("name", document.getElementById("name").value);
    data.append("email", document.getElementById("email").value);
    data.append("phone", document.getElementById("phone").value);
    data.append("birthday", document.getElementById("birthday").value);
    data.append(
      "gender",
      document.querySelector('input[name="gender"]:checked')?.value || ""
    );
    data.append("country", document.getElementById("country").value);
    data.append("city", document.getElementById("city").value);

    // Profile Image
    const profileFile = document.getElementById("profileUpload").files[0];
    if (profileFile) data.append("profileImage", profileFile);

    // Summary
    data.append("description", document.getElementById("description").value);

    // Professional History
    data.append("professional", JSON.stringify(professionalHistory));
    // Education History
    data.append("education", JSON.stringify(educationHistory));

    // Skills
    const skillsData = Array.from(document.querySelectorAll("#skills button"))
      .filter((btn) => btn.innerText && !btn.innerText.includes("Add More"))
      .map((btn) => btn.innerText);
    data.append("skills", JSON.stringify(skillsData));

    // Portfolio
    data.append("portfolio", JSON.stringify(portfolio));

    // Confirmation checkbox
    data.append("confirmHide", document.getElementById("confirm").checked);

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Token missing. Please login first.");

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ format correct
        },
      };

      const res = await axios.post(
        "http://localhost:5000/api/profile",
        data,
        config
      );

      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving profile");
    }
  };

  return (
    <>
      <Header />

      <section className="bg-gray pt-4">
        <div className="container">
          <div className="row pt-4 px-0 border-bottom mb-2">
            <h1 className="fs-4 fw-bold" style={{ color: "#212529" }}>
              Hi, {userName}
            </h1>
            <p className="text-color">
              Update your company photo and details here
            </p>
          </div>

          <div
            className="row user-deatail d-flex pt-3 ps-0"
            style={{ paddingTop: "50px" }}
          >
            {/* Sidebar Menu */}
            <div className="col-md-2 sub-heading">
              <ul className="nav flex-column" id="sideMenu">
                <li className="nav-item">
                  <a
                    className="nav-link ps-0 text-dark"
                    aria-current="page"
                    href="#information"
                  >
                    Your Information
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link ps-0 text-dark" href="#summary">
                    Summary
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link ps-0 text-dark" href="#proffesional">
                    Professional History
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link ps-0 text-dark" href="#education">
                    Education History
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link ps-0 text-dark" href="#skills">
                    Skills
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link ps-0 text-dark" href="#settings">
                    Confirmation & Settings
                  </a>
                </li>
              </ul>
            </div>

            {/* Main Form Content */}
            <div
              className="py-5 px-md-5 pt-0 form col-md-10"
              id="scrollArea"
              data-bs-spy="scroll"
              data-bs-target="#sideMenu"
              data-bs-offset="100"
              data-bs-smooth-scroll="true"
              tabIndex="0"
              style={{ height: "100vh", overflowY: "auto" }}
            >
              {/* Your Information */}
              <div className="information" id="information">
                <h4 className="fs-4 text-dark mb-2">Your Information</h4>
                <label htmlFor="profileUpload" className="form-label">
                  Profile Image
                </label>
                <label
                  className="upload-box mb-2"
                  htmlFor="profileUpload"
                  style={{ width: "135px", height: "100px" }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <>
                      <i className="fas fa-upload upload-icon"></i>
                      <span className="text-muted">Upload</span>
                    </>
                  )}

                  <input
                    type="file"
                    id="profileUpload"
                    name="profileImage"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>

                <form className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="e.g. +91-1234567890"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="birthday" className="form-label">
                      Birthday
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="birthday"
                      name="birthday"
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label d-block">Gender</label>
                    <div className="d-flex gap-4 pt-1">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="male"
                          name="gender"
                          value="male"
                        />
                        <label className="form-check-label" htmlFor="male">
                          Male
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="female"
                          name="gender"
                          value="female"
                        />
                        <label className="form-check-label" htmlFor="female">
                          Female
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>

                    <input
                      type="country"
                      className="form-control"
                      id="country"
                      name="country"
                      placeholder="Enter your country"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>

                    <input
                      type="city"
                      className="form-control"
                      id="city"
                      name="city"
                      placeholder="Enter your city"
                    />
                  </div>
                </form>
              </div>

              {/* Summary */}
              <div className="summary pt-4" id="summary">
                <h4 className="fs-4 text-dark mb-3">Summary</h4>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="6"
                    placeholder="Enter a description"
                  ></textarea>
                </div>
              </div>

              {/* Professional History */}
              <div className="Professional pt-4" id="proffesional">
                <h4 className="fs-4 text-dark mb-3">Professional History</h4>

                {professionalHistory.map((item, index) => (
                  <div key={index} className="row g-4 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={item.title}
                        onChange={(e) => handleProfessionalChange(index, e)}
                        placeholder="Ex: Retail Sales Manager"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Employment Type</label>
                      <input
                        type="text"
                        className="form-control"
                        name="employmentType"
                        value={item.employmentType}
                        onChange={(e) => handleProfessionalChange(index, e)}
                        placeholder="Ex: Full-time"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="companyName"
                        value={item.companyName}
                        onChange={(e) => handleProfessionalChange(index, e)}
                        placeholder="Ex: ABC Ltd."
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={item.location}
                        onChange={(e) => handleProfessionalChange(index, e)}
                        placeholder="Ex: Mumbai, India"
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="currentlyWorking"
                          checked={item.currentlyWorking}
                          onChange={(e) => handleProfessionalChange(index, e)}
                        />
                        <label className="form-check-label">
                          I am currently working in this role
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={item.startDate}
                        onChange={(e) => handleProfessionalChange(index, e)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={item.endDate}
                        onChange={(e) => handleProfessionalChange(index, e)}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Profile Headline</label>
                      <input
                        type="text"
                        className="form-control"
                        name="profileHeadline"
                        value={item.profileHeadline}
                        onChange={(e) => handleProfessionalChange(index, e)}
                        placeholder="Ex: Award-winning manager with 10 years experience"
                      />
                    </div>
                  </div>
                ))}

                <div className="col-md-12">
                  <button
                    type="button"
                    className="btn rounded-0"
                    style={{ border: "1px solid #D5D5D5" }}
                    onClick={handleAddMore}
                  >
                    <i className="bi bi-plus-lg me-2"></i> Add More
                  </button>
                </div>
              </div>

              {/* Education History */}
              <div className="education pt-4" id="education">
                <h4 className="fs-4 text-dark mb-3">Education History</h4>

                {educationHistory.map((edu, index) => (
                  <form key={index} className="row g-4 mb-3">
                    <div className="col-md-6">
                      <label htmlFor={`school-${index}`} className="form-label">
                        School
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`school-${index}`}
                        name="school"
                        placeholder="Ex: School"
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, e)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor={`degree-${index}`} className="form-label">
                        Degree
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`degree-${index}`}
                        name="degree"
                        placeholder="Ex: Bachelor's"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, e)}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor={`field-${index}`} className="form-label">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`field-${index}`}
                        name="field"
                        placeholder="Ex: Business"
                        value={edu.field}
                        onChange={(e) => handleEducationChange(index, e)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor={`start-${index}`} className="form-label">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id={`start-${index}`}
                        name="startDate"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, e)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor={`end-${index}`} className="form-label">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id={`end-${index}`}
                        name="endDate"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, e)}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor={`grade-${index}`} className="form-label">
                        Grade
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`grade-${index}`}
                        name="grade"
                        value={edu.grade}
                        onChange={(e) => handleEducationChange(index, e)}
                      />
                    </div>

                    <div className="col-12">
                      <label
                        htmlFor={`activities-${index}`}
                        className="form-label"
                      >
                        Activities and Societies
                      </label>
                      <textarea
                        className="form-control"
                        id={`activities-${index}`}
                        name="activities"
                        rows="6"
                        value={edu.activities}
                        onChange={(e) => handleEducationChange(index, e)}
                      ></textarea>
                    </div>

                    <div className="col-12 mb-2">
                      <label htmlFor={`desc-${index}`} className="form-label">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id={`desc-${index}`}
                        name="description"
                        rows="6"
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, e)}
                      ></textarea>
                    </div>

                    {educationHistory.length > 1 && (
                      <div className="col-12 text-end">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm rounded-0 px-3"
                          onClick={() => handleRemoveEducation(index)}
                        >
                          <i className="bi bi-trash me-1"></i> Remove
                        </button>
                      </div>
                    )}
                  </form>
                ))}

                <div className="col-md-12 mt-2">
                  <button
                    type="button"
                    className="btn rounded-0"
                    style={{ border: "1px solid #D5D5D5" }}
                    onClick={handleAddEducation}
                  >
                    <i className="bi bi-plus-lg me-2"></i> Add More
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="skills pt-4" id="skills">
                <h4 className="fs-4 text-dark mb-3">Skills</h4>
                <div>
                  <label htmlFor="skills" className="form-label">
                    Skills
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <button
                        type="button"
                        key={index}
                        className="btn btn-primary rounded-0 d-flex align-items-center"
                      >
                        {skill}
                        <i
                          className="bi bi-x-lg ms-1"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveSkill(skill)}
                        ></i>
                      </button>
                    ))}

                    {/* Add More button */}
                    <button
                      type="button"
                      className="btn rounded-0"
                      style={{ border: "1px solid #D5D5D5" }}
                      onClick={() => setShowModal(true)}
                    >
                      <i className="bi bi-plus-lg me-1"></i> Add More
                    </button>
                  </div>
                </div>

                {/* Modal */}
                {showModal && (
                  <div
                    className="modal-backdrop d-flex justify-content-center align-items-center"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      zIndex: 9999,
                    }}
                  >
                    <div
                      className="bg-white p-4 rounded"
                      style={{ width: "300px", textAlign: "center" }}
                    >
                      <h5 className="mb-3">Add a Skill</h5>
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Enter your skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddSkill();
                        }}
                        autoFocus
                      />
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-secondary rounded-0"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary rounded-0"
                          onClick={handleAddSkill}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Portofolio */}
              <div className="portfolio pt-4" id="portfolio">
                <h4 className="fs-4 text-dark mb-3">Portfolio</h4>

                {portfolio.map((item, index) => (
                  <div key={index} className="row g-4 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        placeholder="Ex: E-commerce Website"
                        value={item.title}
                        onChange={(e) => handlePortfolioChange(index, e)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Project Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        name="image"
                        placeholder="https://example.com/project.jpg"
                        value={item.image}
                        onChange={(e) => handlePortfolioChange(index, e)}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Project Link</label>
                      <input
                        type="text"
                        className="form-control"
                        name="link"
                        placeholder="https://yourprojectlink.com"
                        value={item.link}
                        onChange={(e) => handlePortfolioChange(index, e)}
                      />
                    </div>

                    {portfolio.length > 1 && (
                      <div className="col-12 text-end">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm rounded-0 px-3"
                          onClick={() => handleRemovePortfolio(index)}
                        >
                          <i className="bi bi-trash me-1"></i> Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="col-md-12 mt-2">
                  <button
                    type="button"
                    className="btn rounded-0"
                    style={{ border: "1px solid #D5D5D5" }}
                    onClick={handleAddPortfolio}
                  >
                    <i className="bi bi-plus-lg me-2"></i> Add More
                  </button>
                </div>
              </div>

              {/* Confirmation & Settings */}
              <div className="confirmation py-4" id="settings">
                <h4 className="fs-4 text-dark mb-3">Confirmation & Settings</h4>
                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="confirm"
                    name="confirm"
                  />
                  <label className="form-check-label" htmlFor="confirm">
                    If you work for a company and want to hide your name and
                    photo under the company's name, click here.
                  </label>
                </div>
                <button
                  type="button"
                  className="btn my-btn rounded-0"
                  onClick={handlePreview}
                >
                  Preview Your Profile
                </button>
              </div>

              <hr />

              {/* Footer Buttons */}
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0">Lorem ipsum dolor sit amet</p>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-0 text-dark"
                    style={{
                      width: "72px",
                      height: "38px",
                      border: "1px solid #D5D5D5",
                    }}
                    onClick={handlecancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark rounded-0"
                    onClick={handlePreview}
                    style={{ height: "38px", width: "195px" }}
                  >
                    Preview as a Candidate
                  </button>
                  <button
                    type="button"
                    className="btn my-btn rounded-0"
                    style={{ height: "38px", width: "132px" }}
                    onClick={handleSubmit}
                  >
                    Save & Publish
                  </button>
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

export default CreateProfile;
