import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface GenreAttributes {
  id?: number;
  name: string;
}

class Genre extends Model<GenreAttributes> {
  declare id: number;
  declare name: string;
}

Genre.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "genres",
    sequelize,
    timestamps: true,
  },
);

export default Genre;
