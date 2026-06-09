import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import Genre from "./Genre";
import BoardGame from "./BoardGame";

interface GenreGameAttributes {
  id?: number;
  genre_id: number;
  game_id: number;
}

class GenreGame extends Model<GenreGameAttributes> {}

GenreGame.init(
  {
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

GenreGame.belongsTo(Genre, {
  foreignKey: "genre_id",
  as: "genre",
});

GenreGame.belongsTo(BoardGame, {
  foreignKey: "game_id",
  as: "game",
});

export default GenreGame;
