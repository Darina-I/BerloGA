import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface BoardGameAttributes {
  id?: number;
  name: string;
  time?: string;
  photo: string;
  rating?: number;
  content: string;
  age?: number;
  min_number_players?: number;
  max_number_players?: number;
  maker_id: number;
  pdf?: string;
}

class BoardGame extends Model<BoardGameAttributes> {}

BoardGame.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    pdf: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "boardgames",
    sequelize,
    timestamps: true,
  },
);

export default BoardGame;
