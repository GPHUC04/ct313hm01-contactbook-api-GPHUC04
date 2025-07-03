const JSend = require("../jsend");
const contactService = require("../servives/contact.service");
const ApiError = require("../api-error");
const { update } = require("../database/knex");
// function createContact(req, res) {
//   return res.status(201).json({
//     contact: {},
//   });
// }

const DEFAULT_AVATAR = "/public/images/blank-profile-picture.png";
function getAvatarUrlPath(file) {
  return file ? `/public/uploads/${file.filename}` : DEFAULT_AVATAR;
}
async function createContact(req, res, next) {
  try {
    const input = req.body;
    const contactData = {
      ...input,
      avatar: getAvatarUrlPath(req.file),
    };

    if (!contactData.name) {
      return res.status(400).json({
        status: "fail",
        message: "Name is required",
      });
    }

    const contact = await contactService.createContact(contactData);

    return res
      .status(201)
      .set({ Location: `${req.baseUrl}/${contact.id}` })
      .json(JSend.success({ contact }));
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "internal server error"));
  }
}

// function getContactByFilter(req, res) {
//   const filter = [];
//   const { favorite, name } = req.query;
//   if (favorite !== undefined) {
//     filter.push(`favorite=${favorite}`);
//   }
//   if (name) {
//     filter.push(`name=${name}`);
//   }
//   console.log(filter.join("&"));
async function getContactByFilter(req, res, next) {
  let result = {
    contacts: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };
  try {
    result = await contactService.getManyContacts(req.query);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "internal server error"));
  }

  return res.json(
    JSend.success({
      contact: result.contacts,
      metadata: result.metadata,
    })
  );
}

//   return res.json({ contacts: [] });
// }

// function getContact(req, res) {
//   return res.json({
//     contact: {},
//   });
async function getContact(req, res, next) {
  const { id } = req.params;
  console.log("Received ID:", id); // Debug log

  try {
    const contact = await contactService.getContactById(id);
    console.log("Contact from DB:", contact); // Debug log

    if (!contact) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.json(JSend.success({ contact }));
  } catch (error) {
    console.log("Error details:", error); // Chi tiết lỗi
    return next(new ApiError(500, "Internal Server Error!"));
  }
}

// function updateContact(req, res) {
//   return res.json({
//     contact: {},
//   });
async function updateContact(req, res, next) {
  const { id } = req.params;
  try {
    const updateData = {
      ...req.body,
      ...(req.file && { avatar: getAvatarUrlPath(req.file) }),
    };
    const updated = await contactService.updateContact(id, updateData);
    if (!updated) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.json(
      JSend.success({
        contact: updated,
      })
    );
  } catch (errorr) {
    console.log(errorr);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function deleteContact(req, res, next) {
  const id = Number(req.params.id);

  try {
    const deleted = await contactService.deleteContact(id);
    if (!deleted) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.json(JSend.success());
  } catch (error) {
    console.error("Delete error:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function deleteAllContacts(req, res, next) {
  try {
    await contactService.deleteAllContacts();
    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

module.exports = {
  createContact,
  getContactByFilter,
  getContact,
  updateContact,
  deleteContact,
  deleteAllContacts,
};
