import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function CompanyApplications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [expandedAppId, setExpandedAppId] = useState(null); // ✅ Toggle state

  // Fetch company jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token")?.trim();
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data.data || []);
        setLoadingJobs(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applications for selected job
  useEffect(() => {
    if (!selectedJobId) return;

    const fetchApplications = async () => {
      try {
        setLoadingApps(true);
        const token = localStorage.getItem("token")?.trim();
        const res = await axios.get(
          `http://localhost:5000/api/application/job/${selectedJobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const apps = Array.isArray(res.data.applications)
          ? res.data.applications
          : [];
        const parsedApps = apps.map((app) => ({
          id: app.id,
          appliedAt: app.createdAt,
          userName: app.User?.name || "N/A",
          userEmail: app.User?.email || "N/A",
          userPhone: app.User?.Profile?.phone || "N/A",
          userSkills: app.User?.Profile?.skills || "N/A",
          userCity: app.User?.Profile?.city || "N/A",
        }));

        setApplications(parsedApps);
        setLoadingApps(false);

        // ✅ Mark as read
        if (apps.length > 0) {
          await axios.put(
            "http://localhost:5000/api/application/mark-read",
            { jobId: selectedJobId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setLoadingApps(false);
      }
    };

    fetchApplications();
  }, [selectedJobId]);

  const calculateDaysAgo = (dateStr) => {
    if (!dateStr) return "";
    const now = new Date();
    const created = new Date(dateStr);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const createdDay = new Date(
      created.getFullYear(),
      created.getMonth(),
      created.getDate()
    );
    const diff = Math.floor((today - createdDay) / (1000 * 60 * 60 * 24));
    return diff === 0 ? "Today" : `${diff} Day ago`;
  };

  // ✅ Toggle function
  const toggleExpand = (id) => {
    setExpandedAppId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Header />

      <section>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
            <h2 className="text-dark fw-semibold">Our Listed Applications</h2>

            <div className="d-flex gap-2 align-items-center">
              <div className="position-relative" style={{ width: "250px" }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  className="form-control form-control-sm ps-5 custom-search w-100"
                  placeholder="Search..."
                />
              </div>

              <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                <i className="bi bi-plus"></i> Filter
              </button>
            </div>
          </div>

          <div className="row">
            {/* Job List */}
            <div className="col-md-4 mb-3">
              {loadingJobs ? (
                <p>Loading jobs...</p>
              ) : (
                <ul className="list-group">
                  {jobs.map((job) => (
                    <li
                      key={job.id}
                      className={`list-group-item ${
                        selectedJobId === job.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedJobId(job.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {job.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Applications */}
            <div className="col-md-8">
              {loadingApps ? (
                <p>Loading applications...</p>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <div className="job-card p-3 mb-3" key={app.id}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">{app.userName}</h5>
                    </div>

                    <p className="text-color mb-1">Email: {app.userEmail}</p>
                    <p className="fs-14px mt-1">
                      Applied: {calculateDaysAgo(app.appliedAt)}
                    </p>

                    {/* ✅ Hidden details visible only when expanded */}
                    {expandedAppId === app.id && (
                      <div className="mt-2">
                        <p className="text-color mb-1">
                          Phone: {app.userPhone}
                        </p>
                        <p className="text-color mb-1">
                          Skills: {app.userSkills}
                        </p>
                        <p className="text-color mb-1">City: {app.userCity}</p>
                      </div>
                    )}

                    <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={() => toggleExpand(app.id)}
                    >
                      {expandedAppId === app.id ? "Hide Details" : "View More"}
                    </button>
                  </div>
                ))
              ) : selectedJobId ? (
                <p className="text-muted mt-4">
                  No applications found for this job.
                </p>
              ) : (
                <p className="text-muted mt-4">
                  Select a job to see applications.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default CompanyApplications;
