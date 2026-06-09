import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import FavouriteGenre from "./FavouriteGenre";
import GenreGame from "./GenreGame";

interface GenreAttributes {
  id?: number;
  name: string;
}

class Genre extends Model<GenreAttributes> {}

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

Genre.hasMany(FavouriteGenre, {
  foreignKey: "genre_id",
  as: "favouritegenres",
});

Genre.hasMany(GenreGame, {
  foreignKey: "genre_id",
  as: "genregames",
});

export default Genre;
