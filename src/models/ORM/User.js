import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../../config/ORM/db.js";

const User = sequelize.define('user', {
    //id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Removed to let Sequelize handle it
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    credit: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { timestamps: false, tableName: 'users' });

export default User;