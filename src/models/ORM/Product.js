import { DataTypes } from "sequelize";
import sequelize from "../../config/ORM/db";

const Product = sequelize.define('product', {
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
});

export default Product;