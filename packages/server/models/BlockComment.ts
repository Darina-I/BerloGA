import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import BoardGame from "./BoardGame";
import User from "./User";
import Comment from "./Comment";

interface BlockCommentAttributes {
  id?: number;
  game_id: number;
  author: string;
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
    author: {
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

BlockComment.belongsTo(BoardGame, {
  foreignKey: "game_id",
  as: "game",
});

BlockComment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

BlockComment.hasMany(Comment, {
  foreignKey: "blockComment_id",
  as: "comments",
});

export default BlockComment;
