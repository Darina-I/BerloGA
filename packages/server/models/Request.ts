import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface RequestAttributes {
  id?: number;
  name: string;
  is_done: boolean;
  user_id: number;
  details?: string;
}

class Request extends Model<RequestAttributes> {}

Request.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
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
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "requests",
    sequelize,
    timestamps: true,
  },
);

export default Request;
