import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface FavouriteGenreAttributes {
  genre_id: number;
  user_id: number;
}

class FavouriteGenre extends Model<FavouriteGenreAttributes> {}

FavouriteGenre.init(
  {
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "genres",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "favouritegenres",
    sequelize,
    timestamps: true,
  },
);

export default FavouriteGenre;
