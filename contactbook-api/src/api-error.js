class ApiError extends Error {
  constructor(statusCode, message, headrers = {}) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.headrers = headrers;
  }
}
module.exports = ApiError;
