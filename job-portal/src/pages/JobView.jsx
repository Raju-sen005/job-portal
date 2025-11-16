import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Profile() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/jobs/all/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJob(res.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (job?.companyId) {
          const token = localStorage.getItem("companyToken"); // 👈 token localStorage से लो
          const res = await axios.get(
            `http://localhost:5000/api/company/${job.companyId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // 👈 header में भेजो
              },
            }
          );
          setCompany(res.data);
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, [job]);

  if (!job) {
    return (
      <>
        <Header />
        <div className="container mt-5">
          <h4>Loading Job Details...</h4>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                {company?.companyLogo && (
                  <img
                    src={`http://localhost:5000/uploads/${company.companyLogo}`}
                    className="rounded-circle me-3 object-fit-cover nav-profile-img"
                    style={{ width: "80px", height: "80px" }}
                    alt="Company Logo"
                  />
                )}

                <div className="my-2 course">
                  <h5 className="mb-1">{job.title}</h5>
                  <div className="text-muted small mt-2 mb-2">
                    {job.department} &nbsp;·&nbsp;
                    <i className="bi bi-geo-alt-fill"></i> {job.location}{" "}
                    &nbsp;·&nbsp;
                    <i className="bi bi-clock"></i> {job.type}
                  </div>

                  <div className="d-flex flex-wrap gap-3 my-2">
                    {job.tags &&
                      (Array.isArray(job.tags)
                        ? job.tags
                        : JSON.parse(job.tags)
                      ).map((tag, i) => (
                        <label key={i} className="my-2 badge-custom">
                          {tag.trim()}
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 text-end">
              <p className="para">{job.email || "example@email.com"}</p>
              <div className="icon">
                {company?.twitterLink && (
                  <a
                    href={company.twitterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-twitter text-muted mx-2"></i>
                  </a>
                )}
                {company?.linkedinLink && (
                  <a
                    href={company.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-linkedin text-muted mx-2"></i>
                  </a>
                )}
                {company?.beLink && (
                  <a
                    href={company.beLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-behance text-muted mx-2"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="br-bottom mt-4"></div>

      <section className="mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <h2 className="mt-3 mb-2">Job Description</h2>
              <p>{job.description}</p>

              <div className="mb-5">
                <div className="mt-4">
                  <h5 className="fs-6">
                    Work Experience -{" "}
                    <span className="ms-2 fs-6">
                      {job.experienceLevel || "N/A"}
                    </span>
                  </h5>
                </div>

                <div className="mt-4">
                  <h5 className="fs-6">
                    Salary -{" "}
                    <span className="ms-2 fs-6">
                      {job.salaryFrom} - {job.salaryTo}
                    </span>
                  </h5>
                </div>

                <div className="mt-4 d-flex align-items-center">
                  <h5 className="fs-6 mb-0">Benefits - </h5>
                  <div className="d-flex flex-wrap gap-3 ms-2 my-2">
                    {job.benefits &&
                      (Array.isArray(job.benefits)
                        ? job.benefits
                        : JSON.parse(job.benefits)
                      ).map((b, i) => (
                        <span key={i} style={{ fontWeight: "500" }}>
                          {b.trim()}
                        </span>
                      ))}
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

export default Profile;
