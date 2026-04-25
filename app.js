var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fs = require("fs");
const cors = require("cors");
const fileUpload = require("express-fileupload");
var passport = require("passport");
const multipart = require("connect-multiparty")();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// var adminRouter = require("./routes/admin");
// var configRouter = require("./routes/config");
// var pdfReportRouter = require("./routes/pdf");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({ extended: false, limit: '100mb' , parameterLimit: 1000}));
app.use(cookieParser());
app.use(
  "/static",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(__dirname + "/public")
);
app.use("/image", express.static(__dirname + "/public/img/"));
app.use("/image/drills", express.static(__dirname + "/public/drills/"));
app.use("/documents", express.static(__dirname + "/public/documents"));

app.use(cors());
app.use(passport.initialize());
app.disable("etag");

require("./config/cors")(app);
require("./router")(app);
require("./config/passport")(passport);

const buildSwaggerSpec = req => {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto
    ? forwardedProto.split(",")[0].trim()
    : req.protocol;
  const host = req.get("host");

  return {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${host}/api/v1`,
        description: "Current request host"
      }
    ]
  };
};

app.get("/api-docs.json", (req, res) => {
  res.json(buildSwaggerSpec(req));
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  (req, res, next) => {
    swaggerUi.setup(buildSwaggerSpec(req), {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true
      }
    })(req, res, next);
  }
);

// app.use("/admin", adminRouter);
// app.use("/config", configRouter);
// app.use("/report", pdfReportRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err.message);

  // render the error page
  res.status(err.status || 500);
  res.render("error", { error: err });
});

module.exports = app;