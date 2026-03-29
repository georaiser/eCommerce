import { DataTypes } from "sequelize";
import sequelize from "../../config/ORM/db.js";

const Cart = sequelize.define('cart', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: false });

export default Cart;
