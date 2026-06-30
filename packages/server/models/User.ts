import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface UserAttributes {
  id?: number;
  nickname: string;
  email?: string;
  city_id?: number;
  password: string;
  social_network?: string;
  is_show_city?: boolean;
  role: "admin" | "user";
}

class User extends Model<UserAttributes> {
  declare id: number;
  declare nickname: string;
  declare email?: string;
  declare city?: Record<string, string | number>;
  declare password: string;
  declare social_network?: string;
  declare is_show_city?: boolean;
  declare role: "admin" | "user";
}

User.init(
  {
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "cities",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    social_network: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_show_city: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
  },
  {
    tableName: "users",
    sequelize,
    timestamps: true,
  },
);

export default User;
