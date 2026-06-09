import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";
import City from "./City";
import Request from "./Request";
import Library from "./Library";
import BlockComment from "./BlockComment";
import Comment from "./Comment";
import Complaint from "./Complaint";
import FavouriteGenre from "./FavouriteGenre";

interface UserAttributes {
  id?: number;
  nickname: string;
  email?: string;
  city?: string;
  password: string;
  social_network?: string;
  is_show_city: boolean;
  role: "admin" | "user";
}

class User extends Model<UserAttributes> {}

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
    city: {
      type: DataTypes.STRING,
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

User.belongsTo(City, {
  foreignKey: "city_id",
  as: "city",
});

User.hasMany(Request, {
  foreignKey: "user_id",
  as: "requests",
});

User.hasMany(Library, {
  foreignKey: "user_id",
  as: "libraries",
});

User.hasMany(BlockComment, {
  foreignKey: "user_id",
  as: "blockscomments",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
  as: "comments",
});

User.hasMany(Complaint, {
  foreignKey: "user_id",
  as: "complaints",
});

User.hasMany(FavouriteGenre, {
  foreignKey: "user_id",
  as: "favouritegenres",
});

export default User;
