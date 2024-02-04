const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Import Routes
const indexRouter = require("./routes/index");

// Use Routes

app.use(express.static("public"));
app.use(indexRouter);

module.exports = app;
