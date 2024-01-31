const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import Routes
const indexRouter = require("./routes/index");

// Use Routes
app.use(indexRouter);

module.exports = app;
