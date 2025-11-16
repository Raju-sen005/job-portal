import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";


function CompanyProfile() {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token"); // ya jo bhi login me save kiya ho
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
  // company prop me backend se data pass hoga
  return (
    <>
      <Header />

      <section className="mt-5">
        <div className="container">
          <div className="row">
            {/* Left side */}
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                {/* Company Logo */}
                <img
                  src={
                    company?.companyLogo
                      ? `http://localhost:5000/uploads/${company.companyLogo}` // DB se logo
                      : "" // Agar logo nahi hai, blank rahe ya CSS se placeholder dikha sakte ho
                  }
                  className="rounded-circle object-fit-cover nav-profile-img"
                  style={{ width: "80px", height: "80px" }}
                  alt="Company Logo"
                />

                {/* Info */}
                <div className="my-2 course">
                  <h5 className="mb-1">
                    {company?.companyName || "Company Name"}
                  </h5>
                  <div className="text-muted small mt-2 mb-2">
                    {/* {company?.industry || "Industry"} &nbsp;·&nbsp; */}
                    {/* <i className="bi bi-geo-alt-fill"></i>{" "} */}
                    {/* {company?.location || "Location"} &nbsp;·&nbsp; */}
                    {/* {company?.size || "Size"} Employees */}
                  </div>

                  {/* Tags */}
                  <div className="d-flex flex-wrap gap-3 my-2">
                    {company?.tags?.map((tag, i) => (
                      <label key={i} className="my-2 badge-custom">
                        {tag}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="col-md-6 text-end">
              <p className="para">
                {/* {company?.contactNumber || "+91-XXXXXXXXXX"} */}
              </p>
              <p className="para">{company?.websiteLink || "info@company.com"}</p>

              <div className="icon">
                {company?.twitterLink && (
                  <i className="bi bi-twitter text-muted mx-2"></i>
                )}
                {company?.linkedinLink && (
                  <i className="bi bi-linkedin text-muted mx-2"></i>
                )}
                {company?.beLink && (
                  <i className="bi bi-behance text-muted mx-2"></i>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="br-bottom mt-4"></div>

      {/* About Company */}
      <section className="mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              {/* <h2 className="mt-3 mb-2">About Company</h2>
              <p>{company?.about || "Company description goes here..."}</p> */}
            </div>

            <div className="col-md-4">{/* Optional: image/banner */}</div>
          </div>

          {/* Work & Experience can be converted to Products/Services */}
          {/* <div className="row mt-5 mb-5">
            <div className="col-md-12">
              <h2 className="fs-5 pb-4">Products / Services</h2>

              <div className="d-flex gap-4 align-items-center">
                {company?.portfolio?.map((item, i) => (
                  <div key={i}>
                    <img src={item.image || defaultLogo} alt={item.name} />
                    <p>{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default CompanyProfile;
