import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface ComplaintAttributes {
  id?: number;
  user_id: number; //внешний ключ
  comment_id: string; //внешний ключ
}

class Complaint extends Model<ComplaintAttributes> {}

Complaint.init(
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
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "comments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "complaints",
    sequelize,
    timestamps: true,
  },
);

export default Complaint;
