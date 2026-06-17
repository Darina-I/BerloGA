import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface MakerAttributes {
  id?: number;
  name: string;
}

class Maker extends Model<MakerAttributes> {}

Maker.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "makers",
    sequelize,
    timestamps: true,
  },
);

export default Maker;
