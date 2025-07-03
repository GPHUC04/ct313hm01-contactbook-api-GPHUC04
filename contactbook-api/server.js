// require("dotenv").config();
// const app = require("./src/app");
// const db = require("./src/database/knex");

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, (error) => {
//   if (error) {
//     console.error(`Error starting server: ${error.message}`);
//   } else {
//     console.log(`Server is running on port ${PORT}`);
//     console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
//     console.log("Type:", typeof process.env.DB_PASSWORD);

//     // Test database connection
//     db.raw("SELECT 1")
//       .then(() => {
//         console.log("Database connection successful");
//       })
//       .catch((dbError) => {
//         console.error(" Database connection failed:", dbError.message);
//       });
//   }
// });
// require("dotenv").config();
// const app = require("./src/app");
// const db = require("./src/database/knex");

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, (error) => {
//   if (error) {
//     console.error(`Error starting server: ${error.message}`);
//   } else {
//     console.log(`Server is running on port ${PORT}`);
//     console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
//     console.log("Type:", typeof process.env.DB_PASSWORD);

//     // Test database connection
//     db.raw("SELECT 1")
//       .then(() => {
//         console.log("Database connection successful");
//       })
//       .catch((dbError) => {
//         console.error("Database connection failed:", dbError.message);
//       });
//   }
// });

require("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(version);
  } catch (error) {
    console.error("DB Error:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Database error");
  }
};

http.createServer(requestHandler).listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
