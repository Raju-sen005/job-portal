import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    experienceLevel: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    salaryFrom: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    salaryTo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: { type: DataTypes.STRING(100), allowNull: true },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON, // Array store karne ke liye
      allowNull: true,
      defaultValue: [],
    },
    benefits: {
      type: DataTypes.JSON, // Array store karne ke liye
      allowNull: true,
      defaultValue: [],
    },
     companyId: {                     // ✅ Add this
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Job;