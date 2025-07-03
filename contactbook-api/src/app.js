// const express = require("express");
// const cors = require("cors");
// const app = express();
// const swaggerUi = require("swagger-ui-express");

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const contactRoute = require("./routes/contact-route");
// const {
//   resourceNotFound,
//   handleError,
// } = require("./controllers/error.controller");
// const JSend = require("./jsend");
// const swaggerDocument = require("../docs/openapiSpec.json");
// app.get("/", (req, res) => {
//   // return res.json({
//   //   message: "ok",
//   // });
//   return res.json(JSend.sucess());
// });
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use("/public", express.static("public"));
// contactRoute.setup(app);
// app.use(resourceNotFound);
// app.use(handleError);
// module.exports = app;
const express = require("express");
const cors = require("cors");
const app = express();
const swaggerUi = require("swagger-ui-express");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const contactRoute = require("./routes/contact-route");
const {
  resourceNotFound,
  handleError,
} = require("./controllers/error.controller");
const JSend = require("./jsend");
const swaggerDocument = require("../docs/openapiSpec.json");

app.get("/", (req, res) => {
  return res.json(JSend.success());
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/public", express.static("public"));
contactRoute.setup(app);
app.use(resourceNotFound);
app.use(handleError);

module.exports = app;
