import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../../config/ORM/db.js";

const Cart = sequelize.define('cart', {
    //id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Removed to let Sequelize handle it
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { timestamps: false, tableName: 'cart' });

export default Cart;
