var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// connect to database
const connectToMongoose = require("./database/connect");
connectToMongoose();

var app = express();
const { v4: uuidv4 } = require("uuid");
const Customer = require("./database/customerModel");
const Product = require("./database/productModel");
const { appPackageJson } = require("../../config/paths");
const { connect } = require("http2");
const { query } = require("express");

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

// 1. (GET) => return all users in the mock database
app.get("/allCustomers", async (_, res) => {
  const customersDatabase = await Customer.find({});
  const customers = customersDatabase.map(
    ({ id, email, password, isLoggedIn }) => {
      return {
        id,
        email,
        password,
        isLoggedIn,
      };
    }
  );
  res.json(customers);
});

// 2. (POST) => pass content and isCompleted to the payload => add a user
app.post("/customerSignUp", async (req, res) => {
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
  const customerFromDB = await Customer.findOne({
    email: req.body.email,
  }).exec();

  if (customerFromDB !== null) {
    console.log(400);
    res.status(400).json({
      error: "failed",
      message: "Account already exists, please login instead!",
    });
    return;
  }

  const customer = new Customer({
    id: uuidv4(),
    email: req.body.email,
    password: req.body.password,
  });

  const newCustomer = await customer.save();

  if (newCustomer === customer) {
    res.json({
      message: "New customer account signed up successfully",
      status: "201",
      newCustomer: {
        id: newCustomer.id,
        email: newCustomer.email,
        password: newCustomer.password,
        isLoggedIn: newCustomer.isLoggedIn,
      },
    });
    return;
  }

  res.status("400").json({
    message: "Add todo failed",
  });
});

// 3. (PUT method) =>
// verify if account exists? password match? =>
// change isLoggedIn status to true.
app.put("/customerSignIn", async (req, res) => {
  if (!(req.body && req.body.email && req.body.password)) {
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
  }

  // check if the account already exists.

  const customerFromDB = await Customer.findOne({ email: req.body.email });

  if (customerFromDB === null) {
    res.status(400).json({
      error: "failed",
      message: "Account does not exist!",
    });
  }

  // check if password match.
  if (customerFromDB.password !== req.body.password) {
    res.status(400).json({
      error: "failed",
      message: "False password!",
    });
  }

  const { modifiedCount } = await customerFromDB.updateOne({
    isLoggedIn: true,
  });

  if (modifiedCount) {
    res.status("200").json({
      message: "Successfully logged in!",
      status: "200",
      customer: {
        id: customerFromDB.id,
        isLoggedIn: customerFromDB.isLoggedIn,
      },
    });
    return;
  }

  res.status("404").json({
    message: "update failed",
  });
  return;
});

// 4. PUT customerSignOut
app.put("/customerSignOut", async (req, res) => {
  if (!(req.body && req.body.user)) {
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
    return;
  }

  const customerFromDB = await Customer.findOne({ id: req.body.user.id });
  const { modifiedCount } = await customerFromDB.updateOne({
    isLoggedIn: false,
  });

  if (modifiedCount) {
    res.status("200").json({
      message: "Successfully signed out!",
      status: "200",
    });
    return;
  }
});

// 5 GET customers
app.get("/customers/:id", async (req, res) => {
  const customerFromDB = await Customer.findOne({ id: req.params.id.slice(1) });
  if (customerFromDB === null) {
    res.json({
      message: "Not yet authenticated",
      status: "204",
      userStatus: "unauthenticated",
    });
    return;
  } else {
    res.json({
      message: "later devlopement needed",
      status: "200",
      userStatus: "authenticated",
    });
  }
});

// 6 POST new product
app.post("/addProduct", async (req, res) => {
  console.log(req.body);
  if (
    !(
      req.body &&
      req.body.name &&
      req.body.category &&
      req.body.quantity &&
      req.body.price &&
      req.body.id
    )
  ) {
    console.log(404);
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
    return;
  }

  const product = new Product({
    ...req.body,
  });

  const newProduct = await product.save();

  if (newProduct === product) {
    res.json({
      message: "New product added to database successfully!",
      status: "201",
    });
    return;
  }

  res.json({
    message: "server side error",
    status: "500",
  });
});

// 7 GET all products
app.get("/getAllProducts", async (_, res) => {
  const productDatabase = await Product.find({});
  const products = productDatabase.map(
    ({ id, name, detail, category, price, imgUrl, createdAt, updatedAt }) => {
      return {
        id,
        name, 
        detail,
        category, 
        price, 
        imgUrl, 
        createdAt, 
        updatedAt,
      };
    }
  );
  res.json({status: "succeed", products: products});
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