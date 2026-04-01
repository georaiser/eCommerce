import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../../config/ORM/db.js";
import bcrypt from 'bcryptjs';

const User = sequelize.define('user', {
    //id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Removed to let Sequelize handle it
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    credit: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { 
    timestamps: false, 
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) user.password = await bcrypt.hash(user.password, 8);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) user.password = await bcrypt.hash(user.password, 8);
        }
    }
});

// Instance method cleanly attached via Prototype (A perfectly valid and concise pattern!)
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export default User;