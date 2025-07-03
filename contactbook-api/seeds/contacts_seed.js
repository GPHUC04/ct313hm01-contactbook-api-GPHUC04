const { faker } = require("@faker-js/faker");
function createContact() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    phone: faker.helpers.replaceSymbols("09########"),
    favorite: faker.datatype.boolean(),
    avatar: "/public/images/blank-profile-picture.png",
  };
}
exports.seed = async function (knex) {
  await knex("contacts").del();
  await knex("contacts").insert(Array(100).fill().map(createContact));
};
