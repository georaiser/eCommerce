// 1. Import all your models
import User from './User.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Cart from './Cart.js';
import sequelize from '../../config/ORM/db.js';

// 2. Define the Relationships (Associations)

// A User has many Orders. An Order belongs to one User.
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// An Order has many Products (Many-to-Many through OrderItem)
Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'order_id' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'product_id' });

// A User has many Cart items.
User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// A Product can be in many Carts. A Cart item belongs to a specific Product.
Product.hasMany(Cart, { foreignKey: 'product_id' });
Cart.belongsTo(Product, { foreignKey: 'product_id' });

// 3. Export everything so the controllers can use them!
export { sequelize, User, Product, Order, OrderItem, Cart };