import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface LibraryAttributes {
  id?: number;
  user_id: number;
  game_id: number;
  rate: number;
}

class Library extends Model<LibraryAttributes> {}

Library.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    game_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "boardgames",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "libraries",
    sequelize,
    timestamps: true,
  },
);

export default Library;
