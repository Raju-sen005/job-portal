import React from 'react'
import companyLogo from "../assets/images/Pathao-logo.svg"

function JobCard({index, category, title, company, location}) {
  return (
    
    <>
    
      <div className="job-card">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <img src={companyLogo} class="company-logo" alt="..."/>
                            <span className="badge-custom">{category}</span>
                        </div>

                        <div className="job-title">{title}</div>
                        <p className="text-color mb-1">{company}</p>
                        <div className="d-flex text-color text-small mb-1"> <i className="bi bi-currency-rupee me-2"></i>30,000
                            - 40,000</div>
                        <div className="d-flex justify-content-between text-color text-small">
                            <span> <i className="bi bi-geo-alt me-2"></i>{location}</span><span className="fs-14px">2 Day
                                ago</span>
                        </div>
                        <button className="quick-apply">Quick Apply</button>
                    </div>

    </>
  )
}

export default JobCard