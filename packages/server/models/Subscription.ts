import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db";

interface SubscriptionAttributes {
  id?: number;
  user_id: number; //внешний ключ
  account: string; //внешний ключ
}

class Subscription extends Model<SubscriptionAttributes> {}

Subscription.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    account: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "subscriptions",
    sequelize,
    timestamps: true,
  },
);

export default Subscription;
