"use-strict";

const express = require("express");
const app = express();
const router = require("./router");
const bodyParser = require("body-parser");

const PORT = 8080;

//middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/api/products", router);

//routes
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const server = app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error on server: ${error}`));
