const express = require("express");
const users = require("./users");

const app = express();

app.use("/u/", users);

module.exports = app;
