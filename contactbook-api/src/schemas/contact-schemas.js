// const { z } = require("zod");

// const contactSchema = z.object({
//   id: z.coerce.number().int().nonnegative(),
//   name: z.string().max(100),
//   email: z.string().max(100).optional(),
//   address: z.string().max(255).optional(),
//   phone: z.string().max(15).optional(),
//   favorite: z.coerce.boolean().optional(),
//   avatar: z.string().max(255).optional(),
//   avatarFile: z
//     .any()
//     .refine((file) => {
//       if (file === undefined || file === null) return true;
//       file && typeof file === "object" && file.fieldname === "avatarFile";
//     })
//     .optional(),
// });
// const partialContactSchema = contactSchema.partial();

// module.exports = {
//   contactSchema,
//   partialContactSchema,
// };

const { z } = require("zod");

const contactSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  name: z.string().max(100),
  email: z.string().max(100).optional(),
  address: z.string().max(255).optional(),
  phone: z.string().max(15).optional(),
  favorite: z.coerce.boolean().optional(),
  avatar: z.string().max(255).optional(),
  avatarFile: z
    .any()
    .refine(
      (file) => {
        if (file === undefined || file === null) return true;
        return (
          typeof file === "object" &&
          (file.fieldname === "avatarFile" || file.filename) // Chấp nhận req.file từ multer
        );
      },
      { message: "Invalid avatar file" }
    )
    .optional(),
});
const contactIdSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
});

const partialContactSchema = contactSchema.partial();

module.exports = {
  contactSchema,
  partialContactSchema,
  contactIdSchema,
};
