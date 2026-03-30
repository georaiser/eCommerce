import { DataTypes } from "sequelize";
import sequelize from "../../config/ORM/db.js";

const Product = sequelize.define('product', {
    //id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Removed to let Sequelize handle it
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: false, tableName: 'products' });

export default Product;