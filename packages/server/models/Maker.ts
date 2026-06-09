import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import BoardGame from "./BoardGame";

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

Maker.hasMany(BoardGame, {
  foreignKey: "maker_id",
  as: "boardgames",
});

export default Maker;
