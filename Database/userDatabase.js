const mongoose = require("mongoose");

require("dotenv").config({
  path: "./secret.env",
});

const { DB_URL } = process.env;

mongoose.connect(DB_URL, { dbName: "reactchatapp" }).then(() => {
  console.log("User Database Connected Succeessfully");
});

let userSchema = new mongoose.Schema({
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
  onlineStatus: {
    type: Boolean,
  },
  token: [
    {
      token: {
        type: String,
      },
    },
  ],
});

let registerModel = new mongoose.model("registerModel", userSchema, "users");

module.exports = registerModel;
