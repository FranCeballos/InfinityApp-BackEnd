// MariaDb and SQLite3 not implemented yet.

let productsDao;
let cartsDao;
export const server = "json";

switch (server) {
  case "json":
    const { default: ProductsDaoFiles } = await import(
      "./products/ProductsDaoFiles.js"
    );
    const { default: CartsDaoFiles } = await import("./carts/CartsDaoFiles.js");

    productsDao = new ProductsDaoFiles();
    cartsDao = new CartsDaoFiles();
    break;
  case "mongodb":
    const { default: ProductsDaoMongoDb } = await import(
      "./products/ProductsDaoMongoDb.js"
    );
    const { default: CartsDaoMongoDb } = await import(
      "./carts/CartsDaoMongoDb.js"
    );

    productsDao = new ProductsDaoMongoDb();
    cartsDao = new CartsDaoMongoDb();
    break;
  case "firebase":
    const { default: ProductsDaoFirebase } = await import(
      "./products/ProductsDaoFirebase.js"
    );
    const { default: CartsDaoFirebase } = await import(
      "./carts/CartsDaoFirebase.js"
    );

    productsDao = new ProductsDaoFirebase();
    cartsDao = new CartsDaoFirebase();
    break;
  case "mariadb":
    break;
  case "sqlite3":
    break;
  default:
    break;
}

export { productsDao, cartsDao };
