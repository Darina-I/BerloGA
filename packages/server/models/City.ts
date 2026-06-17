import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

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

export default City;
