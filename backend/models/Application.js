import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import User from "./User.js";
import Job from "./Job.js";

const Application = sequelize.define("Application", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: "read",
  },
  // status: {
  //   type: DataTypes.ENUM("Pending", "Reviewed", "Accepted", "Rejected"),
  //   defaultValue: "Pending",
  // },
  // coverLetter: {
  //   type: DataTypes.TEXT,
  //   allowNull: true,
  // },
  // resumeUrl: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  // },
});

// Relations
User.hasMany(Application, { foreignKey: "userId" });
Application.belongsTo(User, { foreignKey: "userId" });

Job.hasMany(Application, { foreignKey: "jobId" });
Application.belongsTo(Job, { foreignKey: "jobId" });

export default Application;
