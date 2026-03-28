import { DataTypes } from "sequelize";
import sequelize from "../../config/ORM/db";

const Cart = sequelize.define('cart', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

export default Cart;
