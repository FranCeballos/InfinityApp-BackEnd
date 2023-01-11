// MariaDb and SQLite3 not implemented yet.

import knex from "knex";

class ContainerSQL {
  constructor(config, table) {
    this.knex = knex(config);
    this.table = table;
  }

  // [C]reate
  async create(item) {
    const ids = await this.knex(this.table).insert(item);
    console.log(ids);
    return ids;
  }

  // [R]ead
  async read() {
    return await this.knex(this.table).select("*").limit(100);
  }

  async readById(id) {
    return await this.knex(this.table).where("id", id).select("*");
  }

  // [U]pdate
  async update(id, item) {
    const dbId = await this.knex(this.table).where("id", id).update(item);
    console.log("Product updated.");
    return dbId;
  }

  // [D]elete
  async deleteById(id) {
    await this.knex(this.table).where("id", id).del();
    console.log("Product deleted.");
  }
}

export default ContainerSQL;
