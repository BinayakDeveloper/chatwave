const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "./secret.env" });

const { SECRET_KEY } = process.env;

async function register(req, res, database, bcrypt) {
  let { username, email, password } = req.body;
  let users = await database.find({});
  if (users.length === 0) {
    let hashedPassword = await bcrypt.hash(password, 10);
    let userData = await database({
      uid: 1000,
      username,
      email,
      password: hashedPassword,
      onlineStatus: false,
    });

    let token = await jwt.sign({ _id: userData._id }, SECRET_KEY);

    userData.token = userData.token.concat({ token });

    await userData.save();

    res.json({
      status: true,
      message: "User Registered Successfully",
    });
  } else {
    let userExistance = await database.findOne({ email: email });

    if (userExistance !== null) {
      res.json({
        status: false,
        message: "User Already Exists!!",
      });
    } else if (userExistance == null) {
      let users = await database.find({});
      let newUid = users[users.length - 1].uid + 1;
      let hashedPassword = await bcrypt.hash(password, 10);
      let userData = await database({
        uid: newUid,
        username,
        email,
        password: hashedPassword,
        onlineStatus: false,
      });

      let token = await jwt.sign({ _id: userData._id }, SECRET_KEY);

      userData.token = userData.token.concat({ token });

      await userData.save();

      res.json({
        status: true,
        message: "User Registered Successfully",
      });
    }
  }
}

module.exports = register;
