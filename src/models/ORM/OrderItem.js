import { DataTypes } from "sequelize";
import sequelize from "../../config/ORM/db.js";

const OrderItem = sequelize.define('order_items', {
    order_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },   // Composite Primary Key
    product_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false }, // Composite Primary Key
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price_at_purchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { timestamps: false});

export default OrderItem;