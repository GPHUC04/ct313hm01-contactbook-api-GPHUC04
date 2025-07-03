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
require("dotenv").config();
const app = require("./src/app");
const db = require("./src/database/knex");

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Error starting server: ${error.message}`);
  } else {
    console.log(`Server is running on port ${PORT}`);
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
    console.log("Type:", typeof process.env.DB_PASSWORD);

    // Test database connection
    db.raw("SELECT 1")
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((dbError) => {
        console.error("Database connection failed:", dbError.message);
      });
  }
});
