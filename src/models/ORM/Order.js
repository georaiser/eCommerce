import { DataTypes } from "sequelize";
import sequelize from "../../config/ORM/db";

const Order = sequelize.define('order', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_paid: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

export default Order;
