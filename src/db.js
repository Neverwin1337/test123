import knex from "knex";
import config from "./config.js";
const db = knex({
    client: "mysql2",
    connection: {
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_DATABASE,
    },
});

export default db;
