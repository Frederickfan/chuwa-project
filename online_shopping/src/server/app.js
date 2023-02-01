var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
const { v4: uuidv4 } = require("uuid");
const { appPackageJson } = require("../../config/paths");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
// mock database
let customers = [
  {
    id: uuidv4(),
    email: "fzm960206@gmail.com",
    password: "fufu",
    isLoggedIn: false,
  },
  {
    id: uuidv4(),
    email: "dxn1226@mit.edu",
    password: "dxn",
    isLoggedIn: false,
  },
  {
    id: uuidv4(),
    email: "fufu2460@nyu.edu",
    password: "fufu",
    isLoggedIn: false,
  },
];

// 1. (GET) => return all users in the mock database
app.get("/allCustomers", (_, res) => {
  res.json(customers);
});

// 2. (POST) => pass content and isCompleted to the payload => add a user
app.post("/customerSignUp", (req, res) => {
  console.log(req.body);
  if (!(req.body && req.body.email && req.body.password)) {
    console.log(404);
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
    return;
  }

  // check if the account already exists.
  const customer = customers.find((customer) => {
    return customer.email === req.body.email;
  });

  if (customer !== undefined) {
    console.log(400);
    res.status(400).json({
      error: "failed",
      message: "Account already exists, please login instead!",
    });
    return;
  }

  customers = [...customers, { ...req.body, id: uuidv4(), isLoggedIn: false }];
  console.log(customers);
  res.json({
    message: "New customer account signed up successfully",
    status: "201",
  });
});

// 3. (PUT method) =>
// verify if account exists? password match? =>
// change isLoggedIn status to true.
app.put("/customerSignIn", (req, res) => {
  if (!(req.body && req.body.email && req.body.password)) {
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
  }

  // check if the account already exists.
  const customer = customers.find((customer) => {
    return customer.email === req.body.email;
  });

  if (customer === undefined) {
    res.status(400).json({
      error: "failed",
      message: "Account does not exist!",
    });
  }

  // check if password match.
  if (customer.password !== req.body.password) {
    res.status(400).json({
      error: "failed",
      message: "False password!",
    });
  }

  customer.isLoggedIn = true;
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
