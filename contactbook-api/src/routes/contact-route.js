const express = require("express");
const contactController = require("../controllers/contact.controller");
const { methodNotAllowed } = require("../controllers/error.controller");
const {
  contactSchema,
  partialContactSchema,
  contactIdSchema,
} = require("../schemas/contact-schemas");
const { avatarUpload } = require("../middlewares/avartar-upload.midleware");
const router = express.Router();
const { z } = require("zod");
const { validateRequest } = require("../middlewares/validator.middleware");
const { default: rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 20,
  message: "Too many requests from this IP, please try again in a minute",
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(limiter);

const cleanAvatarFile = (req, res, next) => {
  if (req.file) {
    const { originalname, mimetype, size, filename } = req.file;
    req.body.avatarFile = { originalname, mimetype, size, filename };
  }

  // Không gán lại `req.body` hoàn toàn – giữ nguyên dữ liệu `input`
  next();
};

module.exports.setup = (app) => {
  app.use("/api/v1/contacts", router);

  // router.post("/", contactController.createContact);
  // router.post(
  //   "/",
  //   [
  //     avatarUpload,
  //     cleanAvatarFile,
  //     validateRequest(
  //       z.object({
  //         input: contactSchema
  //           .omit({ id: true, avatar: true })
  //           .extend({
  //             avatarFile: z.any().optional(),
  //           })
  //           .strict(),
  //       })
  //     ),
  //   ],
  //   contactController.createContact
  // );

  router.post(
    "/",
    [
      avatarUpload,
      cleanAvatarFile,
      validateRequest(
        partialContactSchema.strict().refine(
          ({ name, email, address, phone, favorite, avatarFile }) => {
            return (
              name ||
              email ||
              address ||
              phone ||
              favorite !== undefined ||
              avatarFile
            );
          },
          {
            message: "Phải cung cấp ít nhất một trường",
          }
        )
      ),
    ],
    contactController.createContact
  );
  // router.get("/", contactController.getContactByFilter);
  router.get(
    "/",
    validateRequest(
      z
        .object({
          name: z.string().optional(),
          favorite: z.enum(["true", "false"]).optional(),
          page: z.coerce.number().nonnegative().default(1),
          limit: z.coerce.number().nonnegative().default(5),
        })
        .strict()
    ),
    contactController.getContactByFilter
  );
  router.delete("/", contactController.deleteAllContacts);
  router.all("/", methodNotAllowed);

  router.get(
    "/:id",
    validateRequest(contactSchema.pick({ id: true }).strict()),
    contactController.getContact
  );

  // router.put("/:id", contactController.updateContact);
  router.put(
    "/:id",
    [
      avatarUpload,
      validateRequest(
        z.object({
          ...partialContactSchema
            .omit({ avatar: true, id: true }) // Loại bỏ avatar và id khỏi body
            .strict()
            .refine(
              ({ name, email, address, phone, favorite, avatarFile }) => {
                return (
                  name ||
                  email ||
                  address ||
                  phone ||
                  favorite !== undefined ||
                  avatarFile
                );
              },
              {
                message: "Phải cung cấp ít nhất một trường",
              }
            ).shape,
          id: z
            .string()
            .regex(/^\d+$/, "ID phải là số nguyên dương") // Kiểm tra chuỗi số trước
            .transform((val) => parseInt(val, 10)) // Chuyển thành số
            .refine((val) => !isNaN(val), {
              message: "ID phải là số hợp lệ",
            }), // Đảm bảo không phải NaN
        })
      ),
    ],
    contactController.updateContact
  );

  // router.delete("/:id", contactController.deleteContact);
  router.delete(
    "/:id",
    validateRequest(
      z.object({
        id: z
          .string()
          .regex(/^\d+$/, "ID phải là số nguyên dương") // Yêu cầu chuỗi số
          .transform((val) => parseInt(val, 10)) // Chuyển thành số
          .refine((val) => !isNaN(val), {
            message: "ID phải là số hợp lệ",
          }),
      })
    ),
    contactController.deleteContact
  );

  router.all("/:id", methodNotAllowed);
};
