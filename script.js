const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const database = require("./Database/userDatabase.js");
const register = require("./Account Operations/Register.js");
const login = require("./Account Operations/Login.js");
const { sendMails } = require("./Nodemailer/Mailer.js");
const {
  genLink,
  updatePass,
  changePass,
} = require("./Account Operations/Forgot.js");

dotenv.config({
  path: "./secret.env",
});

let { PORT, SECRET_KEY } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.json({
    status: true,
    message: "Welcome To My API",
  });
});

app.post("/getData/:token", async (req, res) => {
  let { token } = req.params;
  let verify = await jwt.verify(token, SECRET_KEY);
  let user = await database.findById(verify._id);
  if (user !== null) {
    res.json({
      status: true,
      uid: user.uid,
      username: user.username,
      email: user.email,
      token: user.token,
    });
  } else {
    res.json({
      status: false,
      message: "No User Found",
    });
  }
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

app.post("/changePass/:uid/:token", async (req, res) => {
  changePass(req, res, database, jwt);
});

app.post("/updatePass/:email", async (req, res) => {
  updatePass(req, res, database, bcrypt);
});

app.listen(PORT || 500, () => {
  console.log("Listening On PORT", PORT);
});
