import React, { useEffect, useState } from "react";
import axios from "axios";

function NewJob() {
  const [newJobs, setNewJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // Company JWT token

  useEffect(() => {
    const fetchNewJobs = async () => {
      if (!token) return console.error("No token found!");

      try {
        const { data } = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Backend returns: { total, totalPages, currentPage, data: jobs[] }
        if (data.data) {
          const now = new Date();
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);

          // 🔹 Filter jobs created within the last 30 days
          const recentJobs = data.data.filter(
            (job) => new Date(job.createdAt) >= oneMonthAgo
          );

          setNewJobs(recentJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewJobs();
  }, [token]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-50 text-secondary fw-semibold">
        Loading...
      </div>
    );

  if (newJobs.length === 0)
    return (
      <div className="d-flex justify-content-center align-items-center vh-50 text-muted fw-medium">
        No new jobs created in the last month.
      </div>
    );

  return (
    <div className="container mt-5">
      <div className=" rounded-0 p-4">
        <h2 className="mb-4 fw-bold text-dark">
          New Jobs (Last 30 Days): {newJobs.length}
        </h2>

        <div className="row">
          {newJobs.map((job) => (
            <div key={job.id} className="col-md-6 mb-3">
              <div className="card border-0 shadow-sm rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-semibold text-primary mb-1">{job.title}</h5>
                    <p className="text-muted mb-2 small">
                      Created On: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="badge bg-success text-white px-3 py-2">
                    Active
                  </span>
                </div>
                <p className="text-secondary small mb-0">
                  {job.description?.substring(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewJob;
