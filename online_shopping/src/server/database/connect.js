const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://Fzm-951218:FuFu-1226@cluster0.acim4qq.mongodb.net/online-shopping?retryWrites=true&w=majority";

const connectToMongoose = () => {
  mongoose.connect(connectionString);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console), "connection error");
  db.on("open", () => {
    console.log("connect to mongodb !");
  });
};

module.exports = connectToMongoose;
