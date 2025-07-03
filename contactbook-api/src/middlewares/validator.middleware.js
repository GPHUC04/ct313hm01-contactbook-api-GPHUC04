// const { z } = require("zod");
// const ApiError = require("../api-error");
// /**
//  * Validates the request object using the provided zod validator.
//  *
//  * @param {z.AnyZodObject} validator
//  */
// function validateRequest(validator) {
//   return (req, res, next) => {
//     try {
//       let data = {};

//       if (req.method === "GET" || req.method === "DELETE") {
//         data = { ...req.params, ...req.query };
//       } else if (req.method === "POST" || req.method === "PUT") {
//         data = {
//           ...req.body,
//           avatarFile: req.body?.avatarFile,
//         };
//       }

//       validator.parse(data);
//       return next();
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const errorMessages = error.issues.map((issue) => {
//           const errorPath = issue.path.join(".");
//           if (issue.code === z.ZodIssueCode.unrecognized_keys) {
//             const invalidKeys = issue.keys.join(", ");
//             return `${errorPath} contains invalid keys: ${invalidKeys}`;
//           }
//           return `${errorPath}: ${issue.message}`;
//         });
//         return next(new ApiError(400, errorMessages.join("; ")));
//       }
//       return next(new ApiError(500, "Internal Server Error"));
//     }
//   };
// }

// module.exports = {
//   validateRequest,
// };
// File: src/middlewares/validate-request.js

// const ApiError = require("../api-error");
// const { z } = require("zod");
// function validateRequest(validator) {
//   return (req, res, next) => {
//     try {
//       console.log("req.params:", req.params); // Thêm log
//       let data = {};
//       if (req.method === "GET" || req.method === "DELETE") {
//         data = { ...req.params, ...req.query };
//       } else if (req.method === "POST" || req.method === "PUT") {
//         data = {
//           ...req.body,
//           avatarFile: req.body?.avatarFile,
//         };
//       }
//       validator.parse(data);
//       return next();
//     } catch (error) {
//       console.log("Validation error:", error); // Thêm log
//       if (error instanceof z.ZodError) {
//         const errorMessages = error.issues.map((issue) => {
//           const errorPath = issue.path.join(".");
//           if (issue.code === z.ZodIssueCode.unrecognized_keys) {
//             const invalidKeys = issue.keys.join(", ");
//             return `${errorPath} contains invalid keys: ${invalidKeys}`;
//           }
//           return `${errorPath}: ${issue.message}`;
//         });
//         return next(new ApiError(400, errorMessages.join("; ")));
//       }
//       return next(new ApiError(500, "Internal Server Error"));
//     }
//   };
// }
// module.exports = {
//   validateRequest,
// };

// File: src/middlewares/validator.middleware.js
// const { z } = require("zod");
// const ApiError = require("../api-error");

// function validateRequest(validator) {
//   return (req, res, next) => {
//     try {
//       console.log("req.params:", req.params); // Giữ log để debug
//       let data = {};
//       if (req.method === "GET" || req.method === "DELETE") {
//         data = { ...req.params, ...req.query };
//       } else if (req.method === "POST" || req.method === "PUT") {
//         data = {
//           ...req.body,
//           ...req.params, // Thêm req.params để lấy id
//           avatarFile: req.body?.avatarFile,
//         };
//       }
//       validator.parse(data);
//       return next();
//     } catch (error) {
//       console.log("Validation error:", error);
//       if (error instanceof z.ZodError) {
//         const errorMessages = error.issues.map((issue) => {
//           const errorPath = issue.path.join(".");
//           if (issue.code === z.ZodIssueCode.unrecognized_keys) {
//             const invalidKeys = issue.keys.join(", ");
//             return `${errorPath} contains invalid keys: ${invalidKeys}`;
//           }
//           return `${errorPath}: ${issue.message}`;
//         });
//         return next(new ApiError(400, errorMessages.join("; ")));
//       }
//       return next(new ApiError(500, "Internal Server Error"));
//     }
//   };
// }

// module.exports = {
//   validateRequest,
// };

// const { z } = require("zod");
// const ApiError = require("../api-error");

// function validateRequest(validator) {
//   return (req, res, next) => {
//     try {
//       console.log("req.params:", req.params); // Giữ log để debug
//       console.log("req.body:", req.body); // Log để kiểm tra dữ liệu từ body
//       console.log("req.file:", req.file); // Log để kiểm tra file upload

//       let data = {};
//       if (req.method === "GET" || req.method === "DELETE") {
//         data = { ...req.params, ...req.query };
//       } else if (req.method === "POST" || req.method === "PUT") {
//         // Kết hợp req.body và req.file (nếu có)
//         data = {
//           ...req.body,
//           ...req.params, // Thêm req.params để lấy id
//           avatarFile: req.file ? req.file : req.body.avatarFile, // Lấy file từ multer
//         };
//       }

//       // Loại bỏ các trường undefined hoặc null để tránh lỗi validation
//       data = Object.fromEntries(
//         Object.entries(data).filter(([_, v]) => v != null)
//       );

//       validator.parse(data);
//       return next();
//     } catch (error) {
//       console.log("Validation error:", error);
//       if (error instanceof z.ZodError) {
//         const errorMessages = error.issues.map((issue) => {
//           const errorPath = issue.path.join(".");
//           if (issue.code === z.ZodIssueCode.unrecognized_keys) {
//             const invalidKeys = issue.keys.join(", ");
//             return `${errorPath} contains invalid keys: ${invalidKeys}`;
//           }
//           return `${errorPath}: ${issue.message}`;
//         });
//         return next(
//           new ApiError(
//             400,
//             errorMessages.join("; ") || "Phải cung cấp ít nhất một trường"
//           )
//         );
//       }
//       return next(new ApiError(500, "Internal Server Error"));
//     }
//   };
// }

// module.exports = {
//   validateRequest,
// };

const { z } = require("zod");
const ApiError = require("../api-error");

function validateRequest(validator) {
  return (req, res, next) => {
    try {
      console.log("req.params:", req.params);
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);

      let data = {};
      if (req.method === "GET" || req.method === "DELETE") {
        data = { ...req.params, ...req.query };
      } else if (req.method === "POST" || req.method === "PUT") {
        data = {
          ...req.body,
          ...req.params,
          avatarFile: req.file ? req.file : req.body.avatarFile,
        };
      }

      data = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v != null)
      );

      // Kiểm tra ít nhất một trường có giá trị
      const hasValidField = Object.values(data).some(
        (value) =>
          value && (typeof value === "string" ? value.trim() !== "" : true)
      );
      if (!hasValidField) {
        throw new z.ZodError([
          {
            code: "custom",
            message: "Phải cung cấp ít nhất một trường",
            path: [],
          },
        ]);
      }

      validator.parse(data);
      return next();
    } catch (error) {
      console.log("Validation error:", error);
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue) => {
          const errorPath = issue.path.join(".");
          if (issue.code === z.ZodIssueCode.unrecognized_keys) {
            const invalidKeys = issue.keys.join(", ");
            return `${errorPath} contains invalid keys: ${invalidKeys}`;
          }
          return `${errorPath}: ${issue.message}`;
        });
        return next(
          new ApiError(
            400,
            errorMessages.join("; ") || "Phải cung cấp ít nhất một trường"
          )
        );
      }
      return next(new ApiError(500, "Internal Server Error"));
    }
  };
}

module.exports = { validateRequest };
