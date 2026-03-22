import { pool } from '../config/db.js';

//get all users
const getAllUsers = async () => {
    const {rows} = await pool.query('SELECT * FROM users');
    return rows[0];
};

//create user
const createUser = async (name, email, password, role) => {
    const query = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *'
    const data = [name, email, password, role]
    const {rows} = await pool.query(query, data);
    return rows[0];
};

//delete user by id
const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *'
    const data = [id]
    const {rows} = await pool.query(query, data);
    return rows[0];
};

//update user by id
const updateUser = async (id, name, email, password, role) => {
    const query = 'UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING *'
    const data = [name, email, password, role, id]
    const {rows} = await pool.query(query, data);
    return rows[0];
};

//get user by id
const getUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1'
    const data = [id]
    const {rows} = await pool.query(query, data);
    return rows[0];
};

export { getAllUsers, createUser, deleteUser, updateUser, getUserById };