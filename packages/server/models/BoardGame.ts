import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import Maker from "./Maker";
import Library from "./Library";
import BlockComment from "./BlockComment";
import GenreGame from "./GenreGame";

interface BoardGameAttributes {
  id?: number;
  name: string;
  photo: string;
  rating: number;
  content: string;
  age: number;
  min_number_players: number;
  max_number_players: number;
  maker_id: number;
}

class BoardGame extends Model<BoardGameAttributes> {}

BoardGame.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    min_number_players: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    max_number_players: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maker_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "makers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "boardgames",
    sequelize,
    timestamps: true,
  },
);

BoardGame.belongsTo(Maker, {
  foreignKey: "maker_id",
  as: "maker",
});

BoardGame.hasMany(Library, {
  foreignKey: "game_id",
  as: "libraries",
});

BoardGame.hasMany(BlockComment, {
  foreignKey: "game_id",
  as: "blockscomments",
});

BoardGame.hasMany(GenreGame, {
  foreignKey: "game_id",
  as: "genresgame",
});

export default BoardGame;
