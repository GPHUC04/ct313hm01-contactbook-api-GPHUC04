const JSend = {
  success: (data, message = "") => ({
    status: "success",
    data: data,
    message: message,
  }),

  fail: (data = null, message = "") => ({
    status: "fail",
    data: data,
    message: message,
  }),

  error: (message = "") => ({
    status: "errors",
    message: message,
  }),
};

module.exports = JSend;
