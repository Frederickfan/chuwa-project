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
const Cart = require("./database/cartModel");
const Promocode = require("./database/promoCodeModel");
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
        isAdmin: newCustomer.isAdmin,
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
        isAdmin: customerFromDB.isAdmin,
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
    ({
      id,
      name,
      detail,
      category,
      price,
      imgUrl,
      createdAt,
      updatedAt,
      quantity,
    }) => {
      return {
        id,
        name,
        detail,
        category,
        price,
        imgUrl,
        createdAt,
        updatedAt,
        quantity,
      };
    }
  );
  res.json({ status: "succeed", products: products });
});

// 8 PUT edit a product with id
app.put("/editProduct", async (req, res) => {
  console.log(req.body);
  if (!req.body) {
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
    return;
  }

  const productFromDB = await Product.findOne({ id: req.body.id });

  const { modifiedCount } = await productFromDB.updateOne({
    ...req.body,
  });
  if (modifiedCount) {
    res.status(200).json({
      message: "update succeed",
      editStatus: "succeed",
    });
    return;
  }

  res.status(500).json({
    message: "Internal Server Error",
    status: "failed",
  });
});

// 9 DELETE a product with id.
app.delete("/delProduct", async (req, res) => {
  if (!(req.body && req.body.id)) {
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
    return;
  }

  const id = req.body.id;
  const { deletedCount } = await Product.deleteOne({ id });
  if (deletedCount) {
    res.status(200).json({
      message: "delete succeed",
      status: "succeed",
    });
  } else {
    res.status(404).json({
      message: "delete failed",
      status: "failed",
    });
  }
});

// 10 GET cart with user_id
app.get("/getCart/:id", async (req, res) => {
  if (!req.body) {
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
    return;
  }

  console.log(req.params);
  const user_id = req.params.id.slice(1);
  const cartFromDB = await Cart.find({ user_id: user_id });
  console.log(`cart data from db ${cartFromDB}`);

  const cart = {};
  for (let cartData of cartFromDB) {
    cart[cartData["product_id"]] = cartData["amount"];
  }
  console.log(`cart to return to frontend is ${JSON.stringify(cart)}`);
  res.json({
    status: "succeed",
    cart: cart,
  });
});

// 11 POST add cart product
app.post("/addCartProduct", async (req, res) => {
  if (!req.body) {
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
    return;
  }

  const cartProductFromDB = await Cart.findOne({
    user_id: req.body.user_id,
    product_id: req.body.product_id,
  }).exec();

  if (cartProductFromDB !== null) {
    console.log(400);
    res.status(400).json({
      error: "failed",
      message: "Cart product already exists! modify amount instead!",
    });
    return;
  }

  const cartProduct = new Cart({
    ...req.body,
  });

  const newCartProduct = await cartProduct.save();

  if (newCartProduct === cartProduct) {
    res.json({
      message: "New product in cart created successfully",
      status: "201",
    });
    return;
  }
});

// 12 add or minus the amount in cart
app.put("/modCartAmount", async (req, res) => {
  if (!(req.body && req.body.user_id && req.body.product_id && req.body.type)) {
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
    return;
  }

  const cartProductFromDB = await Cart.findOne({
    user_id: req.body.user_id,
    product_id: req.body.product_id,
  });

  console.log(
    `The product amount waiting to be added is the cart product ${cartProductFromDB}`
  );
  const newAmount =
    req.body.type === "+"
      ? Number(cartProductFromDB.amount) + 1
      : Number(cartProductFromDB.amount) - 1;
  const { modifiedCount } = await cartProductFromDB.updateOne({
    amount: newAmount,
  });
  if (modifiedCount) {
    res.status(200).json({
      message: "cart product modified by 1 succeed",
      status: "succeed",
    });
    return;
  } else {
    res.status(504).json({
      message: "Internal Server error",
      status: "failed",
    });
  }
});

// DELETE the cart product
app.delete("/deleteCartProduct", async (req, res) => {
  if (!(req.body && req.body.user_id && req.body.product_id)) {
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
    return;
  }

  const { deletedCount } = await Cart.deleteOne({
    user_id: req.body.user_id,
    product_id: req.body.product_id,
  });
  if (deletedCount) {
    res.status(200).json({
      message: "delete succeed",
      status: "succeed",
    });
  } else {
    res.status(404).json({
      message: "delete failed",
      status: "failed",
    });
  }
});

//  CREATE new promotion code
app.post("/createPromocode", async (req, res) => {
  if (!(req.body && req.body.promocode && req.body.discount)) {
    res.status(404).json({
      error: "failed",
      message: "Input is not valid",
    });
    return;
  }

  // check if the promotion code already exists.
  const promocodeFromDB = await Promocode.findOne({
    promocode: req.body.promocode,
  }).exec();

  if (promocodeFromDB !== null) {
    console.log(400);
    res.status(400).json({
      code: "400",
      status: "failed",
      message: "Promotion code already exists, please create a new one!",
    });
    return;
  }

  const promocode = new Promocode({
    promocode: req.body.promocode,
    discount: req.body.discount,
  });

  const newPromocode = await promocode.save();

  if (newPromocode === promocode) {
    res.json({
      message: "New promotion code created successfully",
      status: "succeed",
      code: "201",
    });
    return;
  }

  res.status("500").json({
    message: "Add promotion failed, status 400",
    status: "failed",
    code: "500",
  });
});

// GET discount 
app.get("/getPromocode/:promocode", async(req, res) => {
  const promocodeFromDB = await Promocode.findOne({ promocode: req.params.promocode.slice(1) });
  if (promocodeFromDB === null) {
    console.log("code does not exist");
    res.json({
      message: "Promotion code does not exit.",
      status: "204",
    });
    return;
  } else {
    res.json({
      status: "200",
      message: "Succeed!",
      discount: promocodeFromDB.discount,
    });
  }
})

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
