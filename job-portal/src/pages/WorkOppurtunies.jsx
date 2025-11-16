import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function WorkOpportunities() {
  const [jobs, setJobs] = useState([]);
  const [freelanceJobs, setFreelanceJobs] = useState([]);
  const [fullTimeJobs, setFullTimeJobs] = useState([]);
  const [creativeJobs, setCreativeJobs] = useState([]);
  const navigate = useNavigate();

  const handleQuickApply = async (jobId) => {
    const token = localStorage.getItem("token")?.trim();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/application",
        { jobId, coverLetter: "", resumeUrl: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get("http://localhost:5000/api/jobs/all", {
          headers,
        });

        const allJobs = Array.isArray(res.data.data) ? res.data.data : [];

        const parsedJobs = allJobs.map((job) => ({
          ...job,
          skills: job.tags || [],
          benefits: job.benefits || [],
          type: job.type ? job.type.trim() : "",
          companyName: job.company?.companyName || "Unknown Company",
          companyLogo: job.company?.companyLogo || null,
        }));

        setJobs(parsedJobs);
        setFreelanceJobs(
          parsedJobs.filter((job) => job.type.toLowerCase() === "freelance")
        );
        setFullTimeJobs(
          parsedJobs.filter((job) => job.type.toLowerCase() === "full time")
        );
        setCreativeJobs(
          parsedJobs.filter(
            (job) => job.type.toLowerCase() === "hire for creatives"
          )
        );
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  const totalJobs = jobs.length;

  const calculateDaysAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Math.floor(
      (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24)
    );
    return diff ? `${diff} Day ago` : "";
  };

  const handleJobClick = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/notifications/mark-read/job",
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }

    navigate(`/job/${jobId}`);
  };

  const renderJobCard = (job, index) => (
    <div className="col-md-4 mt-4" key={job.id || index}>
      <div
        className="job-card"
        style={{ cursor: "pointer" }}
        onClick={() => handleJobClick(job.id)}
      >
        <div className="d-flex justify-content-between align-items-start mb-2">
          {job.companyLogo && (
            <img
              src={`http://localhost:5000/uploads/${job.companyLogo}`}
              className="rounded-circle object-fit-cover nav-profile-img"
              style={{ width: "30px", height: "30px" }}
              alt={job.companyName}
            />
          )}
          <span className="badge-custom">{job.type}</span>
        </div>

        <div className="job-title">{job.title}</div>
        <p className="text-color mb-1">{job.companyName}</p>
        <div className="d-flex text-color text-small mb-1">
          <i className="bi bi-currency-rupee me-2"></i>
          {job.salaryFrom || "N/A"} - {job.salaryTo || "N/A"}
        </div>
        <div className="d-flex justify-content-between text-color text-small">
          <span>
            <i className="bi bi-geo-alt me-2"></i>
            {job.location}
          </span>
          <span className="fs-14px">{calculateDaysAgo(job.createdAt)}</span>
        </div>
        <button
          className="quick-apply"
          onClick={(e) => {
            e.stopPropagation(); // Prevent redirect on button click
            handleQuickApply(job.id);
          }}
        >
          Quick Apply
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Header />

      <section className="mt-5">
        <div className="container">
          <h2 className="mb-4">
            Find a job with Us{" "}
            {totalJobs > 0 && <span>(Total Jobs: {totalJobs} )</span>}
          </h2>

          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#freelance"
              >
                Freelance
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#fulltime"
              >
                Full-Time
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#creative"
              >
                Hire For Creatives
              </button>
            </li>
          </ul>

          <div className="tab-content mt-3">
            <div className="tab-pane fade show active" id="freelance">
              <div className="row">
                {freelanceJobs.length > 0 ? (
                  freelanceJobs.map((job, index) => renderJobCard(job, index))
                ) : (
                  <p className="text-muted mt-4">No Freelance Jobs Found.</p>
                )}
              </div>
            </div>

            <div className="tab-pane fade" id="fulltime">
              <div className="row">
                {fullTimeJobs.length > 0 ? (
                  fullTimeJobs.map((job, index) => renderJobCard(job, index))
                ) : (
                  <p className="text-muted mt-4">No Full-Time Jobs Found.</p>
                )}
              </div>
            </div>

            <div className="tab-pane fade" id="creative">
              <div className="row">
                {creativeJobs.length > 0 ? (
                  creativeJobs.map((job, index) => renderJobCard(job, index))
                ) : (
                  <p className="text-muted mt-4">No Creative Jobs Found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default WorkOpportunities;
