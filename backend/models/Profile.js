import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from "./User.js";

const Profile = sequelize.define("Profile", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // <- must for linking
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  birthday: { type: DataTypes.DATE },
  gender: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  profileImage: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  professional: { type: DataTypes.JSON },
  education: { type: DataTypes.JSON },
  skills: { type: DataTypes.JSON },
  portfolio: { type: DataTypes.JSON },
  confirmHide: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// Association
User.hasOne(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

export default Profile;
