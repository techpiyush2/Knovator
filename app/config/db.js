"use strict";

const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection failed"));
db.once("open", function () {
  console.log("Database Connected Successfully!");
});
