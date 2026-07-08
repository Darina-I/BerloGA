import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface GenreGameAttributes {
  genre_id: number;
  game_id: number;
}

class GenreGame extends Model<GenreGameAttributes> {}

GenreGame.init(
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
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "boardgames",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "genregames",
    sequelize,
    timestamps: true,
  },
);

export default GenreGame;
