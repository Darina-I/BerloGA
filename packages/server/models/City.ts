import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import User from "./User";

interface CityAttributes {
  id?: number;
  name: string;
}

class City extends Model<CityAttributes> {}

City.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "cities",
    sequelize,
    timestamps: true,
  },
);

City.hasMany(User, {
  foreignKey: "city_id",
  as: "users",
});

export default City;
