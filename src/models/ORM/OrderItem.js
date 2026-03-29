import { DataTypes } from "sequelize";
import sequelize from "../../config/ORM/db.js";

const OrderItem = sequelize.define('orderItem', {
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price_at_purchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { timestamps: false });

export default OrderItem;