// models/Notification.js
import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import User from "./User.js";
import Job from "./Job.js";

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  jobId: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// Relations
User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

Job.hasMany(Notification, { foreignKey: "jobId" });
Notification.belongsTo(Job, { foreignKey: "jobId" });

export default Notification;
