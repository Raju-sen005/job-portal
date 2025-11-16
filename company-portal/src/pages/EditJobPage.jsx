// src/pages/EditJobPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const EditJobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [editJob, setEditJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // backend se job object ka path check karo, aksar res.data ya res.data.job hota hai
        let jobData = res.data.job || res.data;
        console.log("Fetched job:", jobData); // debug ke liye

        // Benefits ko array me convert karo
        if (typeof jobData.benefits === "string") {
          try {
            const parsed = JSON.parse(jobData.benefits);
            jobData.benefits = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            jobData.benefits = [jobData.benefits];
          }
        }

        // Tags ko array me convert karo
        if (typeof jobData.tags === "string") {
          try {
            const parsed = JSON.parse(jobData.tags);
            jobData.tags = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            jobData.tags = [jobData.tags];
          }
        }

        setEditJob(jobData);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch job details");
      }
    };

    fetchJob();
  }, [jobId]);

  if (!editJob) return <div className="text-center p-5">Loading...</div>;

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/jobs/${jobId}`,
        editJob,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Job updated successfully");
      navigate("/my-jobs"); // redirect to job list
    } catch (err) {
      console.error(err);
      alert("Error updating job");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-5 mb-5">
        <h2>Edit Job</h2>
        <form>
          <div className="mb-2">
            <label>Job Title</label>
            <input
              type="text"
              className="form-control"
              value={editJob.title || ""}
              onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label>Department</label>
            <input
              type="text"
              className="form-control"
              value={editJob.department || ""}
              onChange={(e) => setEditJob({ ...editJob, department: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label>Type</label>
            <input
              type="text"
              className="form-control"
              value={editJob.type || ""}
              onChange={(e) => setEditJob({ ...editJob, type: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              value={editJob.location || ""}
              onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label>Description</label>
            <input
              type="text"
              className="form-control"
              value={editJob.description || ""}
              onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label>Salary From</label>
            <input
              type="text"
              className="form-control"
              value={editJob.salaryFrom || ""}
              onChange={(e) => setEditJob({ ...editJob, salaryFrom: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label>Salary To</label>
            <input
              type="text"
              className="form-control"
              value={editJob.salaryTo || ""}
              onChange={(e) => setEditJob({ ...editJob, salaryTo: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label>Benefits</label>
            <input
              type="text"
              className="form-control"
              value={Array.isArray(editJob.benefits) ? editJob.benefits.join(", ") : ""}
              onChange={(e) =>
                setEditJob({ ...editJob, benefits: e.target.value.split(",").map(b => b.trim()) })
              }
            />
          </div>

          <div className="mb-2">
            <label>Tags</label>
            <input
              type="text"
              className="form-control"
              value={Array.isArray(editJob.tags) ? editJob.tags.join(", ") : ""}
              onChange={(e) =>
                setEditJob({ ...editJob, tags: e.target.value.split(",").map(t => t.trim()) })
              }
            />
          </div>

          <button type="button" className="btn btn-primary mt-3" onClick={handleSave}>
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={() => navigate("/my-jobs")}
          >
            Cancel
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditJobPage;
