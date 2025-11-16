import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import for redirect
import Header from "../components/Header";
import Footer from "../components/Footer";

const MyJob = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // user-changeable
  const [jobs, setJobs] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editJob, setEditJob] = useState(null); // job data for editing
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  // Fetch jobs from backend
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

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenMenuIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (val) => {
    if (val >= 1 && val <= totalPages) {
      setCurrentPage(val);
    }
  };

  const currentJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Delete job
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error(err);
      alert("Error deleting job");
    }
  };

  // Open edit modal
 const handleEdit = (job) => {
  navigate(`/edit-job/${job.id}`);
};


  // View job placeholder
  const handleView = (job) => {
    navigate(`/job/${job.id}`);
  };

  return (
    <>
      <Header />

      <section className="bg-gray">
        <div className="container">
          <div className="row mt-2">
            <div className="col-md-12 mt-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-dark fw-semibold">Our Listed Jobs</h2>
                <div className="d-flex gap-2 align-items-center">
                  <div className="position-relative" style={{ width: "250px" }}>
                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
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

              <div className="pb-5">
                <div className="table-responsive shadow-sm rounded-3">
                  <table className="bg-gray table table-bordered small align-middle mb-0">
                    <thead className="text-muted small">
                      <tr>
                        <th>S.No.</th>
                        <th>Job Title</th>
                        <th>Department</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="small text-dark">
                      {currentJobs.map((job, index) => (
                        <tr key={job.id}>
                          <td>
                            {(currentPage - 1) * itemsPerPage + index + 1}.
                          </td>
                          <td>{job.title}</td>
                          <td>{job.department}</td>
                          <td>{job.type}</td>
                          <td>{job.location}</td>
                          <td className="position-relative">
                            <i
                              className="fas fa-ellipsis-h text-muted pointer"
                              onClick={() =>
                                setOpenMenuIndex(
                                  openMenuIndex === index ? null : index
                                )
                              }
                            ></i>
                            {openMenuIndex === index && (
                              <div
                                className="dropdown-edit-custom show"
                                ref={dropdownRef}
                              >
                                <div
                                  className="dropdown-item"
                                  onClick={() => handleView(job)}
                                >
                                  <i className="bi bi-eye me-2"></i> View
                                </div>
                                <div
                                  className="dropdown-item"
                                  onClick={() => handleEdit(job)}
                                >
                                  <i className="bi bi-pen me-2"></i> Edit
                                </div>
                                <div
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDelete(job.id)}
                                >
                                  <i className="bi bi-trash3 me-2"></i> Delete
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="pagination-controls d-flex justify-content-between mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <span>Items per Page</span>
                    <select
                      className="form-select form-select-sm w-auto"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={25}>25</option>
                    </select>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-link btn-sm px-1 text-decoration-none"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      &lt; Prev
                    </button>
                    <input
                      type="number"
                      className="form-control form-control-sm text-center"
                      style={{ width: "50px" }}
                      value={currentPage}
                      min={1}
                      max={totalPages}
                      onChange={(e) =>
                        handlePageChange(parseInt(e.target.value))
                      }
                    />
                    <span className="text-muted">of {totalPages}</span>
                    <button
                      className="btn btn-link btn-sm px-1 text-decoration-none"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {showEditModal && editJob && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Job</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form id="editJobForm">
                  <div className="mb-2">
                    <label>Job Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editJob.title}
                      onChange={(e) =>
                        setEditJob({ ...editJob, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editJob.department}
                      onChange={(e) =>
                        setEditJob({ ...editJob, department: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editJob.type}
                      onChange={(e) =>
                        setEditJob({ ...editJob, type: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editJob.location}
                      onChange={(e) =>
                        setEditJob({ ...editJob, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editJob.description}
                      onChange={(e) =>
                        setEditJob({ ...editJob, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Work Experience</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editJob.experienceLevel}
                      onChange={(e) =>
                        setEditJob({
                          ...editJob,
                          experienceLevel: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Salary From</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editJob.salaryFrom}
                      onChange={(e) =>
                        setEditJob({ ...editJob, salaryFrom: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <label>Salary To</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editJob.salaryTo}
                      onChange={(e) =>
                        setEditJob({ ...editJob, salaryTo: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label>Benefits</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editJob.benefits}
                      onChange={(e) =>
                        setEditJob({ ...editJob, benefits: e.target.value })
                      }
                    />
                  </div>
                   <div className="mb-2">
                    <label>Tags</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editJob.tags}
                      onChange={(e) =>
                        setEditJob({ ...editJob, tags: e.target.value })
                      }
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");

                      await axios.put(
                        `http://localhost:5000/api/jobs/${editJob.id}`,
                        editJob,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      setJobs(
                        jobs.map((job) =>
                          job.id === editJob.id ? editJob : job
                        )
                      );
                      setShowEditModal(false);
                    } catch (err) {
                      console.error(err);
                      alert("Error updating job");
                    }
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyJob;
