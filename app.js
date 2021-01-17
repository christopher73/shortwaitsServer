/**
 * ShortWaits
 * @author Christopher Fajardo
 *
 */
const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const apiResponse = require("./helpers/apiResponse");
const cors = require("cors");

const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
  return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
  if (err.name == "UnauthorizedError") {
    return apiResponse.unauthorizedResponse(res, err.message);
  }
});

module.exports = app;
