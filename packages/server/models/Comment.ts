import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import BlockComment from "./BlockComment";
import User from "./User";

interface CommentAttributes {
  id?: number;
  blockComment_id: number;
  user_id: string;
  content: string;
  deleted_at?: Date;
}

class Comment extends Model<CommentAttributes> {}

Comment.init(
  {
    blockComment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "blockscomments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "comments",
    sequelize,
    timestamps: true,
  },
);

Comment.belongsTo(BlockComment, {
  foreignKey: "blockComment_id",
  as: "blockComment",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

export default Comment;
