const config = {
  sqlite3: {
    client: "sqlite3",
    connection: {
      filename: `./DB/ecommerce.sqlite`,
    },
    useNullAsDefault: true,
  },
  mariaDb: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "root",
      port: 3306,
      database: "test",
    },
  },
};

module.exports = config;
