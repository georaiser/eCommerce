import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../../config/ORM/db.js";

const Order = sequelize.define('orders', {
    //id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Removed to let Sequelize handle it
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_paid: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { timestamps: false});

export default Order;
