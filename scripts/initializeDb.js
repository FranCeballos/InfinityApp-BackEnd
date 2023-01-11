import knex from "knex";
import config from "../src/config.js";

const knexClientMariaDb = knex(config.mariaDb);

(async () => {
  try {
    await knexClientMariaDb.schema.dropTableIfExists("products");

    await knexClientMariaDb.schema.createTable("products", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("rating").notNullable();
      table.string("duration").notNullable();
      table.integer("year").notNullable();
      table.string("strService").notNullable();
      table.integer("price").notNullable();
      table.string("img").notNullable();
    });
  } catch (err) {
    console.log(err);
  } finally {
    knexClientMariaDb.destroy();
  }
})();
