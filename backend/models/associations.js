import Job from "./Job.js";
import Company from "./Company.js";

// One Company → Many Jobs
Company.hasMany(Job, {
  foreignKey: "companyId",
  as: "jobs",
});

// Each Job → One Company
Job.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
});

export { Job, Company };
