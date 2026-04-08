import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../../config/ORM/db.js";
import bcrypt from 'bcryptjs';

const User = sequelize.define('users', {
    //id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // Removed to let Sequelize handle it
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    credit: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
}, { 
    timestamps: false, 
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);  // salt is a random string that is added to the password before hashing
                user.password = await bcrypt.hash(user.password, salt);
            };
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            };
        }
    }
});

// Instance method cleanly attached via Prototype (A perfectly valid and concise pattern!)
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export default User;