const knex = require("../database/knex");
const Paginator = require("./paginator.js");
const fs = require("fs").promises;
const path = require("path");
// // Thêm vào đầu file contact.service.js để debug

// // Test database connection
// async function testDatabaseConnection() {
//   try {
//     const result = await knex.raw("SELECT 1+1 as result");
//     console.log("Database connection OK:", result);

//     // Test table exists
//     const tableExists = await knex.schema.hasTable("contacts");
//     console.log("Table contacts exists:", tableExists);

//     // Test simple query
//     const contacts = await knex("contacts").limit(1);
//     console.log("Sample contact:", contacts);
//   } catch (error) {
//     console.error("Database test failed:", error);
//   }
// }

// // Gọi function này khi server start
// testDatabaseConnection();

function contactRepository() {
  return knex("contacts");
}
const { unlink } = require("node:fs");
function readContactData(payload) {
  return {
    ...(typeof payload.name === "string" &&
      payload.name.trim() !== "" && { name: payload.name.trim() }),
    ...(payload.email && { email: payload.email }),
    ...(payload.address && { address: payload.address }),
    ...(payload.phone && { phone: payload.phone }),
    ...(payload.favorite !== undefined && {
      favorite: payload.favorite === "true" || payload.favorite === true,
    }),
    ...(payload.avatar && { avatar: payload.avatar }),
  };
}

// define function for accessing the database

async function createContact(payload) {
  const contactData = readContactData(payload);
  const [id] = await contactRepository().insert(contactData).returning("id");
  return { id, ...contactData };
}

// Định nghĩa contactRepository

async function getManyContacts(query) {
  try {
    const { name, favorite, page = 1, limit = 5 } = query;
    const paginator = new Paginator(page, limit);

    // Debug query parameters
    // console.log("Query params:", { name, favorite, page, limit });
    // console.log("Paginator:", {
    //   offset: paginator.offset,
    //   limit: paginator.limit,
    // });

    const result = await contactRepository()
      .where((builder) => {
        if (name) {
          builder.where("name", "ilike", `%${name}%`); // ilike cho PostgreSQL
        }
        if (favorite !== undefined && favorite !== null) {
          builder.where("favorite", favorite === "true");
        }
      })
      .select(
        knex.raw("COUNT(*) OVER() AS total_records"),
        "id",
        "name",
        "email",
        "address",
        "phone",
        "favorite",
        "avatar"
      )
      .orderBy("id", "asc")
      .limit(paginator.limit)
      .offset(paginator.offset);

    console.log("Raw result:", result); // Debug kết quả

    const totalRecords =
      result.length > 0 ? parseInt(result[0]?.total_records ?? 0) : 0;

    const contacts = result.map((contact) => {
      const { total_records, ...contactData } = contact;
      return contactData;
    });

    return {
      metadata: paginator.getMetadata(totalRecords),
      contacts,
    };
  } catch (error) {
    console.error("Error in getManyContacts:", error);
    console.error("Error details:", error.message);
    throw error;
  }
}

async function getContactById(id) {
  return contactRepository().where("id", id).select("*").first();
}
async function updateContact(id, updateData) {
  const numericId = parseInt(id);
  const existingContact = await contactRepository()
    .where("id", numericId)
    .first();

  if (!existingContact) {
    return null;
  }

  const contactData = readContactData(updateData);

  if (Object.keys(contactData).length === 0) {
    return existingContact;
  }

  if (
    contactData.avatar &&
    existingContact.avatar &&
    contactData.avatar !== existingContact.avatar &&
    existingContact.avatar.startsWith("/public/uploads/")
  ) {
    try {
      await unlink(`.${existingContact.avatar}`);
    } catch (error) {
      console.log("Could not delete old avatar:", error);
    }
  }

  await contactRepository().where("id", numericId).update(contactData);

  const updatedContact = await contactRepository()
    .where("id", numericId)
    .first();

  return updatedContact;
}
async function getContactById(id) {
  try {
    console.log(
      "Service: getContactById called with ID:",
      id,
      "Type:",
      typeof id
    );

    const contact = await contactRepository()
      .where("id", parseInt(id))
      .select("*")
      .first();

    console.log("Service: Found contact:", contact);
    return contact;
  } catch (error) {
    console.error("Service: getContactById error:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
}

async function updateContact(id, updateData) {
  try {
    console.log(
      "Service: updateContact called with ID:",
      id,
      "Data:",
      updateData
    );

    const numericId = parseInt(id);
    const existingContact = await contactRepository()
      .where("id", numericId)
      .first();

    if (!existingContact) {
      console.log("Service: Contact not found with ID:", numericId);
      return null;
    }

    const contactData = readContactData(updateData);
    console.log("Service: Processed contact data:", contactData);

    if (Object.keys(contactData).length === 0) {
      console.log("Service: No data to update, returning existing contact");
      return existingContact;
    }

    if (
      contactData.avatar &&
      existingContact.avatar &&
      contactData.avatar !== existingContact.avatar &&
      existingContact.avatar.startsWith("/public/uploads/")
    ) {
      try {
        await unlink(`.${existingContact.avatar}`);
      } catch (error) {
        console.log("Could not delete old avatar:", error);
      }
    }

    await contactRepository().where("id", numericId).update(contactData);
    const updatedContact = await contactRepository()
      .where("id", numericId)
      .first();

    console.log("Service: Updated contact:", updatedContact);
    return updatedContact;
  } catch (error) {
    console.error("Service: updateContact error:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
}

// async function deleteContact(id) {
//   const deletedContact = await contactRepository()
//     .where("id", id)
//     .select("avatar")
//     .first();

//   if (!deletedContact) {
//     return null;
//   }

//   await contactRepository().where("id", id).del();

//   if (
//     deletedContact.avatar &&
//     deletedContact.avatar.startsWith("/public/uploads")
//   ) {
//     fs.unlink(`.${deletedContact.avatar}`, (err) => {
//       if (err) console.error("Error deleting avatar:", err);
//     });
//   }

//   return deletedContact;
// }
async function deleteContact(id) {
  const deletedContact = await contactRepository()
    .where("id", id)
    .select("avatar")
    .first();

  if (!deletedContact) {
    return null;
  }

  await contactRepository().where("id", id).del();

  if (
    deletedContact.avatar &&
    deletedContact.avatar.startsWith("/public/uploads")
  ) {
    const filePath = path.join(__dirname, "..", deletedContact.avatar); // Đường dẫn tuyệt đối
    try {
      await fs.unlink(filePath); // Xóa file với async/await
      console.log(`Avatar deleted: ${filePath}`);
    } catch (err) {
      console.error("Error deleting avatar:", err);
      // Có thể ném lỗi lên nếu cần thiết, nhưng có thể bỏ qua nếu không quan trọng
    }
  }

  return deletedContact;
}

async function deleteAllContacts() {
  const contacts = await contactRepository().select("avatar");
  await contactRepository().del();

  contacts.forEach((contact) => {
    if (contact.avatar && contact.avatar.startsWith("/public/uploads")) {
      unlink(`.${contact.avatar}`, () => {});
    }
  });
}
module.exports = {
  createContact,
  contactRepository,
  readContactData,
  getManyContacts,
  getContactById,
  updateContact,
  deleteContact,
  deleteAllContacts,
};
