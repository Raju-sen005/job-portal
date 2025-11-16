import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      try {
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(
          "Error fetching profile:",
          err.response?.data || err.message
        );
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  // JSON fields parse
  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : profile.skills
    ? JSON.parse(profile.skills)
    : [];

  const education = Array.isArray(profile.education)
    ? profile.education
    : profile.education
    ? JSON.parse(profile.education)
    : [];

  const workExperience = Array.isArray(profile.professional)
    ? profile.professional
    : profile.professional
    ? JSON.parse(profile.professional)
    : [];

  const portfolio = Array.isArray(profile.portfolio)
    ? profile.portfolio
    : profile.portfolio
    ? JSON.parse(profile.portfolio)
    : [];

  return (
    <>
      <Header />

      <section className="mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                {/* Profile Image */}
                <img
                  src={
                    profile.profileImage
                      ? `http://localhost:5000/uploads/${profile.profileImage}`
                      : "/default-profile.png"
                  }
                  className="rounded-circle me-3"
                  width="100px"
                  height="100px"
                  alt="Profile Image"
                />

                {/* Info */}
                <div className="my-2 course">
                  <h5 className="mb-1">{profile.name}</h5>
                  <div className="text-muted small mt-2 mb-2">
                    {(() => {
                      let professionalData = [];

                      // agar string hai to JSON parse karo
                      if (profile.professional) {
                        try {
                          professionalData = JSON.parse(profile.professional);
                        } catch (e) {
                          console.error("Error parsing professional:", e);
                        }
                      }

                      // first job ka data show karo
                      const job = professionalData[0] || {};

                      return (
                        <>
                          {job.title || "N/A"} &nbsp;·&nbsp;
                          <i className="bi bi-geo-alt-fill"></i>{" "}
                          {profile.city || profile.country} &nbsp;·&nbsp;
                          <i className="bi bi-clock"></i>{" "}
                          {job.employmentType || "N/A"}
                        </>
                      );
                    })()}
                  </div>

                  {/* Skills */}
                  <div className="d-flex flex-wrap gap-3 my-2">
                    {skills.map((skill, index) => (
                      <label key={index} className="my-2 badge-custom">
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 text-end">
              <p className="para">{profile.phone}</p>
              <p className="para">{profile.email}</p>

              <div className="icon">
                {profile.socials?.twitter && (
                  <i className="bi bi-twitter text-muted mx-2"></i>
                )}
                {profile.socials?.linkedin && (
                  <i className="bi bi-linkedin text-muted mx-2"></i>
                )}
                {profile.socials?.behance && (
                  <i className="bi bi-behance text-muted mx-2"></i>
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
              <h2 className="mt-3 mb-2">About Candidates</h2>
              <p>{profile.description || "No description available."}</p>
            </div>
            <div className="col-md-4">{/* Empty for now */}</div>
          </div>

          {/* Work & Experience */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-5 pt-2">
                <h2 className="fs-5 pb-4">Work & Experience</h2>
                {workExperience.map((work, idx) => (
                  <div key={idx} className="d-flex gap-2">
                    <div className="pro">
                      <div className="icn-bar"></div>
                      {/* Sirf tab dikhao jab last item na ho */}
                      {idx !== workExperience.length - 1 && (
                        <div className="icn-bar-2"></div>
                      )}
                    </div>
                    <div className="date mt-1">
                      <h5>
                        {work.title || "N/A"}
                        <span>
                          {work.startDate && work.endDate
                            ? `${new Date(
                                work.startDate
                              ).getFullYear()} - ${new Date(
                                work.endDate
                              ).getFullYear()}`
                            : ""}
                        </span>
                      </h5>
                      <p className="company mt-1">
                        {work.companyName || "N/A"}
                      </p>
                      <p className="w-50 text-color">
                        {work.profileHeadline || work.description || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-5 pt-2">
                <h2 className="fs-5 pb-4">Education</h2>
                {education.map((edu, idx) => (
                  <div key={idx} className="d-flex gap-2">
                    <div className="pro">
                      <div className="icn-bar"></div>
                      {/* Sirf tab dikhao jab last item na ho */}
                      {idx !== workExperience.length - 1 && (
                        <div className="icn-bar-2"></div>
                      )}
                    </div>
                    <div className="date mt-1">
                      <h5>
                        {edu.degree || "N/A"}
                        <span>
                          {edu.startDate && edu.endDate
                            ? `${new Date(
                                edu.startDate
                              ).getFullYear()} - ${new Date(
                                edu.endDate
                              ).getFullYear()}`
                            : ""}
                        </span>
                      </h5>
                      <p className="company mt-1">
                        {edu.school || edu.institution || "N/A"}
                      </p>
                      <p className="w-50 text-color">{edu.description || ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio */}
          {/* Portfolio */}
          <div className="row mt-5 mb-5">
            <div className="col-md-12">
              <h2 className="fs-5 pb-4">Portfolio</h2>
              <div className="d-flex flex-wrap gap-4">
                {portfolio.length > 0 ? (
                  portfolio.map((item, idx) => (
                    <div
                      key={idx}
                      // className=" border-0 shadow-sm rounded-3 overflow-hidden"
                      style={{
                        width: "220px",
                        cursor: item.link ? "pointer" : "default",
                        transition: "transform 0.3s ease",
                      }}
                      onClick={() => {
                        if (item.link) window.open(item.link, "_blank");
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <img
                        src={
                          item.image
                            ? item.image
                            : "https://via.placeholder.com/220x140?text=No+Image"
                        }
                        alt={item.title || "Portfolio Project"}
                        className="card-img-top"
                        style={{ height: "140px", objectFit: "cover" }}
                      />
                      <div className="card-body p-2 text-center">
                        <h6 className="mb-0 text-dark fw-semibold">
                          {item.title || "Untitled Project"}
                        </h6>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No portfolio items available.</p>
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

export default Profile;
