import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [company, setCompany] = useState(null);
  const token = localStorage.getItem("token");
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [newCandidates, setNewCandidates] = useState(0);
  const [newJobs, setNewJobs] = useState(0);
  // New Jobs calculate karne ke liye alag effect
  useEffect(() => {
    if (!jobs.length) return;

    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    const newJobCount = jobs.filter(
      (job) => new Date(job.createdAt) >= lastMonth
    ).length;
    setNewJobs(newJobCount);
  }, [jobs]); // sirf jobs change hone par run hoga

  useEffect(() => {
    if (!applications.length) return;

    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    setTotalCandidates(applications.length);

    const newApps = applications.filter(
      (app) => new Date(app.appliedAt) >= lastMonth
    );
    setNewCandidates(newApps.length);
  }, [applications]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // company ke jobs filter karo
        const companyJobs = res.data.data.filter(
          (job) => job.companyId === company?.id
        );
        setJobs(companyJobs || []);

        // Sab jobs ke applications fetch karo
        const allApplications = [];
        for (const job of companyJobs) {
          const appsRes = await axios.get(
            `http://localhost:5000/api/application/job/${job.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const apps = Array.isArray(appsRes.data.applications)
            ? appsRes.data.applications.map((app) => ({
                id: app.id,
                status: app.status,
                coverLetter: app.coverLetter,
                resumeUrl: app.resumeUrl,
                appliedAt: app.createdAt,
                userName: app.User?.name || "N/A",
                userEmail: app.User?.email || "N/A",
                userProfile: app.User?.Profile?.profileImage || null,
                jobTitle: job.title,
                jobType: job.type,
              }))
            : [];
          allApplications.push(...apps);
        }

        setApplications(allApplications);
      } catch (err) {
        console.error("Error fetching jobs/applications:", err);
      }
    };

    if (company?.id) fetchJobs(); // company id milte hi fetch karo
  }, [token, company]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token"); // ya jo bhi aap store kar rahe ho
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);

        setJobs(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/company/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompany(res.data);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };
    fetchCompany();
  }, [token]);

  const handleTotalCandidate = () => {
    navigate(`/total-candidate`);
  };

  const handleNewCandidate = () => {
    navigate(`/new-candidate`);
  };

  const handleNewJob = () => {
    navigate(`/new-job`);
  };
  return (
    <>
      <Header />

      <section>
        <div className="container">
          <div className="mt-5">
            <h2 class="text-dark fw-semibold">
              Welcome back, {company?.companyName || "Guest"}!
            </h2>
            <p class="text-dark">
              Experience the benefits of Candidate Tracking, Management, and
              Forecasting.
            </p>
          </div>

          <div className="row g-4 mb-4 mt-4">
            <div className="col-md-4">
              <div className="card p-4 rounded-4 shadow">
                {/* Top: Heading + Menu */}
                <div className="d-flex justify-content-between">
                  <h5 className="text-dark">Total Candidate</h5>
                  <i
                    className="bi bi-three-dots-vertical text-muted"
                    onClick={handleTotalCandidate}
                  ></i>
                </div>

                {/* Middle: Big Number  */}
                <div className="text-left ">
                  <h2 className="text-dark fs-1 fw-bold mt-3">
                    {totalCandidates}
                  </h2>
                </div>

                {/* Bottom: Growth + Icon  */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-green large">
                    <i className="bi bi-arrow-up"></i> 40%{" "}
                    <span className="text-muted">vs Last month</span>
                  </div>
                  <div className="icon-box bg-primary rounded-2 d-flex align-items-center justify-content-center">
                    <i className="bi bi-people text-white"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-4 rounded-4 shadow">
                {/* Top: Heading + Menu */}
                <div className="d-flex justify-content-between">
                  <h5 className="text-dark">New Candidates</h5>
                  <i
                    className="bi bi-three-dots-vertical text-muted"
                    onClick={handleNewCandidate}
                  ></i>
                </div>

                {/* Middle: Big Number  */}
                <div className="text-left ">
                  <h3 className="text-dark fs-1 fw-semibold mt-3">
                    {newCandidates}
                  </h3>
                </div>

                {/* Bottom: Growth + Icon  */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-green large">
                    <i className="bi bi-arrow-up"></i> 12%{" "}
                    <span className="text-muted">vs Last month</span>
                  </div>
                  <div className="icon-box bg-light rounded-2 d-flex align-items-center justify-content-center">
                    <i className="bi bi-person text-white"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-4 rounded-4 shadow">
                {/* Top: Heading + Menu */}
                <div className="d-flex justify-content-between">
                  <h5 className="text-dark">New Job Create</h5>
                  <i
                    className="bi bi-three-dots-vertical text-muted"
                    onClick={handleNewJob}
                  ></i>
                </div>

                {/* Middle: Big Number  */}
                <div className="text-left">
                  <h3 className="text-dark fs-1 fw-semibold mt-3">{newJobs}</h3>
                </div>

                {/* Bottom: Growth + Icon  */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-green small">
                    <i className="bi bi-arrow-up"></i> 6%{" "}
                    <span className="text-muted">vs Last month</span>
                  </div>
                  <div className="icon-box bg-dark rounded-2 d-flex align-items-center justify-content-center">
                    <i className="bi bi-briefcase text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-5 pb-2">
            {/* List of Applications  */}
            <div className="col-lg-8">
              <div className="card border-0 rounded-3 shadow-sm p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-dark mb-0">Applications</h6>
                  <i className="bi bi-three-dots-vertical text-muted"></i>
                </div>

                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0">
                    <tbody>
                      {loadingApps ? (
                        <tr>
                          <td colSpan="6" className="text-center text-muted">
                            Loading applications...
                          </td>
                        </tr>
                      ) : applications.length > 0 ? (
                        applications.map((app) => (
                          <tr key={app.id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={
                                    app.userProfile
                                      ? `http://localhost:5000/uploads/${app.userProfile}`
                                      : `https://api.dicebear.com/8.x/initials/svg?seed=${app.userName}`
                                  }
                                  alt={app.userName}
                                  className="img-rounded"
                                  width="40"
                                  height="40"
                                />

                                <div className="text-dark fw-semibold">
                                  {app.userName}
                                </div>
                              </div>
                            </td>
                            <td className="text-muted small">{app.jobTitle}</td>
                            <td>
                              <span className="badge bg-blue text-primary-dark rounded-pill px-3 py-2">
                                {app.coverLetter
                                  ? `${app.coverLetter.slice(0, 25)}...`
                                  : "No Cover Letter"}
                              </span>
                            </td>

                            <td>
                              <span className="badge text-muted rounded-pill px-3 py-2">
                                {app.jobType || "Not Specified"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted">
                            No applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Jobs Card  */}
            <div className="col-lg-4">
              <div className="card border-0 rounded-3 shadow-sm p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-dark mb-0">Jobs</h6>
                  <i className="bi bi-three-dots-vertical text-muted"></i>
                </div>

                <ul className="list-group list-group-flush">
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <li
                        key={job.id}
                        className="d-flex justify-content-between align-items-center py-2"
                      >
                        <span className="text-dark fw-semibold">
                          {job.title}
                        </span>
                        <span className="badge text-muted rounded-pill">
                          {job.type}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted py-2">No jobs found</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Dashboard;
