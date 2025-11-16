import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function CompanyProfile() {
  const [formData, setFormData] = useState({
    companyName: "",
    websiteLink: "",
    linkedinLink: "",
    twitterLink: "",
    beLink: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/company/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          companyName: res.data.companyName || "",
          websiteLink: res.data.websiteLink || "",
          linkedinLink: res.data.linkedinLink || "",
          twitterLink: res.data.twitterLink || "",
          beLink: res.data.beLink || "",
        });

        // ✅ Logo ka full URL set karo
        if (res.data.companyLogo) {
          setLogoPreview(
            `http://localhost:5000/uploads/${res.data.companyLogo}`
          );
        }
      } catch (err) {
        console.error(err);
        // alert("Failed to load company details.");
      }
    };

    fetchCompany();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("companyName", formData.companyName);
      data.append("websiteLink", formData.websiteLink);
      data.append("linkedinLink", formData.linkedinLink);
      data.append("twitterLink", formData.twitterLink);
      data.append("beLink", formData.beLink);
      if (logoFile) data.append("companyLogo", logoFile);

      // Token fetch (login ke baad localStorage me save kiya ho)
      const token = localStorage.getItem("token");

      const res = await axios.put("http://localhost:5000/api/company", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // <- token added
        },
      });

      alert("Company info saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving company info.");
    }
  };

  return (
    <>
      <Header />

      <section>
        <div className="container">
          <div className="mt-5">
            <h2 className="fs-4 fw-bold" style={{ color: "#212529" }}>
              Company Profile
            </h2>
            <p className="fw-light fs-small">
              Update your company photo and details hear.
            </p>
          </div>

          <div className="row mt-5">
            <div className="col-md-3">
              <ul className="nav flex-column" id="sideMenu">
                <li className="nav-item">
                  <a
                    className="nav-link ps-0 text-dark"
                    aria-current="page"
                    href="#job-title"
                    style={{ top: "20px" }}
                  >
                    Public Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link ps-0 text-dark" href="#job-details">
                    Company Logo{" "}
                  </a>
                </li>
              </ul>
            </div>

            <div
              className="col-md-9 py-5 scroller px-md-5 pt-0"
              id="scrollArea"
              data-bs-spy="scroll"
              data-bs-target="#sideMenu"
              data-bs-offset="100"
              data-bs-smooth-scroll="true"
              tabindex="0"
              style={{ height: "100vh", overflowY: "auto" }}
            >
              <div class="job-title" id="job-title">
                <h4 class="fs-4 text-dark mb-4">Public Profile</h4>
                <form className="row g-4 small" onSubmit={handleSubmit}>
                  {/* Job Title  */}
                  <div class="col-12">
                    <label for="jobTitle" class="form-label">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="form-control bg-gray rounded-0"
                      name="companyName"
                      placeholder="Your Website"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </div>

                  <div class="col-12">
                    <label for="jobTitle" class="form-label">
                      Website Link
                    </label>
                    <input
                      type="text"
                      className="form-control bg-gray rounded-0"
                      name="websiteLink"
                      placeholder="www.yourwebsite.com"
                      value={formData.websiteLink}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="col-12">
                    <label for="jobTitle" class="form-label">
                      Linkedin Link
                    </label>
                    <input
                      type="text"
                      className="form-control bg-gray rounded-0"
                      name="linkedinLink"
                      placeholder="www.linkedin.com"
                      value={formData.linkedinLink}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="col-12">
                    <label for="jobTitle" class="form-label">
                      Twitter Link
                    </label>
                    <input
                      type="text"
                      className="form-control bg-gray rounded-0"
                      name="twitterLink"
                      placeholder="www.twitter.com"
                      value={formData.twitterLink}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="col-12">
                    <label for="jobTitle" class="form-label">
                      Be Link
                    </label>
                    <input
                      type="text"
                      className="form-control bg-gray rounded-0"
                      name="beLink"
                      placeholder="www.be.com"
                      value={formData.beLink}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="job-details pt-4" id="job-details">
                    <h4 className="fs-4 text-dark mb-3">Company Logo</h4>

                    <div className="d-flex gap-3 flex-wrap align-items-center">
                      {/* Logo Preview Box  */}
                      <div
                        className="d-flex align-items-center justify-content-center bg-white border"
                        style={{ width: "120px", height: "100px" }}
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo Preview"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                          />
                        ) : (
                          <span className="text-dark small">Logo Preview</span>
                        )}
                      </div>

                      {/* Upload Box  */}
                      <div
                        className="bg-white border d-flex flex-column align-items-center justify-content-center text-center px-4 py-3"
                        style={{ minWidth: "320px", height: "100px" }}
                      >
                        <label
                          for="logoUpload"
                          className="mb-2"
                          style={{ cursor: "pointer" }}
                        >
                          <i className="bi bi-upload fs-3 text-secondary"></i>
                        </label>
                        <label
                          for="logoUpload"
                          style={{ cursor: "pointer" }}
                          class="small mb-0 text-secondary"
                        >
                          <span className="text-primary">Click to upload</span>{" "}
                          or drag and drop SVG, PNG, JPG or GIF (max. 800x400px)
                        </label>
                        <input
                          type="file"
                          id="logoUpload"
                          accept=".svg,.png,.jpg,.jpeg,.gif"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <button className="btn btn-primary">Save</button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default CompanyProfile;
