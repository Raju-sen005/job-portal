import React, { useEffect, useState } from "react";
import axios from "axios";

function TotalCandidate() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) return console.error("No token found!");

      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/application/company/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) setApplications(data.applications);
      } catch (error) {
        console.error(
          "Error fetching applications:",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-50 text-secondary fw-semibold">
        Loading...
      </div>
    );

  if (applications.length === 0)
    return (
      <div className="d-flex justify-content-center align-items-center vh-50 text-muted fw-medium">
        No candidates applied yet.
      </div>
    );

  return (
    <div className="container mt-5">
      <div className=" rounded-0 p-4">
        <h2 className="mb-4 fw-bold text-dark">
          Total Candidates: {applications.length}
        </h2>

        <div className="row">
          {applications.map((app) => (
            <div key={app.id} className="col-md-6 mb-3">
              <div className="card border-0 shadow-sm rounded-3 p-3 d-flex flex-row align-items-center justify-content-between">
                {/* Candidate Info */}
                <div className="d-flex align-items-center">
                  <img
                    src={
                      app.User.Profile?.profileImage
                        ? `http://localhost:5000/uploads/${app.User.Profile.profileImage}`
                        : "/default-avatar.png"
                    }
                    alt={app.User.name}
                    className="rounded-circle me-3 border"
                    width="55"
                    height="55"
                    style={{ objectFit: "cover" }}
                  />

                  <div>
                    <div className="fw-semibold text-dark">{app.User.name}</div>
                    <div className="text-muted small">{app.User.email}</div>
                  </div>
                </div>

                {/* Job Info */}
                <div className="text-end">
                  <div className="fw-semibold text-secondary">
                    {app.Job.title}
                  </div>
                  <div className="text-muted small">
                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TotalCandidate;
