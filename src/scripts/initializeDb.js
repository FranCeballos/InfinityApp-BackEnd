import knex from "knex";
import config from "../config.js";

const knexClientMariaDb = knex(config.mariaDb);
const knexClientSQLite3 = knex(config.sqlite3);

(async () => {
  try {
    await knexClientMariaDb.schema.dropTableIfExists("products");
    await knexClientSQLite3.schema.dropTableIfExists("messages");

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

    await knexClientSQLite3.schema.createTable("messages", (table) => {
      table.string("socketid").notNullable();
      table.json("message").notNullable();
    });
  } catch (err) {
    console.log(err);
  } finally {
    knexClientMariaDb.destroy();
    knexClientSQLite3.destroy();
  }
})();
