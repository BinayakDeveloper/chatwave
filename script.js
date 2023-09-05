const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const database = require("./Database/userDatabase.js");
const chatDatabase = require("./Database/chatDatabase.js");
const register = require("./Account Operations/Register.js");
const login = require("./Account Operations/Login.js");
const getUserData = require("./Account Operations/GetUserData.js");
const allUsers = require("./Account Operations/AllUsers.js");
const { sendMails } = require("./Nodemailer/Mailer.js");
const {
  genLink,
  tokenValidate,
  updatePass,
} = require("./Account Operations/Forgot.js");
const socketJs = require("./Socket Operations/socket.js");
const sendMessage = require("./Chat Operations/sendMessage.js");
const retriveChats = require("./Chat Operations/retriveChats.js");

dotenv.config({
  path: "./secret.env",
});

let { SECRET_KEY } = process.env;

let PORT = process.env.PORT || 2005;

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://chatwave.vercel.app/",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/getData", async (req, res) => {
  getUserData(req, res, SECRET_KEY, jwt, database);
});

app.post("/allUsers", async (req, res) => {
  allUsers(req, res, SECRET_KEY, database);
});

app.post("/login", async (req, res) => {
  login(req, res, database, bcrypt);
});

app.post("/register", async (req, res) => {
  register(req, res, database, bcrypt);
});

app.post("/genLink", async (req, res) => {
  genLink(req, res, database, jwt, sendMails);
});

app.post("/tokenValidate/:uid/:token", async (req, res) => {
  tokenValidate(req, res, database, jwt);
});

app.post("/updatePass/:email", async (req, res) => {
  updatePass(req, res, database, bcrypt);
});

// Chat Apis

app.post("/sendMessage", async (req, res) => {
  sendMessage(req, res, chatDatabase, SECRET_KEY);
});

app.post("/retriveChats", async (req, res) => {
  retriveChats(req, res, SECRET_KEY, chatDatabase);
});

// Socket Listeners

socketJs(io, jwt, SECRET_KEY, database);

server.listen(PORT, () => {
  console.log("Listening On PORT", PORT);
});
