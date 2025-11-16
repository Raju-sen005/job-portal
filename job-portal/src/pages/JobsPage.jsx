import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function JobsPage() {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get query params
  const query = new URLSearchParams(location.search);
  const search = query.get("search") || "";
  const experience = query.get("experience") || "";
  const salary = query.get("salary") || "";
  const city = query.get("location") || "";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/jobs/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or network error");
        return res.json();
      })
      .then((data) => setJobs(data.data || data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!Array.isArray(jobs)) return setFilteredJobs([]);

    const filtered = jobs.filter((job) => {
      const titleMatch = search
        ? job.title.toLowerCase().includes(search.toLowerCase())
        : false;

      const experienceMatch = experience
        ? job.experienceLevel.toLowerCase().includes(experience.toLowerCase())
        : false;

      const salaryMatch = salary
        ? parseInt(salary) >= parseInt(job.salaryFrom) &&
          parseInt(salary) <= parseInt(job.salaryTo)
        : false;

      const locationMatch = city
        ? job.location.toLowerCase() === city.toLowerCase()
        : false;

      // OR logic: return true if any filter matches
      return titleMatch || experienceMatch || salaryMatch || locationMatch;
    });

    setFilteredJobs(filtered);
  }, [jobs, search, experience, salary, city]);

  if (loading) return <div className="container pt-4"><p>Loading jobs...</p></div>;
  if (error) return <div className="container pt-4"><p className="text-danger">{error}</p></div>;

  return (
    <div className="container pt-4">
      <h2 className="mb-4">Jobs</h2>
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <div key={job.id} className="card mb-3 p-3">
            <h5>{job.title}</h5>
            <p>{job.company?.companyName || "Company Name"}</p>
            <p>
              {job.location} | {job.experienceLevel} | {job.salaryFrom} - {job.salaryTo}
            </p>
          </div>
        ))
      ) : (
        <p>No jobs found matching your criteria.</p>
      )}
    </div>
  );
}

export default JobsPage;
