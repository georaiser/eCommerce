import { pool } from '../config/db.js';

//get all users
const getAllUsers = async () => {
    //const {rows} = await pool.query('SELECT * FROM users');
    const {rows} = await pool.query("SELECT id, name, email, role, credit, TO_CHAR(created_at, 'MM/DD/YYYY HH:MI') as created_at FROM users");
    return rows;
};

//create user
const createUser = async (name, email, password, role, credit) => {
    const query = 'INSERT INTO users (name, email, password, role, credit) VALUES ($1, $2, $3, $4, $5) RETURNING *'
    const data = [name, email, password, role, credit]
    const {rows} = await pool.query(query, data);
    console.log(rows);
    return rows[0];
};

//delete user by id
const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *'
    const data = [id]
    const {rows} = await pool.query(query, data);
    return rows;
};

//update user by id
const updateUser = async (id, name, email, password, role, credit) => {
    const query = 'UPDATE users SET name = $1, email = $2, password = $3, role = $4, credit = $5 WHERE id = $6 RETURNING *'
    const data = [name, email, password, role, credit, id]
    const {rows} = await pool.query(query, data);
    return rows[0];
};

//get user by id
const getUserById = async (id, dbClient = pool) => {
    const query = 'SELECT * FROM users WHERE id = $1'
    const data = [id]
    const { rows } = await dbClient.query(query, data);
    return rows;
};

//update user credit by id
const updateUserCredit = async (id, newCredit, dbClient = pool) => {
    const query = 'UPDATE users SET credit = $1 WHERE id = $2 RETURNING *'
    const data = [newCredit, id]
    const { rows } = await dbClient.query(query, data);
    return rows[0];
};

export { getAllUsers, createUser, deleteUser, updateUser, getUserById, updateUserCredit };