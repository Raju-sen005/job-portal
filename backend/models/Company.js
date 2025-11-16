import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Company = sequelize.define(
  "Company",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    companyName: { type: DataTypes.STRING, allowNull: false },
    websiteLink: DataTypes.STRING,
    linkedinLink: DataTypes.STRING,
    twitterLink: DataTypes.STRING,
    beLink: DataTypes.STRING,
    companyLogo: DataTypes.STRING,
    authId: { type: DataTypes.INTEGER, allowNull: false }, // Foreign key only
  },
  { timestamps: true }
);

export default Company;