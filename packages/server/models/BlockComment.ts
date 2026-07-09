import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface BlockCommentAttributes {
  id?: number;
  game_id: number;
  author_id: number;
  header: string;
  deleted_at?: Date;
}

class BlockComment extends Model<BlockCommentAttributes> {}

BlockComment.init(
  {
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
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    header: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "blockscomments",
    sequelize,
    timestamps: true,
  },
);

export default BlockComment;
