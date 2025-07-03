const ApiError = require("../api-error");
const JSend = require("../jsend");
function methodNotAllowed(req, res, next) {
  if (req.route) {
    const httpMethods = Object.keys(req.route.methods)
      .filter((method) => method !== "_all")
      .map((method) => method.toUpperCase());
    return next(
      new ApiError(
        405,
        QA`Method Not Allowed. Allowed methods: ${httpMethods.join(", ")}`
      )
    );
  }
  return next();
}
function resourceNotFound(req, res, next) {
  return next(new ApiError(404, "Resource Not Found"));
}

function handleError(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;

  const message = error.message || "Internal Server Error";
  return res
    .status(statusCode)
    .set(error.headers || {})
    .json(statusCode >= 500 ? JSend.error(message) : JSend.fail(message));
}

module.exports = {
  methodNotAllowed,
  resourceNotFound,
  handleError,
};
