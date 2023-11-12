import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "misetec",
};

const pool = mysql.createPool(DB_CONFIG);

export default pool;
