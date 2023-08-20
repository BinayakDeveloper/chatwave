const mongoose = require("mongoose");

require("dotenv").config({
  path: "./secret.env",
});

const { DB_URL, DB_NAME, USERS_COLLECTION_NAME } = process.env;

mongoose.connect(DB_URL, { dbName: DB_NAME }).then(() => {
  console.log("Database Connected Succeessfully");
});

let schema = mongoose.Schema({
  uid: {
    type: Number,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  token: [
    {
      token: {
        type: String,
      },
    },
  ],
});

let registerModel = mongoose.model(
  "registerModel",
  schema,
  USERS_COLLECTION_NAME
);

module.exports = registerModel;
