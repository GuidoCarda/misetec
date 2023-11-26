import mysql, { PoolOptions } from "mysql2/promise";

const DB_CONFIG: PoolOptions = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "misetec",
  namedPlaceholders: true,
};

const pool = mysql.createPool(DB_CONFIG);

export default pool;
