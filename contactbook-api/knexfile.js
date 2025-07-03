// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// require("dotenv").config();
// module.exports = {
//   development: {
//     client: "postgresql",
//     connection: {
//       host: process.env.DB_HOST,
//       port: process.env.DB_PORT,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//     },
//     pool: {
//       min: 2,
//       max: 10,
//     },
//     migrations: {
//       tableName: "knex_migrations",
//     },
//   },
// };
require("dotenv").config();

module.exports = {
  development: {
    client: "pg", // ✅ nên dùng 'pg' thay vì 'postgresql'
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false, // ✅ Bắt buộc với Neon
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds", // thêm nếu bạn dùng seed
    },
  },
};
