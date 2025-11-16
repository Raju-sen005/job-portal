import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Company from "./Company.js";

const Auth = sequelize.define(
  "Auth", // ✅ Model name changed to 'Auth'
  {
    authId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "authId", // ✅ DB column name bhi same
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
  },
  { tableName: "auth", timestamps: true }
);

// ✅ Relation defined here
Auth.hasOne(Company, { foreignKey: "authId" }); // Company table me 'authId' column hoga
Company.belongsTo(Auth, { foreignKey: "authId" });

export default Auth;