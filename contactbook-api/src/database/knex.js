// require("dotenv").config();
// const knex = require("knex");

// const config = {
//   client: "pg",
//   connection: {
//     host: process.env.DB_HOST || "localhost",
//     port: process.env.DB_PORT || 5432,
//     user: process.env.DB_USER || "postgres",
//     password: "123456",
//     database: process.env.DB_NAME || "contactbook",
//   },
//   pool: {
//     min: 2,
//     max: 10,
//   },
//   migrations: {
//     tableName: "knex_migrations",
//   },
// };

// module.exports = knex(config);
// const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;
// const types = require("pg").types;
// types.setTypeParser(types.builtins.INT8, (value) => {
//   return parseInt(value, 10);
// });
// module.exports = require("knex")({
//   client: "pg",
//   connection: {
//     host: DB_HOST,
//     port: DB_PORT,
//     user: DB_USER,
//     password: "npg_rXVdTx0BAWq1",
//     database: DB_NAME,
//   },
//   pool: { min: 0, max: 10 },
// });
require("dotenv").config();
const knex = require("knex");
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

const types = require("pg").types;
types.setTypeParser(types.builtins.INT8, (value) => parseInt(value, 10));

module.exports = knex({
  client: "pg",
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: "npg_rXVdTx0BAWq1",
    database: DB_NAME,
    ssl: { rejectUnauthorized: false }, // ✅ Thêm dòng này
  },
  pool: { min: 0, max: 10 },
});
