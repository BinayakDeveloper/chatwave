const mongoose = require("mongoose");

require("dotenv").config({
  path: "./secret.env",
});

const { DB_URL } = process.env;

mongoose.connect(DB_URL, { dbName: "reactchatapp" }).then(() => {
  console.log("Chat Database Connected Succeessfully");
});

let chatSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
    },
    receiver: {
      type: String,
    },
    message: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

let chatModel = new mongoose.model("chatModel", chatSchema, "chats");

module.exports = chatModel;
